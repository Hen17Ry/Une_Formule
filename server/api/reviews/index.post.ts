import { z } from 'zod'

const text = z.string().max(4000).optional().default('')

const schema = z.object({
  kind: z.enum(['LEVER', 'GENERAL']),
  lever: z.number().int().min(1).max(7).nullable().optional(),
  practiced: z.enum(['FULL', 'PARTIAL', 'NOT_YET']).nullable().optional(),
  rating: z.number().int().min(1, 'Merci de choisir une note.').max(5),
  consent: z.enum(['ANONYMOUS', 'FIRST_NAME', 'NO'], { message: 'Merci d’indiquer si votre témoignage peut être cité.' }),
  firstName: z.string().max(80).optional().default(''),
  email: z.union([z.literal(''), z.string().email('Adresse email invalide.')]).optional().default(''),
  answers: z.object({
    marked: text, change: text, difficult: text,
    favorite: text, changed: text, recommend: text, striking: text, deeper: text
  }).partial().default({}),
  website: z.string().optional() // pot de miel anti-robots
})

export default defineApiHandler(async (event) => {
  await rateLimit(event, 'review', 20, 15 * 60)

  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Formulaire invalide.' })
  }
  const body = parsed.data
  if (body.website) return { ok: true } // robot : on ignore silencieusement

  if (body.kind === 'LEVER' && !body.lever) throw createError({ statusCode: 400, statusMessage: 'Levier manquant.' })

  const firstName = clean(body.firstName, 80)
  if (body.consent === 'FIRST_NAME' && !firstName) {
    throw createError({ statusCode: 400, statusMessage: 'Indiquez votre prénom pour qu’il accompagne votre témoignage.' })
  }

  const allowed = body.kind === 'LEVER' ? ['marked', 'change', 'difficult'] : ['favorite', 'changed', 'recommend', 'striking', 'deeper']
  const answers: Record<string, string> = {}
  for (const key of allowed) {
    const v = clean((body.answers as Record<string, string>)[key])
    if (v) answers[key] = v
  }

  const store = await useStore()
  const review = await store.createReview({
    kind: body.kind,
    lever: body.kind === 'LEVER' ? body.lever! : null,
    practiced: body.kind === 'LEVER' ? (body.practiced ?? null) : null,
    rating: body.rating,
    consent: body.consent,
    firstName: firstName || null,
    email: body.email ? clean(body.email, 255).toLowerCase() : null,
    answers,
    publicQuote: null
  })
  await store.logEvent({ entity: 'review', entityId: review.id, action: 'created', actor: 'lecteur' })

  return { ok: true, id: review.id }
})
