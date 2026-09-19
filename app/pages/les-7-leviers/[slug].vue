<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main v-if="lever" class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <NuxtLink to="/les-7-leviers" class="hover:underline">Les 7 Leviers</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">{{ lever.title }}</span>
        </nav>
      </div>

      <!-- Hero Section -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <div class="flex items-center gap-4 mb-4">
            <span class="font-serif text-5xl md:text-6xl text-[#B08D57] font-medium">{{ lever.number }}</span>
            <span class="text-xs md:text-sm uppercase tracking-[0.3em] text-[#5A4234] font-semibold">
              Levier {{ lever.number }} / 07 · Chapitre du Livre
            </span>
          </div>

          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            {{ lever.title }}
          </h1>

          <p class="text-lg md:text-xl text-[#5A4234] uppercase tracking-widest font-medium mb-6">
            {{ lever.subtitle }}
          </p>

          <blockquote class="border-l-2 border-[#B08D57] pl-6 py-2 font-serif italic text-xl md:text-2xl text-[#B08D57] mb-8 bg-[#FFFDF9] rounded-r-2xl">
            {{ lever.quote }}
          </blockquote>
        </div>
      </section>

      <!-- Main Body Article -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-8 bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
            <h2 class="font-serif text-2xl md:text-3xl text-[#3A2115] pb-4 border-b border-[#B08D57]/20">
              Analyse Approfondie du Levier {{ lever.number }}
            </h2>

            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              {{ lever.p1 }}
            </p>

            <p class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              {{ lever.p2 }}
            </p>

            <p v-if="lever.p3" class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              {{ lever.p3 }}
            </p>

            <!-- Key Takeaways Box -->
            <div class="mt-8 bg-[#F8F4EE] border border-[#B08D57]/40 rounded-2xl p-6 md:p-8 space-y-4">
              <h3 class="font-serif text-xl text-[#3A2115] flex items-center gap-2">
                <span class="text-[#B08D57]">✦</span>
                <span>Principes d'Action Fondamentaux</span>
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="(t, i) in lever.takeaways"
                  :key="i"
                  class="flex items-start gap-3 text-sm md:text-base text-[#5A4234]"
                >
                  <span class="text-[#B08D57] font-semibold shrink-0">0{{ i + 1 }}.</span>
                  <span>{{ t }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Book CTA Sidebar Box -->
            <div class="bg-[#120D09] text-[#F6F0E7] border border-[#B08D57]/40 rounded-3xl p-8 space-y-6">
              <span class="text-xs uppercase tracking-[0.3em] text-[#C7A45D] font-semibold block">Ouvrage Complet</span>
              <h3 class="font-serif text-2xl text-[#F6F0E7]">Approfondir dans le Livre</h3>
              <p class="text-xs md:text-sm text-[#D4C8BE]/80 font-light leading-relaxed">
                Le Levier {{ lever.number }} fait partie des 7 piliers de la formule α + β = Ω. Retrouvez les protocoles d'application complets dans le livre relié.
              </p>
              <NuxtLink
                to="/commander"
                class="block w-full text-center text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all rounded-full py-3.5 shadow-md"
              >
                Commander le Livre
              </NuxtLink>
            </div>

            <!-- All Levers Quick Navigation -->
            <div class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-6 space-y-4">
              <h4 class="font-serif text-lg text-[#3A2115] border-b border-[#B08D57]/20 pb-2">
                Tous les 7 Leviers
              </h4>
              <ul class="space-y-2 text-xs font-medium">
                <li v-for="l in leviers" :key="l.slug">
                  <NuxtLink
                    :to="`/les-7-leviers/${l.slug}`"
                    class="flex items-center justify-between p-2 rounded-lg transition-colors"
                    :class="l.slug === lever.slug ? 'bg-[#B08D57]/15 text-[#B08D57] font-semibold' : 'hover:bg-[#F8F4EE] text-[#5A4234]'"
                  >
                    <span>{{ l.number }}. {{ l.title }}</span>
                    <span v-if="l.slug === lever.slug">✓</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Next / Prev Lever Navigation Bar -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 pt-8 border-t border-[#B08D57]/20">
        <div class="flex items-center justify-between gap-4">
          <NuxtLink
            v-if="prevLever"
            :to="`/les-7-leviers/${prevLever.slug}`"
            class="text-xs uppercase tracking-widest text-[#B08D57] hover:text-[#3A2115] transition-colors flex items-center gap-2"
          >
            <span>← Levier {{ prevLever.number }} : {{ prevLever.title }}</span>
          </NuxtLink>
          <div v-else />

          <NuxtLink
            v-if="nextLever"
            :to="`/les-7-leviers/${nextLever.slug}`"
            class="text-xs uppercase tracking-widest text-[#B08D57] hover:text-[#3A2115] transition-colors flex items-center gap-2"
          >
            <span>Levier {{ nextLever.number }} : {{ nextLever.title }} →</span>
          </NuxtLink>
          <div v-else />
        </div>
      </section>
    </main>

    <!-- 404 Fallback if invalid slug -->
    <div v-else class="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
      <div class="text-center space-y-4">
        <h1 class="font-serif text-4xl text-[#3A2115]">Levier non trouvé</h1>
        <p class="text-[#5A4234]">Le levier demandé n'existe pas ou a été déplacé.</p>
        <NuxtLink to="/les-7-leviers" class="inline-block text-xs uppercase tracking-widest bg-[#B08D57] text-[#F8F4ED] px-6 py-3 rounded-full">
          Retour aux 7 leviers
        </NuxtLink>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import { useLevers } from '~/composables/useLevers'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { leviers, getLeverBySlug } = useLevers()
const { injectBreadcrumbSchema } = useJsonLd()

const lever = computed(() => getLeverBySlug(slug.value))

const currentIndex = computed(() => leviers.findIndex((l) => l.slug === slug.value))
const prevLever = computed(() => currentIndex.value > 0 ? leviers[currentIndex.value - 1] : undefined)
const nextLever = computed(() => currentIndex.value < leviers.length - 1 ? leviers[currentIndex.value + 1] : undefined)

if (lever.value) {
  useSeo({
    title: lever.value.metaTitle,
    description: lever.value.metaDescription,
    path: `/les-7-leviers/${lever.value.slug}`,
    keywords: lever.value.keywords
  })

  injectBreadcrumbSchema([
    { name: 'Accueil', item: '/' },
    { name: 'Les 7 Leviers', item: '/les-7-leviers' },
    { name: lever.value.title, item: `/les-7-leviers/${lever.value.slug}` }
  ])
}
</script>
