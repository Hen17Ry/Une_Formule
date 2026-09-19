import { defineEventHandler } from 'h3'
import { drizzleDb } from '../db/drizzle'
import { getRedisStatus } from '../services/redis'

export default defineEventHandler(async () => {
  const redis = await getRedisStatus()
  let postgresConnected = false

  try {
    const stats = await drizzleDb.getDashboardStats()
    postgresConnected = stats !== null
  } catch {
    postgresConnected = false
  }

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      postgres: {
        connected: postgresConnected,
        provider: process.env.DATABASE_URL ? 'Neon Tech / Cloud Postgres' : 'Local / Fallback Postgres'
      },
      redis: {
        connected: redis.connected,
        provider: redis.provider
      }
    }
  }
})
