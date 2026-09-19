<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">Témoignages</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Retours des Lecteurs · PostgreSQL Vérifié
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Avis & Témoignages
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Découvrez les témoignages authentiques soumis par les lecteurs de La Formule. »
          </p>
        </div>
      </section>

      <!-- Carousel & Submissions Container -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <PublicCarousel />
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import PublicCarousel from '~/components/testimonials/PublicCarousel.vue'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const { injectBreadcrumbSchema } = useJsonLd()

useSeo({
  title: 'Témoignages des Lecteurs | Une Formule',
  description: 'Consultez les témoignages authentiques et avis vérifiés des lecteurs de l\'ouvrage Une Formule par Dieudonné Sossa GOSSOU.',
  path: '/temoignages'
})

injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'Témoignages', item: '/temoignages' }
])
</script>
