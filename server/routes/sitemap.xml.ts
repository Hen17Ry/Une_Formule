import { LEVERS } from '~~/app/data/book'

export default defineEventHandler((event) => {
  const site = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  const paths = ['/', '/extraits', '/auteur', '/faq', '/les-7-leviers', '/retours', '/avis', '/commander',
    ...LEVERS.map(l => `/les-7-leviers/${l.slug}`), ...LEVERS.map(l => `/retours/${l.slug}`), '/retours/general']
  const today = new Date().toISOString().slice(0, 10)
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n')}\n</urlset>`
})
