import { invalidatePublicCache } from '../../../utils/review-cache'
export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const store = await useStore()
  const ok = await store.deleteReview(id)
  if (!ok) throw createError({ statusCode: 404, statusMessage: 'Avis introuvable.' })
  await store.logEvent({ entity: 'review', entityId: id, action: 'deleted', actor: admin })
  invalidatePublicCache()
  return { ok: true }
})
