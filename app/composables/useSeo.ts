interface SeoInput { title: string, description: string, path?: string, image?: string, type?: 'website' | 'article' | 'book' }

export function useSeo(input: SeoInput) {
  const site = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  const route = useRoute()
  const url = site + (input.path ?? route.path)
  const image = site + (input.image ?? '/images/og-une-formule.jpg')
  const fullTitle = input.title.includes('Une Formule') ? input.title : `${input.title} — Une Formule`
  useSeoMeta({
    title: fullTitle,
    description: input.description,
    ogTitle: fullTitle,
    ogDescription: input.description,
    ogUrl: url,
    ogImage: image,
    ogType: input.type === 'book' ? 'book' : (input.type ?? 'website'),
    ogLocale: 'fr_FR',
    ogSiteName: 'Une Formule',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: input.description,
    twitterImage: image
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
