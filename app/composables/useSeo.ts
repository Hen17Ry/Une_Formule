import { useSeoMeta, useHead, useRuntimeConfig } from '#imports'

export interface SeoOptions {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'book'
  keywords?: string[]
}

export function useSeo(options: SeoOptions) {
  const config = useRuntimeConfig()
  const baseUrl = (config.public?.siteUrl as string) || 'https://uneformule.com'
  const fullUrl = `${baseUrl}${options.path || ''}`
  const image = options.ogImage || `${baseUrl}/og-image.jpg`

  useSeoMeta({
    title: options.title,
    ogTitle: options.title,
    description: options.description,
    ogDescription: options.description,
    ogImage: image,
    ogUrl: fullUrl,
    ogType: options.ogType || 'website',
    ogSiteName: 'Une Formule',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    keywords: options.keywords ? options.keywords.join(', ') : 'une formule, dieudonne sossa gossou, 7 leviers, livre accomplissement, discipline, vision'
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: fullUrl
      }
    ]
  })
}
