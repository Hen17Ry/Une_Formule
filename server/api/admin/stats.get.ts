import { defineEventHandler, getCookie, createError } from 'h3'
import { drizzleDb } from '../../db/drizzle'

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'formula_admin_session')
  if (session !== 'admin_authenticated_token_2026') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès non autorisé.'
    })
  }

  const stats = await drizzleDb.getDashboardStats()
  return {
    success: true,
    data: stats
  }
})
