import { defineEventHandler, readBody, getRequestIP, createError } from 'h3'
import { drizzleDb } from '../../db/drizzle'
import { checkRateLimit } from '../../services/redis'
import { sanitizeInput, isValidEmail } from '../../utils/security'

export default defineEventHandler(async (event) => {
  // 1. IP Rate Limiting via Redis (Max 10 submissions per 15 min per IP)
  const clientIP = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const rateLimit = await checkRateLimit(clientIP, 10, 900)

  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: `Limite d'envoi atteinte. Veuillez attendre ${Math.ceil(rateLimit.resetSeconds / 60)} minute(s) avant de renouveler votre transmission.`
    })
  }

  // 2. Body Reading & Validation
  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Formulaire invalide.'
    })
  }

  const rawContent = String(body.content || body.message || '').trim()
  const rawEmail = body.email ? String(body.email).trim() : ''
  const rating = Number(body.rating) || 5

  let rawFirstName = String(body.first_name || body.firstName || '').trim()

  let allowPublication = body.allow_publication || body.allowPublication
  if (typeof allowPublication === 'boolean') {
    allowPublication = allowPublication ? (rawFirstName ? 'FIRST_NAME' : 'ANONYMOUS') : 'NO'
  }
  if (!allowPublication) {
    allowPublication = 'FIRST_NAME'
  }

  if (!rawFirstName) {
    rawFirstName = allowPublication === 'ANONYMOUS' ? 'Anonyme' : 'Lecteur'
  }

  if (!rawContent || rawContent.length < 5) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le témoignage doit contenir au moins 5 caractères.'
    })
  }

  if (rawEmail && !isValidEmail(rawEmail)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L\'adresse email fournie est invalide.'
    })
  }

  // 3. Sanitization (preserving natural language text)
  const firstName = sanitizeInput(rawFirstName)
  const content = sanitizeInput(rawContent)
  const email = rawEmail ? sanitizeInput(rawEmail) : null

  // 4. Save to Database via Drizzle ORM (status = 'PENDING')
  const testimonial = await drizzleDb.createTestimonial({
    first_name: firstName,
    email,
    content,
    rating,
    allow_publication: allowPublication
  })

  // 5. Return Clean Public Response
  return {
    success: true,
    message: 'Merci pour votre transmission. Votre témoignage sera examiné avant publication.',
    data: {
      id: testimonial.id,
      status: testimonial.status
    }
  }
})
