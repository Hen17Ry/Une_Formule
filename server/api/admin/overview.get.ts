export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const store = await useStore()
  const [reviews, orders, events, settings] = await Promise.all([
    store.listReviews(), store.listOrders(), store.listEvents(25), store.getSettings()
  ])

  const paid = orders.filter(o => PAID_STATUSES.includes(o.status as any))
  const rated = reviews.filter(r => r.rating)
  const byLever = Array.from({ length: 8 }, (_, i) => {
    const subset = i === 0 ? reviews.filter(r => r.kind === 'GENERAL') : reviews.filter(r => r.lever === i)
    return {
      key: i === 0 ? 'general' : String(i),
      count: subset.length,
      average: subset.length ? Math.round(subset.reduce((s, r) => s + r.rating, 0) / subset.length * 10) / 10 : null
    }
  })

  return {
    storage: store.kind,
    paymentReady: kkiapayConfig().ready,
    sandbox: kkiapayConfig().sandbox,
    settings,
    reviews: {
      total: reviews.length,
      pending: reviews.filter(r => r.status === 'PENDING').length,
      approved: reviews.filter(r => r.status === 'APPROVED').length,
      rejected: reviews.filter(r => r.status === 'REJECTED').length,
      average: rated.length ? Math.round(rated.reduce((s, r) => s + r.rating, 0) / rated.length * 10) / 10 : null,
      byLever,
      latestPending: reviews.filter(r => r.status === 'PENDING').slice(0, 5)
    },
    orders: {
      total: orders.length,
      paid: paid.length,
      toShip: orders.filter(o => o.status === 'PAID').length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      copies: paid.reduce((s, o) => s + o.quantity, 0),
      revenue: paid.reduce((s, o) => s + o.total, 0),
      latest: orders.slice(0, 6)
    },
    events
  }
})
