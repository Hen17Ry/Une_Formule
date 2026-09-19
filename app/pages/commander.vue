<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">Commander</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl">
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
            Acquisition Officielle · Édition Limitée
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal leading-tight mb-6">
            Commander Une Formule
          </h1>
          <p class="font-serif italic text-xl md:text-2xl text-[#B08D57] font-light leading-relaxed">
            « Choisissez l'édition adaptée à vos exigences et commencez la mise en pratique immédiate. »
          </p>
        </div>
      </section>

      <!-- Pricing / Edition Options Grid -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Digital Pack -->
          <div class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-[#B08D57] transition-all">
            <div class="space-y-4">
              <span class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold">Édition Numérique</span>
              <h3 class="font-serif text-2xl text-[#3A2115]">Pack PDF & EPUB HD</h3>
              <div class="font-serif text-4xl text-[#3A2115] font-medium">19,00 €</div>
              <p class="text-xs text-[#5A4234] font-light">Téléchargement immédiat haute résolution avec marqueurs de chapitres.</p>
              <ul class="space-y-2 text-xs text-[#5A4234] border-t border-[#B08D57]/20 pt-4">
                <li>✓ Format PDF interactif HD</li>
                <li>✓ Format EPUB liseuses (Kindle/Kobo)</li>
                <li>✓ Accès immédiat 24h/7j</li>
              </ul>
            </div>
            <button
              type="button"
              class="mt-8 w-full text-xs uppercase tracking-[0.25em] font-medium text-[#B08D57] border border-[#B08D57]/50 hover:bg-[#B08D57] hover:text-[#F8F4ED] transition-all rounded-full py-3.5"
              @click="selectEdition('digital')"
            >
              Sélectionner Numérique
            </button>
          </div>

          <!-- Hardcover Book (Featured) -->
          <div class="bg-[#120D09] text-[#F6F0E7] border-2 border-[#C7A45D] rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden transform md:-translate-y-2">
            <div class="absolute top-4 right-4 bg-[#C7A45D] text-[#120D09] text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
              Recommandé
            </div>
            <div class="space-y-4">
              <span class="text-xs uppercase tracking-widest text-[#C7A45D] font-semibold">Livre Relié Prestige</span>
              <h3 class="font-serif text-2xl text-[#F6F0E7]">Édition Prestige Reliée</h3>
              <div class="font-serif text-4xl text-[#C7A45D] font-medium">39,00 €</div>
              <p class="text-xs text-[#D4C8BE]/80 font-light">Couverture rigide dorée à chaud, papier premium FSC, ruban marque-page.</p>
              <ul class="space-y-2 text-xs text-[#D4C8BE]/90 border-t border-[#B08D57]/30 pt-4">
                <li>✓ Ouvrage relié rigide grand format</li>
                <li>✓ Inclus la version numérique offerte</li>
                <li>✓ Livraison suivie offerte en France</li>
              </ul>
            </div>
            <button
              type="button"
              class="mt-8 w-full text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all rounded-full py-3.5 shadow-md font-sans"
              @click="selectEdition('prestige')"
            >
              Commander l'Édition Reliée
            </button>
          </div>

          <!-- Collector Executive Pack -->
          <div class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-[#B08D57] transition-all">
            <div class="space-y-4">
              <span class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold">Coffret Exécutif</span>
              <h3 class="font-serif text-2xl text-[#3A2115]">Pack Collector Dédicacé</h3>
              <div class="font-serif text-4xl text-[#3A2115] font-medium">89,00 €</div>
              <p class="text-xs text-[#5A4234] font-light">Exemplaire numéroté dédicacé par l'auteur avec carnet de travail et accès conférence.</p>
              <ul class="space-y-2 text-xs text-[#5A4234] border-t border-[#B08D57]/20 pt-4">
                <li>✓ Livre dédicacé par Dieudonné Sossa GOSSOU</li>
                <li>✓ Carnet d'auto-coaching rigide 120 pages</li>
                <li>✓ Invitation à la Masterclass annuelle</li>
              </ul>
            </div>
            <button
              type="button"
              class="mt-8 w-full text-xs uppercase tracking-[0.25em] font-medium text-[#B08D57] border border-[#B08D57]/50 hover:bg-[#B08D57] hover:text-[#F8F4ED] transition-all rounded-full py-3.5"
              @click="selectEdition('collector')"
            >
              Réserver le Coffret
            </button>
          </div>
        </div>

        <!-- Selected Edition Checkout Modal / Trigger Notice -->
        <Transition name="fade">
          <div v-if="selectedEdition" class="mt-12 bg-[#FFFDF9] border border-[#B08D57] rounded-3xl p-8 max-w-2xl mx-auto shadow-md text-center space-y-4">
            <span class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold">Confirmation de Sélection</span>
            <h4 class="font-serif text-2xl text-[#3A2115]">Vous avez choisi l'Édition : {{ selectedEditionTitle }}</h4>
            <p class="text-sm text-[#5A4234] font-light">Redirection sécurisée vers la passerelle de paiement en cours...</p>
            <div class="pt-2">
              <button type="button" class="text-xs text-[#5A4234] underline" @click="selectedEdition = null">Changer d'édition</button>
            </div>
          </div>
        </Transition>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'
import { useAnalytics } from '~/composables/useAnalytics'

const { injectBookSchema, injectBreadcrumbSchema } = useJsonLd()
const { trackEvent } = useAnalytics()

const selectedEdition = ref<string | null>(null)

const selectEdition = (edition: string) => {
  selectedEdition.value = edition
  trackEvent('order_edition_selected', { edition })
}

const selectedEditionTitle = computed(() => {
  if (selectedEdition.value === 'digital') return 'Numérique PDF & EPUB'
  if (selectedEdition.value === 'prestige') return 'Livre Relié Prestige'
  if (selectedEdition.value === 'collector') return 'Coffret Exécutif Dédicacé'
  return ''
})

useSeo({
  title: 'Commander le livre Une Formule (α + β = Ω)',
  description: 'Acquérez l\'édition officielle du livre Une Formule par Dieudonné Sossa GOSSOU. Édition reliée luxe, pack numérique et coffret collector.',
  path: '/commander'
})

injectBookSchema()
injectBreadcrumbSchema([
  { name: 'Accueil', item: '/' },
  { name: 'Commander', item: '/commander' }
])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
