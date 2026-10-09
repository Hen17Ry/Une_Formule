import type { PublicReview } from '#shared/types'

/* Cache mémoire des avis publics (invalidé à chaque modération). */
let cache: { at: number, data: PublicReview[] } | null = null

export function getPublicCache(): PublicReview[] | null {
  if (!cache) return null
  return Date.now() - cache.at < 60000 ? cache.data : null
}

export function setPublicCache(data: PublicReview[]): void {
  cache = { at: Date.now(), data }
}

export function invalidatePublicCache(): void {
  cache = null
}
