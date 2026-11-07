import { z } from 'zod'
import type { SourceEntry } from '#shared/types'

const schema = z.object({
  sources: z.array(z.object({
    id: z.string().trim().max(40).optional(),
    lever: z.number().int().min(1).max(7).nullable(),
    name: z.string().trim().min(1, 'Chaque source doit avoir un nom.').max(160),
    reference: z.string().trim().max(400).default(''),
    claim: z.string().trim().max(600).default(''),
    url: z.string().trim().max(500).refine(v => !v || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v), 'Lien de source invalide (il doit commencer par https://).').default(''),
    status: z.enum(['', 'consultee', 'connue']).default('')
  })).max(150)
})

export default defineApiHandler(async (event) => {
  const admin = await requireAdmin(event)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Données invalides.' })

  const used = new Set<string>()
  const sources: SourceEntry[] = parsed.data.sources.map((s) => {
    let id = s.id && !used.has(s.id) ? s.id : ''
    while (!id || used.has(id)) id = `s${crypto.randomUUID().slice(0, 8)}`
    used.add(id)
    return { ...s, id }
  })

  const store = await useStore()
  await store.setKv('sources', sources)
  await store.logEvent({ entity: 'settings', entityId: null, action: 'sources_updated', actor: admin })
  return { sources }
})
