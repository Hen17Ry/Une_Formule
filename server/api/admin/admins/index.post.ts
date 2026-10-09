import { z } from 'zod'

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`).max(200)
})

export default defineEventHandler(async (event) => {
  const me = await requireAdmin(event)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Requête invalide.' })

  const store = await useStore()
  if (await store.getAdminByEmail(parsed.data.email)) throw createError({ statusCode: 409, statusMessage: 'Un administrateur utilise déjà cet email.' })
  await store.upsertAdmin(parsed.data.email, await hashPassword(parsed.data.password))
  const created = await store.getAdminByEmail(parsed.data.email)
  await store.logEvent({ entity: 'auth', entityId: created?.id ?? null, action: 'admin_created', actor: me })
  return { ok: true }
})
