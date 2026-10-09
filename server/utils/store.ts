import { drizzle } from 'drizzle-orm/node-postgres'
import { and, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm'
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import * as schema from '../db/schema'
import type { AppEvent, Order, OrderStatus, Review, ReviewStatus, ShopSettings } from '#shared/types'

/* ───────────────────────────────────────────────────────────────
   Stockage : PostgreSQL (production) ou fichier JSON local (dev).
   La même API est exposée dans les deux cas.
   ─────────────────────────────────────────────────────────────── */

export const DEFAULT_SETTINGS: ShopSettings = {
  priceXof: 32000,
  compareAtXof: null,
  saleMode: 'PREORDER',
  salesOpen: true,
  shippingFeeXof: 0,
  stock: null,
  maxPerOrder: 10,
  edition: 'Édition originale',
  deliveryNote: 'Livraison offerte à Cotonou et environs. Envoi possible partout au Bénin et dans la sous-région.',
  preorderNote: 'Précommande : votre exemplaire vous est expédié dès la sortie officielle du livre.'
}

export interface AdminUser { id: number, email: string, passwordHash: string, role: string, createdAt?: string | Date }

export type NewReview = Omit<Review, 'id' | 'status' | 'featured' | 'moderatedBy' | 'moderatedAt' | 'createdAt' | 'updatedAt' | 'publicQuote'> & { publicQuote?: string | null }
export type ReviewPatch = Partial<Pick<Review, 'status' | 'publicQuote' | 'featured' | 'firstName'>>
export type NewOrder = Omit<Order, 'id' | 'status' | 'transactionId' | 'paymentMethod' | 'paidAt' | 'adminNote' | 'createdAt' | 'updatedAt'>
export type OrderPatch = Partial<Pick<Order, 'status' | 'adminNote' | 'transactionId' | 'paymentMethod' | 'paidAt'>>

export interface ReviewFilters { status?: ReviewStatus, lever?: number | 'GENERAL', q?: string }
export interface OrderFilters { status?: OrderStatus, q?: string }

export interface Store {
  readonly kind: 'postgres' | 'file'
  getAdminByEmail(email: string): Promise<AdminUser | null>
  upsertAdmin(email: string, passwordHash: string): Promise<void>
  listAdmins(): Promise<AdminUser[]>
  deleteAdmin(id: number): Promise<boolean>

  /** Valeur technique persistée (ex. secret de session) ; créée une seule fois si absente. */
  ensureKv<T>(key: string, create: () => T): Promise<T>

  createReview(input: NewReview): Promise<Review>
  getReview(id: number): Promise<Review | null>
  listReviews(f?: ReviewFilters): Promise<Review[]>
  updateReview(id: number, patch: ReviewPatch, actor: string): Promise<Review | null>
  deleteReview(id: number): Promise<boolean>

  createOrder(input: NewOrder): Promise<Order>
  getOrderByRef(ref: string): Promise<Order | null>
  getOrderById(id: number): Promise<Order | null>
  getOrderByTransaction(transactionId: string): Promise<Order | null>
  listOrders(f?: OrderFilters): Promise<Order[]>
  updateOrder(id: number, patch: OrderPatch): Promise<Order | null>

  getSettings(): Promise<ShopSettings>
  saveSettings(next: ShopSettings): Promise<ShopSettings>

  logEvent(e: Omit<AppEvent, 'id' | 'createdAt'>): Promise<void>
  listEvents(limit?: number): Promise<AppEvent[]>
}

const now = () => new Date()

/* ─────────────────────────── PostgreSQL ─────────────────────────── */

const DDL = `
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  kind VARCHAR(16) NOT NULL,
  lever INT NULL,
  practiced VARCHAR(16) NULL,
  rating INT NOT NULL,
  consent VARCHAR(16) NOT NULL,
  first_name VARCHAR(120) NULL,
  email VARCHAR(255) NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  public_quote TEXT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  featured BOOLEAN NOT NULL DEFAULT false,
  moderated_by VARCHAR(255) NULL,
  moderated_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_lever ON reviews(lever);
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(24) UNIQUE NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  sale_mode VARCHAR(16) NOT NULL,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  country VARCHAR(80) NOT NULL,
  notes TEXT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  shipping_fee INT NOT NULL DEFAULT 0,
  total INT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'XOF',
  transaction_id VARCHAR(80) NULL,
  payment_method VARCHAR(40) NULL,
  paid_at TIMESTAMPTZ NULL,
  admin_note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_orders_transaction ON orders(transaction_id);
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(64) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  entity VARCHAR(24) NOT NULL,
  entity_id INT NULL,
  action VARCHAR(64) NOT NULL,
  actor VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`

class PgStore implements Store {
  readonly kind = 'postgres' as const
  constructor(private db: ReturnType<typeof drizzle<typeof schema>>) {}

  async getAdminByEmail(email: string) {
    const rows = await this.db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email.toLowerCase()))
    return rows[0] ?? null
  }

  async upsertAdmin(email: string, passwordHash: string) {
    await this.db.insert(schema.adminUsers)
      .values({ email: email.toLowerCase(), passwordHash, role: 'ADMIN' })
      .onConflictDoUpdate({ target: schema.adminUsers.email, set: { passwordHash } })
  }

  async listAdmins() {
    return this.db.select().from(schema.adminUsers).orderBy(schema.adminUsers.id)
  }

  async deleteAdmin(id: number) {
    const rows = await this.db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id)).returning({ id: schema.adminUsers.id })
    return rows.length > 0
  }

  async ensureKv<T>(key: string, create: () => T): Promise<T> {
    const [row] = await this.db.select().from(schema.settings).where(eq(schema.settings.key, key))
    if (row) return row.value as T
    // ON CONFLICT DO NOTHING : si deux instances démarrent en même temps, une seule valeur gagne.
    await this.db.insert(schema.settings).values({ key, value: create() as any }).onConflictDoNothing()
    const [saved] = await this.db.select().from(schema.settings).where(eq(schema.settings.key, key))
    return saved!.value as T
  }

  async createReview(input: NewReview) {
    const [row] = await this.db.insert(schema.reviews).values({ ...input, status: 'PENDING' }).returning()
    return row as Review
  }

  async getReview(id: number) {
    const [row] = await this.db.select().from(schema.reviews).where(eq(schema.reviews.id, id))
    return (row as Review) ?? null
  }

  async listReviews(f: ReviewFilters = {}) {
    const where: SQL[] = []
    if (f.status) where.push(eq(schema.reviews.status, f.status))
    if (f.lever === 'GENERAL') where.push(eq(schema.reviews.kind, 'GENERAL'))
    else if (typeof f.lever === 'number') where.push(eq(schema.reviews.lever, f.lever))
    if (f.q) {
      const like = `%${f.q}%`
      where.push(or(
        ilike(schema.reviews.firstName, like),
        ilike(schema.reviews.email, like),
        ilike(schema.reviews.publicQuote, like),
        sql`${schema.reviews.answers}::text ILIKE ${like}`
      )!)
    }
    const rows = await this.db.select().from(schema.reviews)
      .where(where.length ? and(...where) : undefined)
      .orderBy(desc(schema.reviews.createdAt))
      .limit(1000)
    return rows as Review[]
  }

  async updateReview(id: number, patch: ReviewPatch, actor: string) {
    const [row] = await this.db.update(schema.reviews)
      .set({ ...patch, updatedAt: now(), ...(patch.status ? { moderatedBy: actor, moderatedAt: now() } : {}) })
      .where(eq(schema.reviews.id, id)).returning()
    return (row as Review) ?? null
  }

  async deleteReview(id: number) {
    const rows = await this.db.delete(schema.reviews).where(eq(schema.reviews.id, id)).returning({ id: schema.reviews.id })
    return rows.length > 0
  }

  async createOrder(input: NewOrder) {
    const [row] = await this.db.insert(schema.orders).values({ ...input, status: 'PENDING' }).returning()
    return row as Order
  }

  async getOrderByRef(ref: string) {
    const [row] = await this.db.select().from(schema.orders).where(eq(schema.orders.reference, ref))
    return (row as Order) ?? null
  }

  async getOrderById(id: number) {
    const [row] = await this.db.select().from(schema.orders).where(eq(schema.orders.id, id))
    return (row as Order) ?? null
  }

  async getOrderByTransaction(transactionId: string) {
    const [row] = await this.db.select().from(schema.orders).where(eq(schema.orders.transactionId, transactionId))
    return (row as Order) ?? null
  }

  async listOrders(f: OrderFilters = {}) {
    const where: SQL[] = []
    if (f.status) where.push(eq(schema.orders.status, f.status))
    if (f.q) {
      const like = `%${f.q}%`
      where.push(or(
        ilike(schema.orders.reference, like),
        ilike(schema.orders.firstName, like),
        ilike(schema.orders.lastName, like),
        ilike(schema.orders.email, like),
        ilike(schema.orders.phone, like),
        ilike(schema.orders.city, like)
      )!)
    }
    const rows = await this.db.select().from(schema.orders)
      .where(where.length ? and(...where) : undefined)
      .orderBy(desc(schema.orders.createdAt))
      .limit(2000)
    return rows as Order[]
  }

  async updateOrder(id: number, patch: OrderPatch) {
    const [row] = await this.db.update(schema.orders)
      .set({ ...patch, paidAt: patch.paidAt ? new Date(patch.paidAt) : patch.paidAt, updatedAt: now() } as any)
      .where(eq(schema.orders.id, id)).returning()
    return (row as Order) ?? null
  }

  async getSettings() {
    const [row] = await this.db.select().from(schema.settings).where(eq(schema.settings.key, 'shop'))
    return { ...DEFAULT_SETTINGS, ...((row?.value as Partial<ShopSettings>) ?? {}) }
  }

  async saveSettings(next: ShopSettings) {
    await this.db.insert(schema.settings).values({ key: 'shop', value: next, updatedAt: now() })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value: next, updatedAt: now() } })
    return next
  }

  async logEvent(e: Omit<AppEvent, 'id' | 'createdAt'>) {
    await this.db.insert(schema.events).values(e)
  }

  async listEvents(limit = 30) {
    const rows = await this.db.select().from(schema.events).orderBy(desc(schema.events.id)).limit(limit)
    return rows as AppEvent[]
  }
}

/* ─────────────────────────── Fichier JSON (dev) ─────────────────────────── */

interface FileData {
  kv?: Record<string, unknown>
  adminUsers: AdminUser[]
  reviews: Review[]
  orders: Order[]
  settings: Partial<ShopSettings>
  events: AppEvent[]
}

class FileStore implements Store {
  readonly kind = 'file' as const
  private data: FileData = { adminUsers: [], reviews: [], orders: [], settings: {}, events: [] }

  constructor(private file: string) {
    try {
      if (fs.existsSync(file)) this.data = { ...this.data, ...JSON.parse(fs.readFileSync(file, 'utf-8')) }
    } catch (err) {
      console.error('[store] Lecture du fichier JSON impossible :', err)
    }
  }

  private save() {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true })
      fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
    } catch {
      // Environnement en lecture seule : les données restent en mémoire.
    }
  }

  private nextId(list: { id: number }[]) {
    return list.reduce((m, x) => Math.max(m, x.id), 0) + 1
  }

  async getAdminByEmail(email: string) {
    return this.data.adminUsers.find(u => u.email === email.toLowerCase()) ?? null
  }

  async upsertAdmin(email: string, passwordHash: string) {
    const existing = this.data.adminUsers.find(u => u.email === email.toLowerCase())
    if (existing) existing.passwordHash = passwordHash
    else this.data.adminUsers.push({ id: this.nextId(this.data.adminUsers), email: email.toLowerCase(), passwordHash, role: 'ADMIN', createdAt: now().toISOString() })
    this.save()
  }

  async listAdmins() {
    return [...this.data.adminUsers]
  }

  async deleteAdmin(id: number) {
    const before = this.data.adminUsers.length
    this.data.adminUsers = this.data.adminUsers.filter(u => u.id !== id)
    this.save()
    return this.data.adminUsers.length < before
  }

  async ensureKv<T>(key: string, create: () => T): Promise<T> {
    this.data.kv ??= {}
    if (!(key in this.data.kv)) {
      this.data.kv[key] = create()
      this.save()
    }
    return this.data.kv[key] as T
  }

  async createReview(input: NewReview) {
    const t = now().toISOString()
    const review: Review = {
      ...input,
      id: this.nextId(this.data.reviews),
      publicQuote: input.publicQuote ?? null,
      status: 'PENDING',
      featured: false,
      moderatedBy: null,
      moderatedAt: null,
      createdAt: t,
      updatedAt: t
    }
    this.data.reviews.unshift(review)
    this.save()
    return review
  }

  async getReview(id: number) {
    return this.data.reviews.find(r => r.id === id) ?? null
  }

  async listReviews(f: ReviewFilters = {}) {
    const q = f.q?.toLowerCase()
    return this.data.reviews
      .filter(r => !f.status || r.status === f.status)
      .filter(r => f.lever === undefined || (f.lever === 'GENERAL' ? r.kind === 'GENERAL' : r.lever === f.lever))
      .filter(r => !q || JSON.stringify([r.firstName, r.email, r.publicQuote, r.answers]).toLowerCase().includes(q))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }

  async updateReview(id: number, patch: ReviewPatch, actor: string) {
    const r = this.data.reviews.find(x => x.id === id)
    if (!r) return null
    Object.assign(r, patch, { updatedAt: now().toISOString() })
    if (patch.status) Object.assign(r, { moderatedBy: actor, moderatedAt: now().toISOString() })
    this.save()
    return r
  }

  async deleteReview(id: number) {
    const before = this.data.reviews.length
    this.data.reviews = this.data.reviews.filter(r => r.id !== id)
    this.save()
    return this.data.reviews.length < before
  }

  async createOrder(input: NewOrder) {
    const t = now().toISOString()
    const order: Order = {
      ...input,
      id: this.nextId(this.data.orders),
      status: 'PENDING',
      transactionId: null,
      paymentMethod: null,
      paidAt: null,
      adminNote: null,
      createdAt: t,
      updatedAt: t
    }
    this.data.orders.unshift(order)
    this.save()
    return order
  }

  async getOrderByRef(ref: string) { return this.data.orders.find(o => o.reference === ref) ?? null }
  async getOrderById(id: number) { return this.data.orders.find(o => o.id === id) ?? null }
  async getOrderByTransaction(tx: string) { return this.data.orders.find(o => o.transactionId === tx) ?? null }

  async listOrders(f: OrderFilters = {}) {
    const q = f.q?.toLowerCase()
    return this.data.orders
      .filter(o => !f.status || o.status === f.status)
      .filter(o => !q || [o.reference, o.firstName, o.lastName, o.email, o.phone, o.city].join(' ').toLowerCase().includes(q))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }

  async updateOrder(id: number, patch: OrderPatch) {
    const o = this.data.orders.find(x => x.id === id)
    if (!o) return null
    Object.assign(o, patch, { updatedAt: now().toISOString() })
    this.save()
    return o
  }

  async getSettings() { return { ...DEFAULT_SETTINGS, ...this.data.settings } }
  async saveSettings(next: ShopSettings) { this.data.settings = next; this.save(); return next }

  async logEvent(e: Omit<AppEvent, 'id' | 'createdAt'>) {
    this.data.events.unshift({ ...e, id: this.nextId(this.data.events), createdAt: now().toISOString() })
    this.data.events = this.data.events.slice(0, 500)
    this.save()
  }

  async listEvents(limit = 30) { return this.data.events.slice(0, limit) }
}

/* ─────────────────────────── Initialisation ─────────────────────────── */

let storePromise: Promise<Store> | null = null

async function migrateLegacyTestimonials(pool: pg.Pool) {
  // Reprend les avis de l’ancienne version du site (table testimonials) une seule fois.
  const done = await pool.query(`SELECT 1 FROM settings WHERE key = 'legacy_migrated'`)
  if (done.rowCount) return
  const legacy = await pool.query(`SELECT to_regclass('public.testimonials') AS t`)
  if (legacy.rows[0]?.t) await pool.query(`
    INSERT INTO reviews (kind, rating, consent, first_name, email, answers, public_quote, status, created_at, updated_at)
    SELECT 'GENERAL', LEAST(5, GREATEST(1, rating)),
      CASE allow_publication WHEN 'ANONYMOUS' THEN 'ANONYMOUS' WHEN 'NO' THEN 'NO' ELSE 'FIRST_NAME' END,
      first_name, email, jsonb_build_object('changed', content), content, status, created_at, updated_at
    FROM testimonials
  `)
  await pool.query(`INSERT INTO settings (key, value) VALUES ('legacy_migrated', 'true'::jsonb) ON CONFLICT (key) DO NOTHING`)
}

async function createStore(): Promise<Store> {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NUXT_DATABASE_URL
  const hasDiscreteConfig = !!process.env.POSTGRES_HOST

  if (url || hasDiscreteConfig) {
    try {
      const ssl = url && /sslmode=require|neon\.tech|supabase|vercel-storage|render\.com/.test(url)
      const pool = url
        ? new pg.Pool({ connectionString: url, ssl: ssl ? { rejectUnauthorized: false } : undefined, max: 5, connectionTimeoutMillis: 6000 })
        : new pg.Pool({
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT) || 5432,
            database: process.env.POSTGRES_DB || 'une_formule',
            user: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD,
            max: 5,
            connectionTimeoutMillis: 4000
          })
      await pool.query(DDL)
      await migrateLegacyTestimonials(pool).catch(err => console.warn('[store] Migration des anciens témoignages ignorée :', err?.message))
      console.info('[store] PostgreSQL connecté')
      return new PgStore(drizzle(pool, { schema }))
    } catch (err: any) {
      console.error('[store] PostgreSQL injoignable, bascule sur le stockage fichier :', err?.message)
    }
  }

  const dir = process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), '.data')
  console.warn(`[store] Stockage fichier (${dir}) — à n’utiliser qu’en développement.`)
  return new FileStore(path.join(dir, 'une-formule.json'))
}

export function useStore(): Promise<Store> {
  if (!storePromise) storePromise = createStore()
  return storePromise
}
