import { z } from 'zod'

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(200) })

export default defineEventHandler(async (event) => {
  await rateLimit(event, 'login', 6, 10 * 60)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis.' })

  const store = await useStore()
  const user = await store.getAdminByEmail(parsed.data.email)
  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false
  if (!user || !ok) {
    await new Promise(r => setTimeout(r, 400))
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
  }

  const session = await adminSession(event)
  await session.update({ email: user.email, at: Date.now() })
  await store.logEvent({ entity: 'auth', entityId: user.id, action: 'login', actor: user.email })
  return { ok: true, email: user.email }
})
