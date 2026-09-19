<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">L'Auteur</span>
        </nav>
      </div>

      <!-- Hero / Bio Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6">
            <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm">
              Biographie & Alignment
            </span>
            <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight">
              Dieudonné Sossa GOSSOU
            </h1>
            <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
              « Consultant en Performance Humaine, Strategic Leadership & Auteur de La Formule. »
            </p>
            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              Dieudonné Sossa GOSSOU accompagne les dirigeants, entrepreneurs et décideurs dans la conception de trajectoires d'excellence durables. Son travail se concentre sur l'élimination de la dispersion cognitive, l'optimisation des systèmes de décision et l'alignement entre ambition personnelle et impact collectif.
            </p>
          </div>

          <!-- Author Card Showcase -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 shadow-md text-center space-y-6 max-w-sm w-full">
              <div class="w-32 h-32 rounded-full bg-[#120D09] border-2 border-[#B08D57] mx-auto flex items-center justify-center text-[#C7A45D] font-serif text-3xl font-medium shadow-inner">
                DG
              </div>
              <div>
                <h3 class="font-serif text-2xl text-[#3A2115]">Dieudonné Sossa GOSSOU</h3>
                <p class="text-xs uppercase tracking-widest text-[#B08D57] font-medium mt-1">Auteur & Strategic Advisor</p>
              </div>
              <div class="border-t border-[#B08D57]/20 pt-4 text-xs text-[#5A4234] space-y-2">
                <p>✦ Expert en Leadership & Haute Performance</p>
                <p>✦ Concepteur de la Méthodologie α + β = Ω</p>
                <p>✦ Conférencier International</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Philosophy & Key Pillars -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-12 shadow-sm space-y-8 max-w-4xl mx-auto">
          <h2 class="font-serif text-3xl text-[#3A2115] pb-4 border-b border-[#B08D57]/20">
            La Philosophie de l'Auteur
          </h2>

          <div class="space-y-6 text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
            <p>
              Convaincu que le vrai leadership ne réside pas dans l'agitation mais dans l'intensité de la présence et la clarté du choix, Dieudonné Sossa GOSSOU développe des protocoles d'action fondés sur la rigueur analytique et la profondeur humaine.
            </p>

            <blockquote class="border-l-2 border-[#B08D57] pl-6 py-2 font-serif italic text-xl text-[#B08D57]">
              « Construire une grande œuvre ne demande pas plus de temps, mais une étanchéité absolue contre tout ce qui ne sert pas la vision suprême. »
            </blockquote>

            <p>
              À travers le livre <strong>Une Formule</strong>, il met à disposition un cadre d'auto-coaching et de structuration stratégique accessible à toute personne désireuse d'atteindre le sommet de son art sans compromettre sa santé ou son intégrité.
            </p>
          </div>

          <div class="pt-6 border-t border-[#B08D57]/20 flex flex-wrap gap-4">
            <NuxtLink
              to="/le-livre"
              class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-8 py-3.5 shadow-md"
            >
              Découvrir son Ouvrage
            </NuxtLink>
            <NuxtLink
              to="/les-7-leviers"
              class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#B08D57] border border-[#B08D57]/40 hover:bg-[#B08D57]/10 transition-all rounded-full px-8 py-3.5"
            >
              Les 7 Leviers
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

const { injectPersonSchema, injectBreadcrumbSchema } = useJsonLd()

useSeo({
  title: 'Dieudonné Sossa GOSSOU : Auteur du livre Une Formule',
  description: 'Biographie et parcours de Dieudonné Sossa GOSSOU, auteur du livre Une Formule et consultant en performance humaine et leadership stratégique.',
  path: '/auteur'
})

injectPersonSchema()
injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'L\'Auteur', item: '/auteur' }
])
</script>
