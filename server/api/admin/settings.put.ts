import { z } from 'zod'

const schema = z.object({
  platformLinks: z.array(z.object({
    label: z.string().trim().min(1, 'Nom de plateforme requis.').max(40),
    url: z.string().trim().max(500).regex(/^https?:\/\/[^\s]+\.[^\s]+$/i, 'Lien de plateforme invalide (il doit commencer par https://).')
  })).max(8).default([]),
  contactEmail: z.string().trim().toLowerCase().max(120).refine(v => !v || z.string().email().safeParse(v).success, 'Adresse de contact invalide.').default(''),
  isbn: z.string().trim().max(30).default('')
})

export default defineApiHandler(async (event) => {
  const admin = await requireAdmin(event)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Réglages invalides.' })
  const store = await useStore()
  const saved = await store.saveSettings(parsed.data)
  await store.logEvent({ entity: 'settings', entityId: null, action: 'updated', actor: admin })
  return saved
})
