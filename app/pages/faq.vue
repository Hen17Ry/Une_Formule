<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">FAQ</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Foire Aux Questions · Informations Officielles
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Questions Fréquentes
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Tout ce que vous devez savoir sur l'ouvrage, les formats et l'accompagnement. »
          </p>
        </div>
      </section>

      <!-- FAQ Accordion Container -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20 max-w-4xl">
        <div class="space-y-4">
          <div
            v-for="(item, idx) in faqs"
            :key="idx"
            class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-2xl overflow-hidden transition-all"
          >
            <button
              type="button"
              class="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-xl text-[#3A2115] hover:text-[#B08D57] transition-colors"
              @click="toggleFaq(idx)"
            >
              <span>{{ item.question }}</span>
              <span class="text-xl font-sans text-[#B08D57] shrink-0">{{ openIdx === idx ? '−' : '+' }}</span>
            </button>
            <div v-if="openIdx === idx" class="px-6 pb-6 text-[#5A4234] text-base font-light leading-relaxed border-t border-[#B08D57]/15 pt-4">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div class="bg-[#120D09] text-[#F6F0E7] rounded-3xl p-10 md:p-14 border border-[#B08D57]/40 max-w-3xl mx-auto space-y-6">
          <h2 class="font-serif text-3xl text-[#F6F0E7]">Une question spécifique ?</h2>
          <p class="text-[#D4C8BE]/80 text-sm font-light">Accédez directement à la page de commande pour réserver votre livre.</p>
          <NuxtLink
            to="/commander"
            class="inline-block text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all rounded-full px-8 py-3.5 shadow-md"
          >
            Passer Commande
          </NuxtLink>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const openIdx = ref<number | null>(0)
const { injectFaqSchema, injectBreadcrumbSchema } = useJsonLd()

const toggleFaq = (idx: number) => {
  openIdx.value = openIdx.value === idx ? null : idx
}

const faqs = [
  {
    question: 'En quels formats le livre Une Formule est-il disponible ?',
    answer: 'L\'ouvrage est disponible en Édition Luxe Reliée (couverture rigide, papier haute qualité) ainsi qu\'en version numérique universelle (PDF & EPUB HD) téléchargeable immédiatement après confirmation.'
  },
  {
    question: 'À qui s\'adresse en priorité cet ouvrage ?',
    answer: 'Une Formule s\'adresse aux dirigeants, entrepreneurs, créateurs, cadres et esprits ambitieux qui souhaitent éliminer la dispersion, structurer leur temps et construire un impact à haut niveau.'
  },
  {
    question: 'Quels sont les délais de livraison pour la version physique ?',
    answer: 'Les expéditions sont traitées sous 24h à 48h ouvrées. La livraison s\'effectue sous 3 à 5 jours ouvrés en France métropolitaine et sous 5 à 8 jours pour l\'international.'
  },
  {
    question: 'Est-il possible d\'organiser une conférence ou une intervention avec l\'auteur ?',
    answer: 'Oui, Dieudonné Sossa GOSSOU intervient régulièrement auprès de comités de direction et lors de conventions. Pour toute demande d\'intervention, veuillez contacter la maison d\'édition.'
  }
]

useSeo({
  title: 'Foire Aux Questions (FAQ) | Une Formule',
  description: 'Retrouvez les réponses aux questions les plus fréquentes concernant le livre Une Formule, les formats disponibles, la livraison et les interventions de l\'auteur.',
  path: '/faq'
})

injectFaqSchema(faqs)
injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'FAQ', item: '/faq' }
])
</script>
