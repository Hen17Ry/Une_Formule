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

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED'
export type SaleMode = 'PREORDER' | 'AVAILABLE'

export interface Order {
  id: number
  reference: string
  status: OrderStatus
  saleMode: SaleMode
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  notes: string | null
  quantity: number
  unitPrice: number
  shippingFee: number
  total: number
  currency: string
  transactionId: string | null
  paymentMethod: string | null
  paidAt: string | Date | null
  adminNote: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ShopSettings {
  /** Prix unitaire en FCFA (KkiaPay encaisse en XOF). */
  priceXof: number
  /** Prix barré facultatif (FCFA). */
  compareAtXof: number | null
  saleMode: SaleMode
  salesOpen: boolean
  shippingFeeXof: number
  /** Stock restant ; null = illimité. */
  stock: number | null
  maxPerOrder: number
  edition: string
  deliveryNote: string
  preorderNote: string
}

export interface PublicSettings extends ShopSettings {
  paymentReady: boolean
  sandbox: boolean
}

export interface AppEvent {
  id: number
  entity: string
  entityId: number | null
  action: string
  actor: string
  createdAt: string | Date
}
