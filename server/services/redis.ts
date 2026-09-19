import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL
const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6382
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined

let redisClient: Redis | null = null
let memoryCache: Record<string, { value: string; expiresAt: number }> = {}

try {
  if (REDIS_URL) {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 2 ? null : 200),
      lazyConnect: true
    })
  } else {
    redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 2) return null // Stop retrying quickly if Redis is not running locally
        return 200
      },
      lazyConnect: true
    })
  }

  redisClient.on('error', () => {
    // Silent memory fallback
  })
} catch {
  redisClient = null
}

const CACHE_KEY_APPROVED = 'approved_testimonials'

/**
 * Get cached approved testimonials
 */
export async function getCachedApprovedTestimonials(): Promise<any[] | null> {
  if (redisClient && redisClient.status === 'ready') {
    try {
      const cached = await redisClient.get(CACHE_KEY_APPROVED)
      if (cached) return JSON.parse(cached)
    } catch (err) {
      console.warn('[Redis] Error reading cache:', err)
    }
  }

  // Memory fallback check
  const memItem = memoryCache[CACHE_KEY_APPROVED]
  if (memItem && memItem.expiresAt > Date.now()) {
    return JSON.parse(memItem.value)
  }

  return null
}

/**
 * Set cached approved testimonials (TTL 1 hour)
 */
export async function setCachedApprovedTestimonials(data: any[], ttlSeconds = 3600): Promise<void> {
  const jsonStr = JSON.stringify(data)

  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.set(CACHE_KEY_APPROVED, jsonStr, 'EX', ttlSeconds)
    } catch (err) {
      console.warn('[Redis] Error writing cache:', err)
    }
  }

  // Memory fallback store
  memoryCache[CACHE_KEY_APPROVED] = {
    value: jsonStr,
    expiresAt: Date.now() + ttlSeconds * 1000
  }
}

/**
 * Invalidate public approved testimonials cache
 */
export async function invalidateApprovedTestimonialsCache(): Promise<void> {
  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.del(CACHE_KEY_APPROVED)
    } catch (err) {
      console.warn('[Redis] Error clearing cache:', err)
    }
  }

  delete memoryCache[CACHE_KEY_APPROVED]
}

/**
 * Rate Limiting helper per IP address (default: max 5 requests per 15 min window)
 */
export async function checkRateLimit(
  ip: string,
  limit = 5,
  windowSeconds = 900
): Promise<{ allowed: boolean; remaining: number; resetSeconds: number }> {
  const rateLimitKey = `rate_limit:${ip}`

  if (redisClient && redisClient.status === 'ready') {
    try {
      const current = await redisClient.incr(rateLimitKey)
      if (current === 1) {
        await redisClient.expire(rateLimitKey, windowSeconds)
      }
      const ttl = await redisClient.ttl(rateLimitKey)
      const allowed = current <= limit
      return {
        allowed,
        remaining: Math.max(0, limit - current),
        resetSeconds: ttl > 0 ? ttl : windowSeconds
      }
    } catch (err) {
      console.warn('[Redis] Rate limiting error, allowing request:', err)
    }
  }

  // Memory fallback rate limiter
  const now = Date.now()
  const memItem = memoryCache[rateLimitKey]
  if (!memItem || memItem.expiresAt < now) {
    memoryCache[rateLimitKey] = {
      value: '1',
      expiresAt: now + windowSeconds * 1000
    }
    return { allowed: true, remaining: limit - 1, resetSeconds: windowSeconds }
  }

  const currentVal = Number(memItem.value) + 1
  memItem.value = String(currentVal)
  const allowed = currentVal <= limit
  const resetSeconds = Math.ceil((memItem.expiresAt - now) / 1000)

  return {
    allowed,
    remaining: Math.max(0, limit - currentVal),
    resetSeconds
  }
}
