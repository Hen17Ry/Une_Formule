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


export const fmtDate = (d: string | Date | null | undefined, withTime = true) =>
  d ? new Date(d).toLocaleString('fr-FR', withTime ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
