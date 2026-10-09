import type { H3Event } from 'h3'
import Redis from 'ioredis'

/* Limiteur simple : Redis si REDIS_URL est défini, sinon mémoire du processus. */

let redis: Redis | null = null
const url = process.env.REDIS_URL || process.env.KV_URL
if (url) {
  try {
    redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true, enableOfflineQueue: false, connectTimeout: 2500, commandTimeout: 1500 })
    redis.on('error', () => {})
    redis.connect().catch(() => { redis = null })
  } catch {
    redis = null
  }
}

const memory = new Map<string, { count: number, resetAt: number }>()

export async function rateLimit(event: H3Event, bucket: string, max: number, windowSec: number) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'local'
  const key = `uf:rl:${bucket}:${ip}`

  if (redis && redis.status === 'ready') {
    try {
      const count = await redis.incr(key)
      if (count === 1) await redis.expire(key, windowSec)
      if (count > max) {
        const ttl = await redis.ttl(key)
        throw tooMany(ttl)
      }
      return
    } catch (err: any) {
      if (err?.statusCode === 429) throw err
      // Redis indisponible : on retombe sur la limite en mémoire.
    }
  }

  const nowMs = Date.now()
  const entry = memory.get(key)
  if (!entry || entry.resetAt < nowMs) {
    memory.set(key, { count: 1, resetAt: nowMs + windowSec * 1000 })
    if (memory.size > 5000) for (const [k, v] of memory) if (v.resetAt < nowMs) memory.delete(k)
    return
  }
  entry.count++
  if (entry.count > max) throw tooMany(Math.ceil((entry.resetAt - nowMs) / 1000))
}

function tooMany(seconds: number) {
  const minutes = Math.max(1, Math.ceil(seconds / 60))
  return createError({ statusCode: 429, statusMessage: `Trop de tentatives. Réessayez dans ${minutes} minute${minutes > 1 ? 's' : ''}.` })
}
