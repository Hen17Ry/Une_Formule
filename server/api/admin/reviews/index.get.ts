export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const q = getQuery(event)
  const store = await useStore()
  const status = ['PENDING', 'APPROVED', 'REJECTED'].includes(String(q.status)) ? q.status as any : undefined
  const lever = q.lever === 'general' ? 'GENERAL' as const : (Number(q.lever) >= 1 && Number(q.lever) <= 7 ? Number(q.lever) : undefined)
  const list = await store.listReviews({ status, lever, q: q.q ? String(q.q).slice(0, 80) : undefined })
  return list.map(r => ({ ...r, suggestedQuote: defaultQuote(r.answers), publishable: canBePublished(r) }))
})
