export default defineApiHandler(async (event) => {
  await requireAdmin(event)
  const store = await useStore()
  const [reviews, events, settings] = await Promise.all([
    store.listReviews(), store.listEvents(25), store.getSettings()
  ])

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
    events: events.filter(e => e.entity !== 'order')
  }
})
