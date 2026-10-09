import type { NitroFetchOptions } from 'nitropack'

/** Appels à l’API admin : en cas de session expirée, retour à la page de connexion. */
export function adminFetch<T>(url: string, opts: NitroFetchOptions<any> = {}) {
  return $fetch<T>(url, opts as any).catch(async (err: any) => {
    if (err?.statusCode === 401 || err?.status === 401) {
      await navigateTo(`/admin/login?next=${encodeURIComponent(useRoute().fullPath)}`)
    }
    throw err
  })
}

interface Toast { id: number, text: string, tone: 'ok' | 'error' }
export function useToasts() {
  const toasts = useState<Toast[]>('admin-toasts', () => [])
  const push = (text: string, tone: Toast['tone'] = 'ok') => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, text, tone })
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3800)
  }
  return { toasts, push }
}

export const REVIEW_STATUS: Record<string, { label: string, cls: string }> = {
  PENDING: { label: 'En attente', cls: 'bg-gold/15 text-gold-deep' },
  APPROVED: { label: 'Visible', cls: 'bg-ok/10 text-ok' },
  REJECTED: { label: 'Masqué', cls: 'bg-ink/[.06] text-ink-muted' }
}

export const ORDER_STATUS: Record<string, { label: string, cls: string }> = {
  PENDING: { label: 'Paiement en attente', cls: 'bg-gold/15 text-gold-deep' },
  PAID: { label: 'Payée · à expédier', cls: 'bg-copper/10 text-copper' },
  SHIPPED: { label: 'Expédiée', cls: 'bg-[#4F7A86]/15 text-[#3d6470]' },
  DELIVERED: { label: 'Livrée', cls: 'bg-ok/10 text-ok' },
  FAILED: { label: 'Échec paiement', cls: 'bg-danger/10 text-danger' },
  CANCELLED: { label: 'Annulée', cls: 'bg-ink/[.06] text-ink-muted' }
}

export const fmtDate = (d: string | Date | null | undefined, withTime = true) =>
  d ? new Date(d).toLocaleString('fr-FR', withTime ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
