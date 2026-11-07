export type ReviewKind = 'LEVER' | 'GENERAL'
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type Consent = 'ANONYMOUS' | 'FIRST_NAME' | 'NO'
export type Practiced = 'FULL' | 'PARTIAL' | 'NOT_YET'

export interface Review {
  id: number
  kind: ReviewKind
  lever: number | null
  practiced: Practiced | null
  rating: number
  consent: Consent
  firstName: string | null
  email: string | null
  answers: Record<string, string>
  publicQuote: string | null
  status: ReviewStatus
  featured: boolean
  moderatedBy: string | null
  moderatedAt: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
}

/** Ce que le public voit d’un avis validé — jamais l’email, jamais les réponses privées. */
export interface PublicReview {
  id: number
  kind: ReviewKind
  lever: number | null
  rating: number
  author: string
  quote: string
  featured: boolean
  date: string
}

/** Lien vers une plateforme où acheter le livre (TheBookEdition, Amazon…). */
export interface PlatformLink {
  label: string
  url: string
}

/** Réglages du site, modifiables dans l’admin. */
export interface SiteSettings {
  /** Section « Où trouver le livre » : un bouton par plateforme. */
  platformLinks: PlatformLink[]
  /** Adresse de contact publique (mentions légales, pied de page). */
  contactEmail: string
  isbn: string
}

export interface AppEvent {
  id: number
  entity: string
  entityId: number | null
  action: string
  actor: string
  createdAt: string | Date
}
