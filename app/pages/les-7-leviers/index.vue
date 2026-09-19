<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">Les 7 Leviers</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Architecture de l'Accomplissement
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Les 7 Leviers de La Formule
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Sept piliers indissociables pour faire converger l'intention claire, la maîtrise du temps et l'effet de levier vers l'impact pérenne. »
          </p>
        </div>
      </section>

      <!-- All 7 Levers Stacked Cards List -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20 space-y-8">
        <article
          v-for="l in leviers"
          :key="l.slug"
          class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-12 shadow-sm hover:border-[#B08D57] transition-all"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div class="space-y-4 max-w-3xl">
              <div class="flex items-center gap-4">
                <span class="font-serif text-4xl md:text-5xl text-[#B08D57] font-medium">{{ l.number }}</span>
                <div>
                  <span class="text-xs uppercase tracking-widest text-[#5A4234] block font-medium">{{ l.subtitle }}</span>
                  <h2 class="font-serif text-2xl md:text-3xl text-[#3A2115]">{{ l.title }}</h2>
                </div>
              </div>

              <p class="font-serif italic text-sm md:text-base text-[#B08D57]">
                {{ l.quote }}
              </p>

              <p class="text-[#5A4234] text-sm md:text-base font-light leading-relaxed">
                {{ l.p1 }}
              </p>

              <!-- Key Takeaways Preview -->
              <div class="pt-2">
                <span class="text-xs uppercase tracking-wider text-[#3A2115] font-semibold block mb-2">Points Clés :</span>
                <ul class="space-y-1 text-xs md:text-sm text-[#5A4234]/90 list-disc list-inside">
                  <li v-for="(t, i) in l.takeaways" :key="i">{{ t }}</li>
                </ul>
              </div>
            </div>

            <div class="shrink-0 flex flex-col justify-end">
              <NuxtLink
                :to="`/les-7-leviers/${l.slug}`"
                class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-8 py-3.5 shadow-sm text-center"
              >
                Explorer le Levier {{ l.number }}
              </NuxtLink>
            </div>
          </div>
        </article>
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
const { injectBreadcrumbSchema } = useJsonLd()

useSeo({
  title: 'Les 7 Leviers de l\'Accomplissement | Une Formule',
  description: 'Découvrez les 7 leviers fondamentaux d\'Une Formule par Dieudonné Sossa GOSSOU : Vision, Temps, Énergie, Effet de Levier, Alignement, Résilience et Héritage.',
  path: '/les-7-leviers'
})

injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'Les 7 Leviers', item: '/les-7-leviers' }
])
</script>
