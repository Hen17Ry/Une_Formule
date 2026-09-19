<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">Extraits</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Passages Choisis & Citations
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Extraits du Livre Une Formule
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Une immersion directe dans la puissance stylistique et philosophique de l'ouvrage. »
          </p>
        </div>
      </section>

      <!-- Excerpts List -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20 space-y-12">
        <article
          v-for="(extrait, index) in extraits"
          :key="index"
          class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-12 shadow-sm space-y-6 max-w-4xl mx-auto"
        >
          <div class="flex items-center justify-between border-b border-[#B08D57]/20 pb-4">
            <span class="text-xs uppercase tracking-[0.3em] text-[#B08D57] font-semibold">
              Extrait {{ index + 1 }} · {{ extrait.chapitre }}
            </span>
            <span class="text-xs text-[#5A4234] font-mono">Page {{ extrait.page }}</span>
          </div>

          <blockquote class="font-serif italic text-xl md:text-2xl text-[#3A2115] leading-relaxed border-l-2 border-[#B08D57] pl-6 py-2">
            « {{ extrait.texte }} »
          </blockquote>

          <p class="text-[#5A4234] text-sm md:text-base font-light leading-relaxed">
            {{ extrait.commentaire }}
          </p>
        </article>
      </section>

      <!-- CTA -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div class="bg-[#120D09] text-[#F6F0E7] rounded-3xl p-10 md:p-14 border border-[#B08D57]/40 max-w-3xl mx-auto space-y-6">
          <h2 class="font-serif text-3xl text-[#F6F0E7]">Envie de poursuivre la lecture ?</h2>
          <p class="text-[#D4C8BE]/80 text-sm font-light">Commandez votre exemplaire de l'édition complète dès aujourd'hui.</p>
          <NuxtLink
            to="/commander"
            class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all rounded-full px-8 py-3.5 shadow-md"
          >
            Obtenir le Livre
          </NuxtLink>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const { injectBreadcrumbSchema } = useJsonLd()

const extraits = [
  {
    chapitre: 'Chapitre I - La Vision de Clarté',
    page: '24',
    texte: 'La clarté n\'est pas la certitude du résultat, mais l\'immobilité absolue de l\'intention. Lorsque vous cessez de négocier avec la dispersion, l\'objectif devient l\'unique direction possible.',
    commentaire: 'Cet extrait pose les fondations du premier levier : éliminer les arbitrages parasites pour sanctuariser son attention.'
  },
  {
    chapitre: 'Chapitre II - La Maîtrise du Temps',
    page: '58',
    texte: 'Le temps ne s\'économise pas : il s\'investit ou il s\'évapore. Ceux qui régnent sur leur destin ne comptent pas les heures, ils mesurent la densité d\'impact injectée dans chaque seconde.',
    commentaire: 'Une réflexion profonde sur la différence fondamentale entre la gestion d\'agenda passive et la souveraineté temporelle active.'
  },
  {
    chapitre: 'Chapitre IV - L\'Effet de Levier',
    page: '112',
    texte: 'Le travailleur acharné vend son temps ; l\'architecte construit des leviers. Si votre présence reste le seul moteur de votre création, vous n\'avez pas bâti un empire, mais une cage dorée.',
    commentaire: 'Le Levier 04 invite à concevoir des architectures organisationnelles et technologiques autonomes.'
  }
]

useSeo({
  title: 'Extraits & Citations du livre Une Formule',
  description: 'Consultez les meilleurs extraits, leçons et citations du livre Une Formule par Dieudonné Sossa GOSSOU.',
  path: '/extraits'
})

injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'Extraits', item: '/extraits' }
])
</script>
