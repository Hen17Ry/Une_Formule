// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.uneformule.com'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss'],

  css: [
    '@fontsource-variable/cormorant-garamond/wght.css',
    '@fontsource-variable/cormorant-garamond/wght-italic.css',
    '@fontsource-variable/eb-garamond/wght.css',
    '@fontsource-variable/eb-garamond/wght-italic.css',
    '@fontsource-variable/jost/wght.css',
    '~/assets/css/main.css'
  ],

  tailwindcss: {
    cssPath: false,
    configPath: 'tailwind.config.ts'
  },

  runtimeConfig: {
    // Server only — set with NUXT_SESSION_PASSWORD, NUXT_KKIAPAY_PRIVATE_KEY, …
    sessionPassword: '',
    adminEmail: '',
    adminPassword: '',
    kkiapay: {
      privateKey: '',
      secretKey: '',
      webhookSecret: ''
    },
    public: {
      siteUrl,
      gaId: '',
      kkiapay: {
        publicKey: '',
        sandbox: true
      }
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Une Formule… 7 leviers pour construire la vie que vous désirez',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#FBF7F1' },
        { name: 'color-scheme', content: 'light only' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  routeRules: {
    // Anciennes URL → nouvelle architecture
    '/le-livre': { redirect: { to: '/', statusCode: 301 } },
    '/la-genese': { redirect: { to: '/extraits', statusCode: 301 } },
    '/temoignages': { redirect: { to: '/avis', statusCode: 301 } },
    '/articles': { redirect: { to: '/', statusCode: 301 } },
    '/articles/**': { redirect: { to: '/', statusCode: 301 } },
    '/questions': { redirect: { to: '/faq', statusCode: 301 } },
    '/admin/**': { ssr: false, headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/admin': { ssr: false, headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/api/**': { headers: { 'x-robots-tag': 'noindex' } },
    '/models/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=2592000' } }
  },

  nitro: {
    compressPublicAssets: true
  },

  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis', 'three', '@lucide/vue']
    }
  },

  typescript: {
    strict: true
  }
})
