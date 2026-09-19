import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { eq, desc } from 'drizzle-orm'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import * as schema from './schema'

export interface AdminUserRecord {
  id: number
  email: string
  passwordHash: string
  role: string
  createdAt: Date | string
}

export interface TestimonialRecord {
  id: number
  firstName: string
  email: string | null
  content: string
  rating: number
  allowPublication: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TestimonialEventRecord {
  id: number
  testimonialId: number | null
  action: string
  performedBy: string
  createdAt: Date | string
}

class DrizzleDatabaseManager {
  public db: ReturnType<typeof drizzle<typeof schema>> | null = null
  private pool: Pool | null = null
  private isFallback = false
  private initPromise: Promise<void> | null = null

  private fallbackData: {
    adminUsers: AdminUserRecord[]
    testimonials: TestimonialRecord[]
    testimonialEvents: TestimonialEventRecord[]
  } = {
    adminUsers: [],
    testimonials: [],
    testimonialEvents: []
  }

  private fallbackPath = path.resolve(process.cwd(), '.data/drizzle_store.json')

  constructor() {
    this.initPromise = this.init()
  }

  private async ensureInitialized() {
    if (this.initPromise) {
      try {
        await this.initPromise
      } catch (err) {
        console.warn('[Drizzle ORM] Error during initialization:', err)
      }
    }
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'une_formule_salt_2026').digest('hex')
  }

  private async init() {
    const dataDir = path.resolve(process.cwd(), '.data')
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true })
      } catch {
        // Ignored in read-only serverless environments
      }
    }

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.VERCEL_POSTGRES_URL
    const host = process.env.POSTGRES_HOST || 'localhost'
    const port = Number(process.env.POSTGRES_PORT) || 5437
    const database = process.env.POSTGRES_DB || 'une_formule'
    const user = process.env.POSTGRES_USER || 'postgres'
    const password = process.env.POSTGRES_PASSWORD || 'postgres_secure_password_2026'

    try {
      if (connectionString) {
        const isSsl = connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || connectionString.includes('supabase') || connectionString.includes('vercel')
        this.pool = new Pool({
          connectionString,
          ssl: isSsl ? { rejectUnauthorized: false } : undefined,
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          max: 10
        })
      } else {
        this.pool = new Pool({
          host,
          port,
          database,
          user,
          password,
          connectionTimeoutMillis: 2000
        })
      }

      // Test connection
      const client = await this.pool.connect()
      client.release()

      this.db = drizzle(this.pool, { schema })
      console.log('[Drizzle ORM] Connected successfully to PostgreSQL database')

      await this.initTablesAndSeed()
    } catch (err) {
      console.warn('[Drizzle ORM] PostgreSQL connection failed, switching to memory fallback:', err)
      this.isFallback = true
      this.initFallback()
    }
  }

  private async initTablesAndSeed() {
    if (!this.pool || !this.db) return

    try {
      // Execute table migrations
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS testimonials (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NULL,
          content TEXT NOT NULL,
          rating INT NOT NULL DEFAULT 5,
          allow_publication VARCHAR(50) NOT NULL DEFAULT 'FIRST_NAME',
          status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS testimonial_events (
          id SERIAL PRIMARY KEY,
          testimonial_id INT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
          action VARCHAR(100) NOT NULL,
          performed_by VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `)

      // Seed default admin
      const existing = await this.db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, 'admin@uneformule.fr'))
      if (existing.length === 0) {
        await this.db.insert(schema.adminUsers).values({
          email: 'admin@uneformule.fr',
          passwordHash: this.hashPassword('Formule2026!'),
          role: 'ADMIN'
        })
      }
    } catch (err) {
      console.error('[Drizzle ORM] Error initializing tables/seed:', err)
      this.isFallback = true
      this.initFallback()
    }
  }

  private initFallback() {
    if (fs.existsSync(this.fallbackPath)) {
      try {
        const raw = fs.readFileSync(this.fallbackPath, 'utf-8')
        this.fallbackData = JSON.parse(raw)
        if (!this.fallbackData.adminUsers.some(u => u.email === 'admin@uneformule.fr')) {
          this.fallbackData.adminUsers.push({
            id: 1,
            email: 'admin@uneformule.fr',
            passwordHash: this.hashPassword('Formule2026!'),
            role: 'ADMIN',
            createdAt: new Date().toISOString()
          })
          this.saveFallback()
        }
        return
      } catch (err) {
        console.error('[Drizzle] Failed to load JSON fallback:', err)
      }
    }

    this.fallbackData = {
      adminUsers: [
        {
          id: 1,
          email: 'admin@uneformule.fr',
          passwordHash: this.hashPassword('Formule2026!'),
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        }
      ],
      testimonials: [],
      testimonialEvents: []
    }
    this.saveFallback()
  }

  private saveFallback() {
    try {
      fs.writeFileSync(this.fallbackPath, JSON.stringify(this.fallbackData, null, 2), 'utf-8')
    } catch {
      // Ignored in read-only environments
    }
  }

  // --- PUBLIC DRIZZLE ORM METHODS ---

  public async getAdminUserByEmail(email: string): Promise<AdminUserRecord | null> {
    await this.ensureInitialized()

    if (this.isFallback || !this.db) {
      return this.fallbackData.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
    }

    const rows = await this.db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email.toLowerCase()))
    return rows[0] || null
  }

  public verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash
  }

  public formatTestimonialRecord(t: any): any {
    if (!t) return null
    const firstName = t.firstName || t.first_name || ''
    const allowPub = t.allowPublication || t.allow_publication || 'FIRST_NAME'
    const publicationName = t.publication_name || t.publicationName || (allowPub === 'ANONYMOUS' ? 'Anonyme' : firstName)
    const createdAt = t.createdAt || t.created_at || new Date().toISOString()
    const updatedAt = t.updatedAt || t.updated_at || createdAt

    return {
      ...t,
      id: t.id,
      firstName,
      first_name: firstName,
      email: t.email || null,
      content: t.content,
      rating: t.rating,
      allowPublication: allowPub,
      allow_publication: allowPub,
      publicationName,
      publication_name: publicationName,
      status: t.status,
      createdAt,
      created_at: createdAt,
      updatedAt,
      updated_at: updatedAt
    }
  }

  // Public Get Approved Testimonials (status = 'APPROVED')
  public async getApprovedTestimonials(): Promise<any[]> {
    await this.ensureInitialized()

    if (this.isFallback || !this.db) {
      return this.fallbackData.testimonials
        .filter(t => t.status === 'APPROVED')
        .sort((a, b) => b.id - a.id)
        .map(t => this.formatTestimonialRecord(t))
    }

    const rows = await this.db.select().from(schema.testimonials).where(eq(schema.testimonials.status, 'APPROVED')).orderBy(desc(schema.testimonials.id))
    return rows.map(r => this.formatTestimonialRecord(r))
  }

  // Create Testimonial with status = 'PENDING'
  public async createTestimonial(data: {
    first_name: string
    email?: string | null
    content: string
    rating: number
    allow_publication?: string
  }): Promise<any> {
    await this.ensureInitialized()
    const rating = Math.min(5, Math.max(1, data.rating))

    if (this.isFallback || !this.db) {
      const newId = this.fallbackData.testimonials.length > 0
        ? Math.max(...this.fallbackData.testimonials.map(t => t.id)) + 1
        : 1

      const record: TestimonialRecord = {
        id: newId,
        firstName: data.first_name,
        email: data.email || null,
        content: data.content,
        rating,
        allowPublication: data.allow_publication || 'FIRST_NAME',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.fallbackData.testimonials.unshift(record)

      await this.logEvent(newId, 'creation', 'public_user')
      this.saveFallback()
      return this.formatTestimonialRecord(record)
    }

    const rows = await this.db.insert(schema.testimonials).values({
      firstName: data.first_name,
      email: data.email || null,
      content: data.content,
      rating,
      allowPublication: data.allow_publication || 'FIRST_NAME',
      status: 'PENDING'
    }).returning()

    const newTestimonial = rows[0] as TestimonialRecord
    await this.logEvent(newTestimonial.id, 'creation', 'public_user')
    return this.formatTestimonialRecord(newTestimonial)
  }

  // Admin Methods
  public async getAllTestimonials(): Promise<any[]> {
    await this.ensureInitialized()

    if (this.isFallback || !this.db) {
      return [...this.fallbackData.testimonials]
        .sort((a, b) => b.id - a.id)
        .map(t => this.formatTestimonialRecord(t))
    }

    const rows = await this.db.select().from(schema.testimonials).orderBy(desc(schema.testimonials.id))
    return rows.map(r => this.formatTestimonialRecord(r))
  }

  public async updateTestimonialStatus(id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED', adminEmail: string): Promise<boolean> {
    await this.ensureInitialized()
    const action = status === 'APPROVED' ? 'validation' : status === 'REJECTED' ? 'rejection' : 'reset_pending'

    if (this.isFallback || !this.db) {
      const target = this.fallbackData.testimonials.find(t => t.id === id)
      if (target) {
        target.status = status
        target.updatedAt = new Date().toISOString()
        await this.logEvent(id, action, adminEmail)
        this.saveFallback()
        return true
      }
      return false
    }

    await this.db.update(schema.testimonials).set({
      status,
      updatedAt: new Date()
    }).where(eq(schema.testimonials.id, id))

    await this.logEvent(id, action, adminEmail)
    return true
  }

  public async updateTestimonial(id: number, data: any, adminEmail: string): Promise<boolean> {
    await this.ensureInitialized()
    const firstName = data.firstName || data.first_name || data.publication_name
    const allowPub = data.allowPublication || data.allow_publication
    const content = data.content
    const rating = data.rating
    const status = data.status

    if (this.isFallback || !this.db) {
      const target = this.fallbackData.testimonials.find(t => t.id === id)
      if (target) {
        if (firstName !== undefined) target.firstName = firstName
        if (content !== undefined) target.content = content
        if (rating !== undefined) target.rating = rating
        if (allowPub !== undefined) target.allowPublication = allowPub
        if (status !== undefined) target.status = status
        target.updatedAt = new Date().toISOString()
        await this.logEvent(id, 'edit', adminEmail)
        this.saveFallback()
        return true
      }
      return false
    }

    const updateObj: any = { updatedAt: new Date() }
    if (firstName !== undefined) updateObj.firstName = firstName
    if (content !== undefined) updateObj.content = content
    if (rating !== undefined) updateObj.rating = rating
    if (allowPub !== undefined) updateObj.allowPublication = allowPub
    if (status !== undefined) updateObj.status = status

    await this.db.update(schema.testimonials).set(updateObj).where(eq(schema.testimonials.id, id))
    await this.logEvent(id, 'edit', adminEmail)
    return true
  }

  public async deleteTestimonial(id: number, adminEmail: string): Promise<boolean> {
    await this.ensureInitialized()

    if (this.isFallback || !this.db) {
      const initialLen = this.fallbackData.testimonials.length
      this.fallbackData.testimonials = this.fallbackData.testimonials.filter(t => t.id !== id)
      const deleted = this.fallbackData.testimonials.length < initialLen
      if (deleted) {
        await this.logEvent(id, 'deletion', adminEmail)
        this.saveFallback()
      }
      return deleted
    }

    await this.logEvent(id, 'deletion', adminEmail)
    await this.db.delete(schema.testimonials).where(eq(schema.testimonials.id, id))
    return true
  }

  // Audit Event Logger
  public async logEvent(testimonialId: number | null, action: string, performedBy = 'system'): Promise<void> {
    await this.ensureInitialized()

    if (this.isFallback || !this.db) {
      const newId = this.fallbackData.testimonialEvents.length > 0
        ? Math.max(...this.fallbackData.testimonialEvents.map(e => e.id)) + 1
        : 1
      this.fallbackData.testimonialEvents.unshift({
        id: newId,
        testimonialId,
        action,
        performedBy,
        createdAt: new Date().toISOString()
      })
      this.saveFallback()
      return
    }

    await this.db.insert(schema.testimonialEvents).values({
      testimonialId,
      action,
      performedBy
    })
  }

  // Real Dashboard Stats
  public async getDashboardStats() {
    await this.ensureInitialized()

    if (this.isFallback || !this.db) {
      const testimonials = this.fallbackData.testimonials
      const totalTestimonials = testimonials.length
      const approvedTestimonials = testimonials.filter(t => t.status === 'APPROVED').length
      const pendingTestimonials = testimonials.filter(t => t.status === 'PENDING').length
      const rejectedTestimonials = testimonials.filter(t => t.status === 'REJECTED').length

      const totalRatings = testimonials.reduce((acc, t) => acc + t.rating, 0)
      const avgRating = totalTestimonials > 0 ? (totalRatings / totalTestimonials).toFixed(1) : null

      return {
        totalTestimonials,
        approvedTestimonials,
        pendingTestimonials,
        rejectedTestimonials,
        avgRating: avgRating ? Number(avgRating) : null,
        eventsHistory: this.fallbackData.testimonialEvents.slice(0, 20)
      }
    }

    const all = await this.db.select().from(schema.testimonials)
    const totalTestimonials = all.length
    const approvedTestimonials = all.filter(t => t.status === 'APPROVED').length
    const pendingTestimonials = all.filter(t => t.status === 'PENDING').length
    const rejectedTestimonials = all.filter(t => t.status === 'REJECTED').length

    const totalRatings = all.reduce((acc, t) => acc + t.rating, 0)
    const avgRating = totalTestimonials > 0 ? Number((totalRatings / totalTestimonials).toFixed(1)) : null

    const eventsHistory = await this.db.select().from(schema.testimonialEvents).orderBy(desc(schema.testimonialEvents.id)).limit(20)

    return {
      totalTestimonials,
      approvedTestimonials,
      pendingTestimonials,
      rejectedTestimonials,
      avgRating,
      eventsHistory
    }
  }
}

export const drizzleDb = new DrizzleDatabaseManager()
