export default defineApiHandler(async (event) => {
  await requireAdmin(event)
  const q = getQuery(event)
  const statuses = ['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'SHIPPED', 'DELIVERED']
  const store = await useStore()
  return store.listOrders({
    status: statuses.includes(String(q.status)) ? q.status as any : undefined,
    q: q.q ? String(q.q).slice(0, 80) : undefined
  })
})
