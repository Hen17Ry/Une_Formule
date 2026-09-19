import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const baseUrl = process.env.SITE_URL || 'https://uneformule.com'
  const currentDate = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/le-livre', priority: '0.9', changefreq: 'weekly' },
    { url: '/les-7-leviers', priority: '0.9', changefreq: 'weekly' },
    { url: '/la-genese', priority: '0.8', changefreq: 'monthly' },
    { url: '/auteur', priority: '0.8', changefreq: 'monthly' },
    { url: '/extraits', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'weekly' },
    { url: '/temoignages', priority: '0.8', changefreq: 'daily' },
    { url: '/commander', priority: '0.9', changefreq: 'weekly' },
    { url: '/articles', priority: '0.8', changefreq: 'weekly' }
  ]

  const leverSlugs = [
    'la-vision-de-clarte',
    'la-maitrise-du-temps',
    'l-energie-vitale',
    'l-effet-de-levier',
    'l-alignement-interieur',
    'la-resilience-active',
    'l-heritage-et-impact'
  ]

  const articleSlugs = [
    'la-maitrise-de-la-bande-passante-mentale',
    'la-clarte-strategique-dans-un-monde-de-bruit',
    'la-formule-alpha-beta-omega-deconstruire-le-succes-durable',
    'antifragilite-et-resilience-active-pour-dirigeants'
  ]

  const urls: string[] = []

  // Add static pages
  staticPages.forEach((page) => {
    urls.push(`
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  })

  // Add lever pages
  leverSlugs.forEach((slug) => {
    urls.push(`
  <url>
    <loc>${baseUrl}/les-7-leviers/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`)
  })

  // Add article pages
  articleSlugs.forEach((slug) => {
    urls.push(`
  <url>
    <loc>${baseUrl}/articles/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`)
  })

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')
  return sitemapXml
})
