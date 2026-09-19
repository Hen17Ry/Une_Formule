import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import { drizzleDb } from '../../db/drizzle'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Veuillez fournir un email et un mot de passe.'
    })
  }

  const user = await drizzleDb.getAdminUserByEmail(body.email)
  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides.'
    })
  }

  const isValid = drizzleDb.verifyPassword(body.password, user.passwordHash)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides.'
    })
  }

  setCookie(event, 'formula_admin_session', 'admin_authenticated_token_2026', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    success: true,
    user: {
      email: user.email,
      role: user.role
    }
  }
})
