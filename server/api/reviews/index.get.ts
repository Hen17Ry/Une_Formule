import { getPublicCache, setPublicCache } from '../../utils/review-cache'
import type { PublicReview } from '#shared/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let all = getPublicCache()
  if (!all) {
    const store = await useStore()
    const approved = await store.listReviews({ status: 'APPROVED' })
    all = approved.filter(r => canBePublished(r)).map(toPublicReview)
    setPublicCache(all)
  }

  let list: PublicReview[] = all
  if (query.lever === 'general') list = all.filter(r => r.kind === 'GENERAL')
  else if (query.lever) list = all.filter(r => r.lever === Number(query.lever))

  list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || +new Date(b.date) - +new Date(a.date))
  const average = list.length ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10 : null
  const limit = Math.min(Number(query.limit) || 200, 200)

  setResponseHeader(event, 'cache-control', 'public, max-age=30, stale-while-revalidate=120')
  return { reviews: list.slice(0, limit), count: list.length, average }
})
