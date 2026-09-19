import { defineEventHandler, getCookie, createError } from 'h3'
import { drizzleDb } from '../../../db/drizzle'
import { invalidateApprovedTestimonialsCache } from '../../../services/redis'

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'formula_admin_session')
  if (session !== 'admin_authenticated_token_2026') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès non autorisé.'
    })
  }

  const idParam = event.context.params?.id
  const id = idParam ? Number(idParam) : 0
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID invalide.'
    })
  }

  const adminEmail = 'admin@uneformule.fr'
  const deleted = await drizzleDb.deleteTestimonial(id, adminEmail)
  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Témoignage non trouvé.'
    })
  }

  // Purge Redis cache
  await invalidateApprovedTestimonialsCache()

  return {
    success: true,
    message: 'Témoignage supprimé et cache purgé.'
  }
})
