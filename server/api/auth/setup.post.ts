import crypto from 'node:crypto'
import { z } from 'zod'

/**
 * Création ou réinitialisation d’un compte admin depuis le navigateur (/admin/setup),
 * protégée par ADMIN_SETUP_TOKEN. Sans cette variable, la route est désactivée.
 * Le compte est écrit dans la base ; la variable est à supprimer une fois l’accès retrouvé.
 */
const schema = z.object({
  token: z.string().min(1).max(500),
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`).max(200)
})

export default defineApiHandler(async (event) => {
  await rateLimit(event, 'setup', 5, 15 * 60)
  const expected = readEnv('ADMIN_SETUP_TOKEN')
  if (expected.length < 16) throw createError({ statusCode: 404, statusMessage: 'Configuration désactivée.' })

  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Requête invalide.' })

  const a = crypto.createHash('sha256').update(parsed.data.token).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  if (!crypto.timingSafeEqual(a, b)) {
    await new Promise(r => setTimeout(r, 600))
    throw createError({ statusCode: 401, statusMessage: 'Code de configuration incorrect.' })
  }

  const store = await useStore()
  const existed = !!(await store.getAdminByEmail(parsed.data.email))
  await store.upsertAdmin(parsed.data.email, await hashPassword(parsed.data.password))
  await store.logEvent({ entity: 'auth', entityId: null, action: existed ? 'password_reset' : 'admin_created', actor: 'setup' })
  return { ok: true, created: !existed }
})
