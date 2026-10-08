import { z } from 'zod'

const schema = z.object({ transactionId: z.string().trim().min(3).max(80) })

export default defineEventHandler(async (event) => {
  await rateLimit(event, 'confirm', 20, 15 * 60)
  const ref = String(getRouterParam(event, 'ref') || '').toUpperCase()
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Transaction manquante.' })

  const order = await settleOrder(ref, parsed.data.transactionId, 'client')
  return toPublicOrder(order)
})
