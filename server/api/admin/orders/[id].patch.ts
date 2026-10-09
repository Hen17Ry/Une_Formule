import { z } from 'zod'

const schema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'SHIPPED', 'DELIVERED']).optional(),
  adminNote: z.string().max(1000).nullable().optional()
})

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const parsed = schema.safeParse(await readBody(event))
  if (!id || !parsed.success) throw createError({ statusCode: 400, statusMessage: 'Requête invalide.' })

  const store = await useStore()
  const order = await store.getOrderById(id)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable.' })

  const patch: Record<string, any> = {}
  if (parsed.data.adminNote !== undefined) patch.adminNote = parsed.data.adminNote ? clean(parsed.data.adminNote, 1000) : null
  if (parsed.data.status) {
    patch.status = parsed.data.status
    if (parsed.data.status === 'PAID' && !order.paidAt) {
      patch.paidAt = new Date().toISOString()
      patch.paymentMethod = order.paymentMethod || 'Manuel (admin)'
    }
  }

  const updated = await store.updateOrder(id, patch)
  await store.logEvent({ entity: 'order', entityId: id, action: parsed.data.status ? `status_${parsed.data.status.toLowerCase()}` : 'note', actor: admin })
  return updated
})
