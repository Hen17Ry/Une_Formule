import { defineEventHandler, getCookie, getQuery, createError } from 'h3'
import { drizzleDb } from '../../db/drizzle'

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'formula_admin_session')
  if (session !== 'admin_authenticated_token_2026') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès non autorisé.'
    })
  }

  const query = getQuery(event)
  let list = await drizzleDb.getAllTestimonials()

  // Filter by status (ALL, PENDING, APPROVED, REJECTED)
  if (query.status && query.status !== 'ALL') {
    list = list.filter(t => t.status === query.status)
  }

  // Filter by rating
  if (query.rating && query.rating !== 'ALL') {
    const rat = Number(query.rating)
    list = list.filter(t => t.rating === rat)
  }

  // Search filter
  if (query.search) {
    const searchStr = String(query.search).toLowerCase()
    list = list.filter(t =>
      t.firstName.toLowerCase().includes(searchStr) ||
      t.content.toLowerCase().includes(searchStr) ||
      (t.email && t.email.toLowerCase().includes(searchStr))
    )
  }

  return {
    success: true,
    data: list
  }
})
