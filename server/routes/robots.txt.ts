export default defineEventHandler((event) => {
  const site = useRuntimeConfig().public.siteUrl
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${site}/sitemap.xml\n`
})
