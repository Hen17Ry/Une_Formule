import { z } from 'zod'

const schema = z.object({
  priceXof: z.number().int().min(100, 'Prix minimum : 100 FCFA.').max(10_000_000),
  compareAtXof: z.number().int().min(0).max(10_000_000).nullable(),
  saleMode: z.enum(['PREORDER', 'AVAILABLE']),
  salesOpen: z.boolean(),
  shippingFeeXof: z.number().int().min(0).max(1_000_000),
  stock: z.number().int().min(0).max(1_000_000).nullable(),
  maxPerOrder: z.number().int().min(1).max(50),
  edition: z.string().trim().min(1).max(80),
  deliveryNote: z.string().trim().max(400),
  preorderNote: z.string().trim().max(400)
})

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Réglages invalides.' })
  const store = await useStore()
  const saved = await store.saveSettings({ ...parsed.data, compareAtXof: parsed.data.compareAtXof || null })
  await store.logEvent({ entity: 'settings', entityId: null, action: 'updated', actor: admin })
  return toPublicSettings(saved)
})
