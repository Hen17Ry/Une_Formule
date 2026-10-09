import { z } from 'zod'

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(200) })

/* Connexion : l’email et le mot de passe sont vérifiés contre la table admin_users de la base. */
export default defineApiHandler(async (event) => {
  await rateLimit(event, 'login', 6, 10 * 60)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis.' })

  const store = await useStore()
  const user = await store.getAdminByEmail(parsed.data.email)
  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false

  if (!user || !ok) {
    await new Promise(r => setTimeout(r, 400))
    if (user && isLegacyHash(user.passwordHash) && parsed.data.password === 'Formule2026!') {
      throw createError({ statusCode: 401, statusMessage: 'Ce mot de passe par défaut n’est plus accepté. Définissez-en un nouveau sur /admin/setup.' })
    }
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
  }

  // Ancien hachage SHA-256 du site précédent : remplacé par scrypt dès la première connexion.
  if (isLegacyHash(user.passwordHash)) await store.upsertAdmin(user.email, await hashPassword(parsed.data.password))

  const session = await adminSession(event)
  await session.update({ email: user.email, at: Date.now() })
  await store.logEvent({ entity: 'auth', entityId: user.id, action: 'login', actor: user.email })
  return { ok: true, email: user.email }
})
