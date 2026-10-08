import { defineConfig } from 'drizzle-kit'

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: url
    ? { url }
    : {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5437,
        database: process.env.POSTGRES_DB || 'une_formule',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        ssl: false
      }
})
