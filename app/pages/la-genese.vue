<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">La Genèse</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Histoire & Origines de l'Ouvrage
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            La Genèse de La Formule
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Comment des années d'observation, de consultation stratégique et de recherche ont donné naissance à l'équation α + β = Ω. »
          </p>
        </div>
      </section>

      <!-- Main Story Narrative -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="max-w-4xl bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-14 shadow-sm space-y-8">
          <div>
            <h2 class="font-serif text-3xl text-[#3A2115] mb-4">
              1. Le Constat de la Dispersion
            </h2>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              L'idée d'Une Formule est née d'un paradoxe récurrent observé au sein des entreprises et chez les leaders individuels : pourquoi autant d'individus exceptionnellement doués échouent-ils à concrétiser leur potentiel à la hauteur de leurs ambitions ?
            </p>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed mt-4">
              La cause majeure identifiée par Dieudonné Sossa GOSSOU réside dans l'illusion de l'effort désordonné. L'accumulation de tâches sans architecture globale crée un épuisement stérile.
            </p>
          </div>

          <div class="border-t border-[#B08D57]/20 pt-8">
            <h2 class="font-serif text-3xl text-[#3A2115] mb-4">
              2. La Découverte de l'Équation α + β = Ω
            </h2>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              En modélisant les meilleures trajectoires d'accomplissement de l'histoire et en intégrant les enseignements des neurosciences cognitives, l'auteur a synthétisé une trame mathématique universelle.
            </p>
            <div class="my-6 bg-[#120D09] text-[#F6F0E7] border border-[#B08D57]/40 rounded-2xl p-6 text-center">
              <span class="font-serif text-3xl md:text-4xl text-[#C7A45D] tracking-widest block mb-2">Α + β = Ω</span>
              <p class="text-xs uppercase tracking-widest text-[#D4C8BE]/70">Intention Alignée (α) + Système d'Exécution (β) = Accomplissement Durable (Ω)</p>
            </div>
          </div>

          <div class="border-t border-[#B08D57]/20 pt-8">
            <h2 class="font-serif text-3xl text-[#3A2115] mb-4">
              3. L'Édition d'un Objet d'Art et de Transmission
            </h2>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              Une Formule n'a pas été conçu comme un simple livre de développement personnel rapide. C'est un objet éditorial précieux, pensé pour être annoté, réétudié et transmis de génération en génération.
            </p>
          </div>

          <div class="pt-6 text-center border-t border-[#B08D57]/20">
            <NuxtLink
              to="/le-livre"
              class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-8 py-3.5 shadow-md"
            >
              Découvrir le Livre
            </NuxtLink>
          </div>
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

useSeo({
  title: 'La Genèse du livre Une Formule | Origine & Philosophie',
  description: 'Découvrez la genèse d\'Une Formule par Dieudonné Sossa GOSSOU. L\'histoire de la création de la formule α + β = Ω et la recherche derrière l\'ouvrage.',
  path: '/la-genese'
})

injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'La Genèse', item: '/la-genese' }
])
</script>
