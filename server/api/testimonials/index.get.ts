import { defineEventHandler } from 'h3'
import { drizzleDb } from '../../db/drizzle'
import { getCachedApprovedTestimonials, setCachedApprovedTestimonials } from '../../services/redis'

export default defineEventHandler(async () => {
  // 1. Check Redis Cache
  const cached = await getCachedApprovedTestimonials()
  if (cached) {
    return {
      success: true,
      source: 'redis_cache',
      data: cached
    }
  }

  // 2. Query Approved Testimonials via Drizzle ORM (status = 'APPROVED')
  const approvedTestimonials = await drizzleDb.getApprovedTestimonials()

  // 3. Set Redis Cache
  await setCachedApprovedTestimonials(approvedTestimonials)

  return {
    success: true,
    source: 'drizzle_orm',
    data: approvedTestimonials
  }
})
