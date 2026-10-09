import { invalidatePublicCache } from '../../../utils/review-cache'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  publicQuote: z.string().max(1200).nullable().optional(),
  featured: z.boolean().optional()
})

export default defineApiHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const parsed = schema.safeParse(await readBody(event))
  if (!id || !parsed.success) throw createError({ statusCode: 400, statusMessage: 'Requête invalide.' })

  const store = await useStore()
  const current = await store.getReview(id)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Avis introuvable.' })

  const patch = { ...parsed.data }
  if (patch.publicQuote !== undefined) patch.publicQuote = patch.publicQuote ? clean(patch.publicQuote, 1200) : null

  const next = { ...current, ...patch }
  if (patch.status === 'APPROVED' || (next.status === 'APPROVED' && patch.publicQuote !== undefined)) {
    if (current.consent === 'NO') {
      throw createError({ statusCode: 422, statusMessage: 'Ce lecteur a refusé que son témoignage soit cité : il ne peut pas être rendu public.' })
    }
    if (!canBePublished(next)) {
      throw createError({ statusCode: 422, statusMessage: 'Ajoutez un extrait public avant de rendre cet avis visible.' })
    }
  }

  const updated = await store.updateReview(id, patch, admin)
  const action = patch.status === 'APPROVED' ? 'approved' : patch.status === 'REJECTED' ? 'hidden' : patch.status === 'PENDING' ? 'reset' : 'edited'
  await store.logEvent({ entity: 'review', entityId: id, action, actor: admin })
  invalidatePublicCache()
  return { ...updated!, suggestedQuote: defaultQuote(updated!.answers), publishable: canBePublished(updated!) }
})
