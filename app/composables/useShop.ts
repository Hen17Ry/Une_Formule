import type { SiteSettings } from '#shared/types'

/** Réglages du site (liens des plateformes, contact, ISBN) partagés entre les pages. */
export function useShop() {
  return useFetch<SiteSettings>('/api/settings', { key: 'site-settings', dedupe: 'defer', getCachedData: (k, app) => app.payload.data[k] ?? app.static.data[k] })
}
