import { defineEventHandler, getCookie, readBody, createError } from 'h3'
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

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Corps de requête invalide.'
    })
  }

  const adminEmail = 'admin@uneformule.fr'
  let updated = false

  if (body.status) {
    updated = await drizzleDb.updateTestimonialStatus(id, body.status, adminEmail)
  } else {
    updated = await drizzleDb.updateTestimonial(id, body, adminEmail)
  }

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Témoignage non trouvé.'
    })
  }

  // Purge Redis cache
  await invalidateApprovedTestimonialsCache()

  return {
    success: true,
    message: 'Témoignage mis à jour et cache purgé.'
  }
})
