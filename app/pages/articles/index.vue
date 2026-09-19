<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">Articles & Ressources</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Espace Éditorial & Réflexions
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Articles & Stratégie d'Accomplissement
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Analyses, méthodologies et synthèses autour du temps, de la discipline, de la vision et de l'antifragilité. »
          </p>
        </div>
      </section>

      <!-- Articles Grid -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article
            v-for="a in articles"
            :key="a.slug"
            class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-[#B08D57] transition-all"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between text-xs text-[#5A4234]">
                <span class="uppercase tracking-widest text-[#B08D57] font-semibold">{{ a.category }}</span>
                <span>{{ a.readTime }} de lecture · {{ a.date }}</span>
              </div>
              <h2 class="font-serif text-2xl text-[#3A2115] hover:text-[#B08D57] transition-colors">
                <NuxtLink :to="`/articles/${a.slug}`">{{ a.title }}</NuxtLink>
              </h2>
              <p class="text-xs md:text-sm text-[#5A4234] font-light leading-relaxed">
                {{ a.excerpt }}
              </p>
            </div>
            <div class="mt-8 pt-4 border-t border-[#B08D57]/20 flex items-center justify-between">
              <NuxtLink
                :to="`/articles/${a.slug}`"
                class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold hover:underline"
              >
                Lire l'article complet →
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import { useArticles } from '~/composables/useArticles'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const { articles } = useArticles()
const { injectBreadcrumbSchema } = useJsonLd()

useSeo({
  title: 'Articles & Journal d\'Accomplissement | Une Formule',
  description: 'Consultez les articles et analyses stratégiques sur la maîtrise du temps, la discipline, la clarté et l\'antifragilité par Dieudonné Sossa GOSSOU.',
  path: '/articles'
})

injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'Articles', item: '/articles' }
])
</script>
