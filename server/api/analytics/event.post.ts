import { defineEventHandler, readBody, createError } from 'h3'
import { drizzleDb } from '../../db/drizzle'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.event_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nom d\'événement requis.'
    })
  }

  await drizzleDb.logEvent(null, String(body.event_name), body.page ? `page:${body.page}` : 'USER')
  return {
    success: true
  }
})
