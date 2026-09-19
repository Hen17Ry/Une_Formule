import { pgTable, serial, text, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('ADMIN'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  allowPublication: varchar('allow_publication', { length: 50 }).notNull().default('FIRST_NAME'),
  status: varchar('status', { length: 50 }).notNull().default('PENDING'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    statusIdx: index('idx_testimonials_status').on(table.status),
    ratingIdx: index('idx_testimonials_rating').on(table.rating)
  }
})

export const testimonialEvents = pgTable('testimonial_events', {
  id: serial('id').primaryKey(),
  testimonialId: integer('testimonial_id').references(() => testimonials.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  performedBy: varchar('performed_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
