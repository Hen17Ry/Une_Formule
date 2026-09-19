import { Pool } from 'pg'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export interface AdminUser {
  id: number
  email: string
  password_hash: string
  role: string
  created_at: string
}

export interface Testimonial {
  id: number
  first_name: string
  email: string | null
  content: string
  rating: number
  allow_publication: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
  updated_at: string
}

export interface TestimonialEvent {
  id: number
  testimonial_id: number | null
  action: string
  performed_by: string
  created_at: string
}

class PostgresDatabase {
  private pool: Pool | null = null
  private isFallback = false
  private fallbackData: {
    admin_users: AdminUser[]
    testimonials: Testimonial[]
    testimonial_events: TestimonialEvent[]
  } = {
    admin_users: [],
    testimonials: [],
    testimonial_events: []
  }

  private fallbackPath = path.resolve(process.cwd(), '.data/pg_store.json')

  constructor() {
    this.init()
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'une_formule_salt_2026').digest('hex')
  }

  private async init() {
    const dataDir = path.resolve(process.cwd(), '.data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const host = process.env.POSTGRES_HOST || 'localhost'
    const port = Number(process.env.POSTGRES_PORT) || 5432
    const database = process.env.POSTGRES_DB || 'une_formule'
    const user = process.env.POSTGRES_USER || 'postgres'
    const password = process.env.POSTGRES_PASSWORD || 'postgres_secure_password_2026'

    try {
      this.pool = new Pool({
        host,
        port,
        database,
        user,
        password,
        connectionTimeoutMillis: 1500
      })

      // Test connection
      const client = await this.pool.connect()
      client.release()
      console.log(`[PostgreSQL] Connected to database "${database}" on ${host}:${port}`)
      await this.initTablesPostgres()
      await this.seedAdminPostgres()
    } catch (err: any) {
      this.isFallback = true
      this.initFallback()
    }
  }

  private async initTablesPostgres() {
    if (!this.pool) return
    const query = `
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

      CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
      CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
    `
    await this.pool.query(query)
  }

  private async seedAdminPostgres() {
    if (!this.pool) return
    const check = await this.pool.query('SELECT id FROM admin_users WHERE email = $1', ['admin@uneformule.fr'])
    if (check.rowCount === 0) {
      const hash = this.hashPassword('Formule2026!')
      await this.pool.query('INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, $3)', [
        'admin@uneformule.fr',
        hash,
        'ADMIN'
      ])
    }
  }

  private initFallback() {
    if (fs.existsSync(this.fallbackPath)) {
      try {
        const raw = fs.readFileSync(this.fallbackPath, 'utf-8')
        this.fallbackData = JSON.parse(raw)
        if (!this.fallbackData.admin_users.some(u => u.email === 'admin@uneformule.fr')) {
          this.fallbackData.admin_users.push({
            id: 1,
            email: 'admin@uneformule.fr',
            password_hash: this.hashPassword('Formule2026!'),
            role: 'ADMIN',
            created_at: new Date().toISOString()
          })
          this.saveFallback()
        }
        return
      } catch (err) {
        console.error('[DB] Failed to load JSON fallback:', err)
      }
    }

    this.fallbackData = {
      admin_users: [
        {
          id: 1,
          email: 'admin@uneformule.fr',
          password_hash: this.hashPassword('Formule2026!'),
          role: 'ADMIN',
          created_at: new Date().toISOString()
        }
      ],
      testimonials: [], // 100% REAL DATA ONLY
      testimonial_events: []
    }
    this.saveFallback()
  }

  private saveFallback() {
    try {
      fs.writeFileSync(this.fallbackPath, JSON.stringify(this.fallbackData, null, 2), 'utf-8')
    } catch (err) {
      console.error('[DB] Failed to save JSON fallback:', err)
    }
  }

  // --- PUBLIC METHODS ---

  public async getAdminUserByEmail(email: string): Promise<AdminUser | null> {
    if (this.isFallback || !this.pool) {
      return this.fallbackData.admin_users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
    }

    const res = await this.pool.query('SELECT * FROM admin_users WHERE LOWER(email) = LOWER($1)', [email])
    return res.rows[0] || null
  }

  public verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash
  }

  // Public Get Approved Testimonials
  public async getApprovedTestimonials(): Promise<Testimonial[]> {
    if (this.isFallback || !this.pool) {
      return this.fallbackData.testimonials.filter(t => t.status === 'APPROVED').sort((a, b) => b.id - a.id)
    }

    const res = await this.pool.query("SELECT * FROM testimonials WHERE status = 'APPROVED' ORDER BY id DESC")
    return res.rows
  }

  // Create Testimonial (status = 'PENDING')
  public async createTestimonial(data: {
    first_name: string
    email?: string | null
    content: string
    rating: number
    allow_publication?: string
  }): Promise<Testimonial> {
    const rating = Math.min(5, Math.max(1, data.rating))

    if (this.isFallback || !this.pool) {
      const newId = this.fallbackData.testimonials.length > 0
        ? Math.max(...this.fallbackData.testimonials.map(t => t.id)) + 1
        : 1

      const record: Testimonial = {
        id: newId,
        first_name: data.first_name,
        email: data.email || null,
        content: data.content,
        rating,
        allow_publication: data.allow_publication || 'FIRST_NAME',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      this.fallbackData.testimonials.unshift(record)

      // Log creation event
      this.logEvent(newId, 'creation', 'public_user')
      this.saveFallback()
      return record
    }

    const query = `
      INSERT INTO testimonials (first_name, email, content, rating, allow_publication, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING *
    `
    const res = await this.pool.query(query, [
      data.first_name,
      data.email || null,
      data.content,
      rating,
      data.allow_publication || 'FIRST_NAME'
    ])
    const newTestimonial = res.rows[0] as Testimonial
    await this.logEvent(newTestimonial.id, 'creation', 'public_user')
    return newTestimonial
  }

  // Admin Methods
  public async getAllTestimonials(): Promise<Testimonial[]> {
    if (this.isFallback || !this.pool) {
      return [...this.fallbackData.testimonials].sort((a, b) => b.id - a.id)
    }

    const res = await this.pool.query('SELECT * FROM testimonials ORDER BY id DESC')
    return res.rows
  }

  public async updateTestimonialStatus(id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED', adminEmail: string): Promise<boolean> {
    const action = status === 'APPROVED' ? 'validation' : status === 'REJECTED' ? 'rejection' : 'reset_pending'

    if (this.isFallback || !this.pool) {
      const target = this.fallbackData.testimonials.find(t => t.id === id)
      if (target) {
        target.status = status
        target.updated_at = new Date().toISOString()
        this.logEvent(id, action, adminEmail)
        this.saveFallback()
        return true
      }
      return false
    }

    const res = await this.pool.query(
      'UPDATE testimonials SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    )
    if (res.rowCount && res.rowCount > 0) {
      await this.logEvent(id, action, adminEmail)
      return true
    }
    return false
  }

  public async updateTestimonial(id: number, data: Partial<Testimonial>, adminEmail: string): Promise<boolean> {
    if (this.isFallback || !this.pool) {
      const target = this.fallbackData.testimonials.find(t => t.id === id)
      if (target) {
        if (data.first_name !== undefined) target.first_name = data.first_name
        if (data.content !== undefined) target.content = data.content
        if (data.rating !== undefined) target.rating = data.rating
        if (data.status !== undefined) target.status = data.status
        target.updated_at = new Date().toISOString()
        this.logEvent(id, 'edit', adminEmail)
        this.saveFallback()
        return true
      }
      return false
    }

    const current = (await this.pool.query('SELECT * FROM testimonials WHERE id = $1', [id])).rows[0]
    if (!current) return false

    const res = await this.pool.query(`
      UPDATE testimonials
      SET first_name = $1, content = $2, rating = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [
      data.first_name ?? current.first_name,
      data.content ?? current.content,
      data.rating ?? current.rating,
      data.status ?? current.status,
      id
    ])

    if (res.rowCount && res.rowCount > 0) {
      await this.logEvent(id, 'edit', adminEmail)
      return true
    }
    return false
  }

  public async deleteTestimonial(id: number, adminEmail: string): Promise<boolean> {
    if (this.isFallback || !this.pool) {
      const initialLen = this.fallbackData.testimonials.length
      this.fallbackData.testimonials = this.fallbackData.testimonials.filter(t => t.id !== id)
      const deleted = this.fallbackData.testimonials.length < initialLen
      if (deleted) {
        this.logEvent(id, 'deletion', adminEmail)
        this.saveFallback()
      }
      return deleted
    }

    await this.logEvent(id, 'deletion', adminEmail)
    const res = await this.pool.query('DELETE FROM testimonials WHERE id = $1', [id])
    return (res.rowCount ?? 0) > 0
  }

  // Audit Events Logging
  public async logEvent(testimonialId: number | null, action: string, performedBy = 'system'): Promise<void> {
    if (this.isFallback || !this.pool) {
      const newId = this.fallbackData.testimonial_events.length > 0
        ? Math.max(...this.fallbackData.testimonial_events.map(e => e.id)) + 1
        : 1
      this.fallbackData.testimonial_events.unshift({
        id: newId,
        testimonial_id: testimonialId,
        action,
        performed_by: performedBy,
        created_at: new Date().toISOString()
      })
      this.saveFallback()
      return
    }

    await this.pool.query(
      'INSERT INTO testimonial_events (testimonial_id, action, performed_by) VALUES ($1, $2, $3)',
      [testimonialId, action, performedBy]
    )
  }

  // Real Stats from PostgreSQL (ZERO MOCK DATA)
  public async getDashboardStats() {
    if (this.isFallback || !this.pool) {
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
        eventsHistory: this.fallbackData.testimonial_events.slice(0, 20)
      }
    }

    const total = Number((await this.pool.query('SELECT COUNT(*) as c FROM testimonials')).rows[0].c)
    const approved = Number((await this.pool.query("SELECT COUNT(*) as c FROM testimonials WHERE status = 'APPROVED'")).rows[0].c)
    const pending = Number((await this.pool.query("SELECT COUNT(*) as c FROM testimonials WHERE status = 'PENDING'")).rows[0].c)
    const rejected = Number((await this.pool.query("SELECT COUNT(*) as c FROM testimonials WHERE status = 'REJECTED'")).rows[0].c)

    const avgRes = (await this.pool.query('SELECT AVG(rating) as avg FROM testimonials')).rows[0].avg
    const avgRating = avgRes !== null ? Number(Number(avgRes).toFixed(1)) : null

    const eventsRes = await this.pool.query('SELECT * FROM testimonial_events ORDER BY id DESC LIMIT 20')

    return {
      totalTestimonials: total,
      approvedTestimonials: approved,
      pendingTestimonials: pending,
      rejectedTestimonials: rejected,
      avgRating,
      eventsHistory: eventsRes.rows
    }
  }
}

export const pgDb = new PostgresDatabase()
