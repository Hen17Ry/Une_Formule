export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'https://uneformule.com',
      gaId: process.env.NUXT_PUBLIC_GA_ID || ''
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-fonts', {
      families: {
        'Playfair Display': [400, 600, 700],
        Inter: [300, 400, 500, 600]
      },
      display: 'swap',
      prefetch: true,
      preconnect: true,
      preload: true,
      download: true,
      inject: true
    }]
  ],
  app: {
    head: {
      title: 'Une Formule : α + β = Ω | Livre par Dieudonné Sossa GOSSOU',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'description', content: 'Une Formule : α + β = Ω. L\'ouvrage d\'exception conçu comme un véritable outil de transformation personnelle, d\'élévation stratégique et de maîtrise des 7 leviers par Dieudonné Sossa GOSSOU.' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      htmlAttrs: {
        lang: 'fr'
      }
    }
  }
})