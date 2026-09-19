<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">Le Livre</span>
        </nav>
      </div>

      <!-- Hero Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Ouvrage de Référence · Édition Limitee
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Une Formule : α + β = Ω
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed mb-8">
            « L'architecture définitive pour comprendre, construire et transmettre votre impact maximal. »
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <NuxtLink
              to="/commander"
              class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-8 py-3.5 shadow-md"
            >
              Acquérir le Livre
            </NuxtLink>
            <NuxtLink
              to="/les-7-leviers"
              class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#B08D57] border border-[#B08D57]/40 hover:bg-[#B08D57]/10 transition-all rounded-full px-8 py-3.5"
            >
              Explorer les 7 Leviers
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Detailed Book Overview Grid -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-12 shadow-sm">
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-64 md:w-80 h-96 bg-[#120D09] rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-[#B08D57]/40 text-[#F6F0E7]">
              <div class="text-center pt-8">
                <span class="font-serif text-3xl tracking-[0.25em] text-[#C7A45D]">Α + β = Ω</span>
                <p class="text-xs uppercase tracking-widest text-[#D4C8BE]/70 mt-2">Dieudonné Sossa GOSSOU</p>
              </div>
              <div class="text-center pb-8 border-t border-[#B08D57]/20 pt-4">
                <h3 class="font-serif text-lg text-[#F6F0E7]">UNE FORMULE</h3>
                <p class="text-[10px] uppercase tracking-widest text-[#C7A45D] mt-1">Maison d'Édition</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 space-y-6">
            <h2 class="font-serif text-3xl md:text-4xl text-[#3A2115]">
              Synopsis & Raison d'Être
            </h2>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              Dans un monde en perpétuelle accélération, la dispersion attentionnelle et la complexité organisationnelle brisent les trajectoires les plus prometteuses. <strong>Une Formule</strong> livre le protocole de synthèse entre intention stratégique (α) et système d'exécution (β) pour atteindre un accomplissement pérenne (Ω).
            </p>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              Conçu pour les dirigeants, créateurs et esprits exigeants, ce livre propose une traversée méthodique articulée autour de 7 leviers fondamentaux.
            </p>

            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-[#B08D57]/20">
              <div>
                <span class="text-xs uppercase tracking-widest text-[#B08D57] block font-semibold">Format</span>
                <span class="text-sm font-medium">Relié Luxe & Numérique</span>
              </div>
              <div>
                <span class="text-xs uppercase tracking-widest text-[#B08D57] block font-semibold">Auteur</span>
                <span class="text-sm font-medium">Dieudonné Sossa GOSSOU</span>
              </div>
              <div>
                <span class="text-xs uppercase tracking-widest text-[#B08D57] block font-semibold">Structure</span>
                <span class="text-sm font-medium">7 Leviers & Protocoles</span>
              </div>
              <div>
                <span class="text-xs uppercase tracking-widest text-[#B08D57] block font-semibold">Édition</span>
                <span class="text-sm font-medium">Française Officielles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- The 7 Levers Summary List -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="uppercase tracking-[0.3em] text-[#B08D57] font-semibold text-xs">Structure de l'Ouvrage</span>
          <h2 class="font-serif text-3xl sm:text-4xl text-[#3A2115] font-normal mt-2">
            Les 7 Leviers de l'Accomplissement
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="l in leviers"
            :key="l.slug"
            class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-2xl p-6 flex flex-col justify-between hover:border-[#B08D57] transition-all hover:shadow-md"
          >
            <div>
              <div class="flex items-center justify-between mb-3 border-b border-[#B08D57]/20 pb-2">
                <span class="font-serif text-2xl text-[#B08D57] font-medium">{{ l.number }}</span>
                <span class="text-[10px] uppercase tracking-widest text-[#5A4234]">Chapitre</span>
              </div>
              <h3 class="font-serif text-xl text-[#3A2115] mb-2">{{ l.title }}</h3>
              <p class="text-xs text-[#5A4234] font-light leading-relaxed mb-4">{{ l.subtitle }}</p>
            </div>
            <NuxtLink
              :to="`/les-7-leviers/${l.slug}`"
              class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>Lire le levier</span>
              <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div class="bg-[#120D09] text-[#F6F0E7] rounded-3xl p-10 md:p-16 border border-[#B08D57]/40 relative overflow-hidden">
          <div class="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 class="font-serif text-3xl md:text-4xl text-[#F6F0E7]">
              Prêt à intégrer La Formule ?
            </h2>
            <p class="text-[#D4C8BE]/80 text-sm md:text-base font-light">
              Commandez votre exemplaire relié ou débloquez l'édition numérique immédiatement.
            </p>
            <div>
              <NuxtLink
                to="/commander"
                class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all rounded-full px-8 py-3.5 shadow-lg"
              >
                Commander l'Édition
              </NuxtLink>
            </div>
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
import { useLevers } from '~/composables/useLevers'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const { leviers } = useLevers()
const { injectBookSchema, injectBreadcrumbSchema } = useJsonLd()

useSeo({
  title: 'Le Livre : Une Formule (α + β = Ω) | Dieudonné Sossa GOSSOU',
  description: 'Découvrez l\'ouvrage Une Formule par Dieudonné Sossa GOSSOU. Guide de transformation stratégique et d\'accomplissement à travers les 7 leviers.',
  path: '/le-livre'
})

injectBookSchema()
injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'Le Livre', item: '/le-livre' }
])
</script>
