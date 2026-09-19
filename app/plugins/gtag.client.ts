import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = (config.public?.gaId as string) || process.env.NUXT_PUBLIC_GA_ID

  if (!import.meta.client || !gaId) return

  // Inject Google Analytics script async
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  gtag('js', new Date())
  gtag('config', gaId, {
    page_path: window.location.pathname
  })

  // Expose gtag on window for global tracking
  ;(window as any).gtag = gtag
})
