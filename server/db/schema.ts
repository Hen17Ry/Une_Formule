import { pgTable, serial, text, varchar, integer, timestamp, index, jsonb, boolean } from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('ADMIN'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

/** Retours des lecteurs : sur un levier (chapitre) ou sur le livre en général. */
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  kind: varchar('kind', { length: 16 }).notNull(), // LEVER | GENERAL
  lever: integer('lever'), // 1..7 si kind = LEVER
  practiced: varchar('practiced', { length: 16 }), // FULL | PARTIAL | NOT_YET
  rating: integer('rating').notNull(),
  consent: varchar('consent', { length: 16 }).notNull(), // ANONYMOUS | FIRST_NAME | NO
  firstName: varchar('first_name', { length: 120 }),
  email: varchar('email', { length: 255 }),
  answers: jsonb('answers').$type<Record<string, string>>().notNull().default({}),
  publicQuote: text('public_quote'),
  status: varchar('status', { length: 16 }).notNull().default('PENDING'), // PENDING | APPROVED | REJECTED
  featured: boolean('featured').notNull().default(false),
  moderatedBy: varchar('moderated_by', { length: 255 }),
  moderatedAt: timestamp('moderated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, table => [
  index('idx_reviews_status').on(table.status),
  index('idx_reviews_lever').on(table.lever)
])

export const settings = pgTable('settings', {
  key: varchar('key', { length: 64 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  entity: varchar('entity', { length: 24 }).notNull(), // review | order | settings | auth
  entityId: integer('entity_id'),
  action: varchar('action', { length: 64 }).notNull(),
  actor: varchar('actor', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

/** Ancienne table (version précédente du site) — conservée pour migration. */
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  allowPublication: varchar('allow_publication', { length: 50 }).notNull().default('FIRST_NAME'),
  status: varchar('status', { length: 50 }).notNull().default('PENDING'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})
