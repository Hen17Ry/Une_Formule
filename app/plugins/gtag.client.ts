export default defineNuxtPlugin(() => {
  const gaId = useRuntimeConfig().public.gaId as string
  if (!gaId) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(s)
  const w = window as any
  w.dataLayer = w.dataLayer || []
  w.gtag = function () { w.dataLayer.push(arguments) }
  w.gtag('js', new Date())
  w.gtag('config', gaId, { anonymize_ip: true })
  useRouter().afterEach(to => w.gtag('event', 'page_view', { page_path: to.fullPath }))
})
