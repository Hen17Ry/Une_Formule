import crypto from 'node:crypto'
import type { Order, PublicReview, PublicSettings, Review, ShopSettings } from '#shared/types'

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

/* ───────────── Boutique ───────────── */

export function toPublicSettings(s: ShopSettings): PublicSettings {
  const { ready, sandbox } = kkiapayConfig()
  return { ...s, paymentReady: ready, sandbox }
}

export function newOrderReference() {
  const d = new Date()
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `UF-${ymd}-${rand}`
}

/** Vue publique d’une commande : jamais l’adresse complète ni le téléphone. */
export function toPublicOrder(o: Order) {
  return {
    reference: o.reference,
    status: o.status,
    saleMode: o.saleMode,
    firstName: o.firstName,
    email: o.email.replace(/^(.).*(@.*)$/, '$1•••$2'),
    quantity: o.quantity,
    total: o.total,
    currency: o.currency,
    paidAt: o.paidAt,
    createdAt: o.createdAt
  }
}

export const PAID_STATUSES = ['PAID', 'SHIPPED', 'DELIVERED'] as const
