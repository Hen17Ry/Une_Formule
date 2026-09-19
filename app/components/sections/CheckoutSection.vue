<template>
  <section
    id="commander"
    ref="sectionRef"
    class="relative min-h-screen w-full bg-[#F8F4EE] text-[#3A2115] py-28 md:py-40 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex items-center overflow-hidden"
  >
    <!-- Background Ambient Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#B08D57]/15 via-transparent to-transparent pointer-events-none" />

    <div class="container mx-auto max-w-5xl relative z-10 text-center">
      <!-- Badge -->
      <span class="chk-tag inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4 drop-shadow-sm">
        Tirage Numeroté & Limité
      </span>

      <!-- Main Conclusion Title -->
      <h2 class="chk-title font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#3A2115] font-normal tracking-tight leading-tight mb-6">
        Faites l'expérience d'Une Formule.
      </h2>

      <div class="chk-line w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent mx-auto mb-8" />

      <p class="chk-text text-[#5A4234] text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-12">
        Un ouvrage d'exception conçu comme un objet de transmission. Reliure rigide, marquage à chaud doré et papier premium.
      </p>

      <!-- Luxury Order Card -->
      <div class="chk-card max-w-xl mx-auto bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 sm:p-12 shadow-[0_30px_70px_rgba(58,33,21,0.15)] mb-12">
        <div class="flex items-center justify-between border-b border-[#B08D57]/20 pb-6 mb-6">
          <div class="text-left">
            <span class="font-serif text-2xl text-[#3A2115] block font-normal">Une Formule</span>
            <span class="text-xs uppercase tracking-[0.2em] text-[#5A4234]/75">Édition Reliée de Luxe</span>
          </div>
          <div class="text-right">
            <span class="font-serif text-3xl text-[#B08D57] font-medium block">49 €</span>
            <span class="text-xs text-[#5A4234]/70">Livraison Offerte</span>
          </div>
        </div>

        <ul class="text-left space-y-3 text-sm text-[#5A4234] mb-8">
          <li class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
            <span>Reliure artisanale & fer à dorer doré</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
            <span>Papier création 120g/m² sans acide</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
            <span>Exemplaire numéroté à la main</span>
          </li>
        </ul>

        <button
          type="button"
          class="w-full font-serif text-lg text-[#F8F4EE] bg-[#B08D57] hover:bg-[#3A2115] transition-all duration-300 rounded-full py-4 tracking-widest font-medium shadow-md hover:shadow-lg"
        >
          Commander l'Édition Limitée
        </button>
      </div>

      <!-- Footer Brand Mark -->
      <div class="chk-footer flex flex-col items-center justify-center space-y-2">
        <span class="font-serif text-[#B08D57] tracking-[0.25em] text-xl font-medium">Α + β = Ω</span>
        <span class="text-xs uppercase tracking-[0.3em] text-[#5A4234]/60">Maison d'Édition · Tous droits réservés</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!import.meta.client || !sectionRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from(['.chk-tag', '.chk-title', '.chk-line', '.chk-text'], {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out'
    })

    tl.from('.chk-card', {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.4')
  }, sectionRef.value)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>
