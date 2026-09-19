<template>
  <footer
    ref="footerRef"
    class="relative bg-[#120D09] text-[#F6F0E7] pt-20 md:pt-28 pb-12 border-t border-[#B08D57]/20 overflow-hidden"
  >
    <!-- Subtle gold radial glow background -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#B08D57]/10 via-transparent to-transparent pointer-events-none" />

    <div class="container mx-auto px-6 sm:px-10 md:px-16 lg:px-24 relative z-10">
      <!-- Main Footer Top Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#B08D57]/20">
        <!-- Col 1: Brand & Editorial Quote (lg:col-span-5) -->
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <!-- Logo -->
            <NuxtLink to="/" class="inline-flex items-center gap-2 font-serif text-2xl md:text-3xl tracking-[0.25em] text-[#F6F0E7] font-medium mb-4 group">
              <span class="text-[#C7A45D] transition-transform duration-300 group-hover:scale-110">Α</span>
              <span>+</span>
              <span class="text-[#C7A45D]">β</span>
              <span>=</span>
              <span class="text-[#C7A45D]">Ω</span>
            </NuxtLink>

            <!-- Editorial Subtitle -->
            <p class="font-serif italic text-[#C7A45D] text-base md:text-lg mb-6 font-light max-w-sm">
              « Une formule pour comprendre, construire et transmettre. »
            </p>

            <p class="text-[#D4C8BE]/70 text-xs md:text-sm font-light leading-relaxed max-w-sm">
              Une formule est un ouvrage d'exception conçu comme un véritable outil de transformation personnelle et d'élévation stratégique par Dieudonné Sossa GOSSOU.
            </p>
          </div>

          <!-- Copyright badge -->
          <div class="mt-8 pt-4 border-t border-[#B08D57]/15 text-xs text-[#D4C8BE]/50 tracking-widest uppercase">
            Édition Limitée · Tous droits réservés
          </div>
        </div>

        <!-- Col 2: Navigation (lg:col-span-3) -->
        <div class="lg:col-span-3">
          <h4 class="font-serif uppercase tracking-[0.3em] text-[#C7A45D] text-xs font-semibold mb-6">
            Architecture
          </h4>
          <ul class="space-y-3 text-sm font-light">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-[#F6F0E7]/80 hover:text-[#C7A45D] transition-colors tracking-wider">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Communauté & Articles (lg:col-span-2) -->
        <div class="lg:col-span-2">
          <h4 class="font-serif uppercase tracking-[0.3em] text-[#C7A45D] text-xs font-semibold mb-6">
            Ressources
          </h4>
          <ul class="space-y-3 text-sm font-light">
            <li>
              <NuxtLink to="/temoignages" class="text-[#F6F0E7]/80 hover:text-[#C7A45D] transition-colors tracking-wider flex items-center gap-2">
                <span>Témoignages</span>
                <span class="text-[10px] bg-[#B08D57]/30 text-[#C7A45D] px-2 py-0.5 rounded-full font-serif">Avis</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/articles" class="text-[#F6F0E7]/80 hover:text-[#C7A45D] transition-colors tracking-wider">
                Articles SEO
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="text-[#F6F0E7]/80 hover:text-[#C7A45D] transition-colors tracking-wider">
                FAQ
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 4: Action & Legal (lg:col-span-2) -->
        <div class="lg:col-span-2 flex flex-col justify-between">
          <div>
            <h4 class="font-serif uppercase tracking-[0.3em] text-[#C7A45D] text-xs font-semibold mb-6">
              Acquisition
            </h4>
            <NuxtLink
              to="/commander"
              class="inline-block text-xs uppercase tracking-[0.2em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all duration-300 rounded-full px-6 py-2.5 shadow-md font-sans"
              @click="trackCommanderClick"
            >
              Commander
            </NuxtLink>
          </div>

          <div class="mt-8">
            <h4 class="font-serif uppercase tracking-[0.3em] text-[#C7A45D] text-xs font-semibold mb-3">
              Informations
            </h4>
            <ul class="space-y-2 text-xs font-light text-[#D4C8BE]/60">
              <li><button type="button" class="hover:text-[#C7A45D] transition-colors" @click="showLegalModal = true">Mentions légales</button></li>
              <li><button type="button" class="hover:text-[#C7A45D] transition-colors" @click="showPrivacyModal = true">Politique de confidentialité</button></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D4C8BE]/40 font-light gap-4">
        <span>© 2026 Une Formule. Maison d'Édition.</span>
        <div class="flex items-center space-x-6">
          <NuxtLink to="/admin" class="hover:text-[#C7A45D] transition-colors">Espace Admin</NuxtLink>
          <span>Conçu avec précision & élégance</span>
        </div>
      </div>
    </div>

    <!-- Legal Modal -->
    <Transition name="modal-fade">
      <div v-if="showLegalModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm" @click.self="showLegalModal = false">
        <div class="bg-[#F8F4ED] text-[#3A2115] p-8 md:p-10 rounded-2xl max-w-lg w-full relative border border-[#B08D57]/30 shadow-2xl">
          <button type="button" class="absolute top-4 right-4 text-[#3A2115] hover:text-[#B08D57]" @click="showLegalModal = false">✕</button>
          <h3 class="font-serif text-2xl text-[#3A2115] mb-4">Mentions Légales</h3>
          <p class="text-sm font-light leading-relaxed mb-4 text-[#5A4234]">
            Le site <strong>Une Formule</strong> est édité par la maison d'édition éponyme.<br>
            Auteur et Directeur de publication : Dieudonné Sossa GOSSOU.<br>
            Hébergement : Infrastructure Nuxt / Nitro Cloud Server.
          </p>
          <div class="text-right">
            <button type="button" class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold border border-[#B08D57]/40 px-4 py-2 rounded-full hover:bg-[#B08D57] hover:text-[#F8F4ED] transition-colors" @click="showLegalModal = false">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Privacy Modal -->
    <Transition name="modal-fade">
      <div v-if="showPrivacyModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm" @click.self="showPrivacyModal = false">
        <div class="bg-[#F8F4ED] text-[#3A2115] p-8 md:p-10 rounded-2xl max-w-lg w-full relative border border-[#B08D57]/30 shadow-2xl">
          <button type="button" class="absolute top-4 right-4 text-[#3A2115] hover:text-[#B08D57]" @click="showPrivacyModal = false">✕</button>
          <h3 class="font-serif text-2xl text-[#3A2115] mb-4">Politique de Confidentialité</h3>
          <p class="text-sm font-light leading-relaxed mb-4 text-[#5A4234]">
            Vos données personnelles recueillies dans le cadre des retours de lecture ne sont utilisées qu'à des fins d'amélioration de l'ouvrage et de publication anonyme ou nominative selon votre consentement explicite. Aucune donnée n'est cédée à des tiers.
          </p>
          <div class="text-right">
            <button type="button" class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold border border-[#B08D57]/40 px-4 py-2 rounded-full hover:bg-[#B08D57] hover:text-[#F8F4ED] transition-colors" @click="showPrivacyModal = false">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAnalytics } from '../../composables/useAnalytics'

const footerRef = ref<HTMLElement | null>(null)
const showLegalModal = ref(false)
const showPrivacyModal = ref(false)
const { trackEvent } = useAnalytics()
let ctx: gsap.Context | null = null

const navLinks = [
  { label: 'Le Livre', to: '/le-livre' },
  { label: 'Les 7 leviers', to: '/les-7-leviers' },
  { label: 'La Genèse', to: '/la-genese' },
  { label: 'L\'auteur', to: '/auteur' },
  { label: 'Extraits', to: '/extraits' }
]

const trackCommanderClick = () => {
  trackEvent('commander_click', { location: 'footer' })
}

onMounted(() => {
  if (!import.meta.client || !footerRef.value) return

  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    gsap.from(footerRef.value, {
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    })
  }, footerRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
