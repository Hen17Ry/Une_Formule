import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const baseUrl = process.env.SITE_URL || 'https://uneformule.com'

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml
`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')
  return robotsTxt
})
