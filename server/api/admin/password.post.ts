import { z } from 'zod'

const schema = z.object({
  current: z.string().min(1, 'Indiquez votre mot de passe actuel.').max(200),
  next: z.string().min(MIN_PASSWORD_LENGTH, `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`).max(200)
})

export default defineApiHandler(async (event) => {
  const me = await requireAdmin(event)
  await rateLimit(event, 'password', 8, 10 * 60)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Requête invalide.' })

  const store = await useStore()
  const user = await store.getAdminByEmail(me)
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    throw createError({ statusCode: 400, statusMessage: 'Mot de passe actuel incorrect.' })
  }
  await store.upsertAdmin(me, await hashPassword(parsed.data.next))
  await store.logEvent({ entity: 'auth', entityId: user.id, action: 'password_changed', actor: me })
  return { ok: true }
})
