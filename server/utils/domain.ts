import type { PublicReview, Review } from '#shared/types'

/* ───────────── Texte ───────────── */

export function clean(input: unknown, max = 4000): string {
  return String(input ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max)
}

/* ───────────── Avis ───────────── */

const QUOTE_PRIORITY = ['marked', 'change', 'changed', 'striking', 'favorite', 'recommend']

/** Extrait proposé par défaut pour l’affichage public (modifiable par l’admin). */
export function defaultQuote(answers: Record<string, string>): string | null {
  for (const key of QUOTE_PRIORITY) {
    const v = answers[key]?.trim()
    if (v && v.length >= 12) return v
  }
  return null
}

export function canBePublished(r: Pick<Review, 'consent' | 'publicQuote' | 'answers'>) {
  return r.consent !== 'NO' && !!(r.publicQuote || defaultQuote(r.answers))
}

export function toPublicReview(r: Review): PublicReview {
  return {
    id: r.id,
    kind: r.kind,
    lever: r.lever,
    rating: r.rating,
    author: r.consent === 'FIRST_NAME' && r.firstName ? r.firstName : 'Lecteur anonyme',
    quote: (r.publicQuote || defaultQuote(r.answers) || '').trim(),
    featured: r.featured,
    date: new Date(r.moderatedAt || r.createdAt).toISOString()
  }
}
