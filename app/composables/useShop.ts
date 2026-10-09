import type { PublicSettings } from '#shared/types'

/** Réglages boutique (prix, mode précommande/disponible…) partagés entre les pages. */
export function useShop() {
  return useFetch<PublicSettings>('/api/settings', { key: 'shop-settings', dedupe: 'defer', getCachedData: (k, app) => app.payload.data[k] ?? app.static.data[k] })
}
