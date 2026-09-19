<template>
  <section
    id="formule"
    ref="sectionRef"
    class="relative w-full bg-[#F8F4EE] text-[#3A2115] py-16 sm:py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex flex-col justify-center overflow-hidden"
  >
    <!-- Background Ambient Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B08D57]/10 via-transparent to-transparent pointer-events-none" />

    <div class="container mx-auto max-w-7xl relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <span class="eq-tag inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-3">
          L'Équation Éditoriale
        </span>
        <h2 class="eq-title font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3A2115] font-normal tracking-tight leading-tight mb-4">
          Comprendre La Formule
        </h2>
        <div class="eq-line w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent mx-auto mb-4" />
        <p class="eq-sub text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
          Une transformation personnelle codifiée en trois composantes indissociables.
        </p>
      </div>

      <!-- Monumental Animated Equation Display -->
      <div class="eq-symbols-container flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-14 mb-10 md:mb-14 text-center select-none bg-[#FFFDF9] border border-[#B08D57]/25 rounded-3xl p-6 sm:p-10 shadow-[0_15px_40px_rgba(58,33,21,0.06)]">
        <!-- Alpha -->
        <div class="eq-sym-item flex flex-col items-center">
          <span class="font-serif text-5xl sm:text-6xl md:text-7xl text-[#B08D57] font-medium leading-none mb-2">Α</span>
          <span class="text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">1. Vous Aujourd'hui</span>
        </div>

        <span class="font-serif text-2xl sm:text-4xl text-[#B08D57]/50 font-light self-center mb-5">+</span>

        <!-- Beta -->
        <div class="eq-sym-item flex flex-col items-center">
          <span class="font-serif text-5xl sm:text-6xl md:text-7xl text-[#B08D57] font-medium leading-none mb-2">β</span>
          <span class="text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">2. Le Mécanisme</span>
        </div>

        <span class="font-serif text-2xl sm:text-4xl text-[#B08D57]/50 font-light self-center mb-5">=</span>

        <!-- Omega -->
        <div class="eq-sym-item flex flex-col items-center">
          <span class="font-serif text-5xl sm:text-6xl md:text-7xl text-[#3A2115] font-medium leading-none mb-2">Ω</span>
          <span class="text-xs uppercase tracking-[0.2em] text-[#B08D57] font-semibold">3. La Version Révélée</span>
        </div>
      </div>

      <!-- 3-Stage Detailed Narrative Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <!-- Stage Alpha Card -->
        <div class="eq-card bg-[#FFFDF9] border border-[#B08D57]/25 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(58,33,21,0.06)] hover:border-[#B08D57] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4 border-b border-[#B08D57]/20 pb-3">
              <span class="font-serif text-3xl text-[#B08D57] font-medium">Α</span>
              <span class="text-xs uppercase tracking-[0.2em] text-[#5A4234]/70 font-semibold">Étape 01</span>
            </div>
            <h3 class="font-serif text-xl sm:text-2xl text-[#3A2115] font-normal mb-3">
              Vous aujourd'hui
            </h3>
            <p class="text-[#5A4234] text-sm sm:text-base font-light leading-relaxed mb-3">
              Votre point de départ. Il regroupe l'ensemble de votre histoire, vos acquis actuels, vos ressources tangibles et vos talents bruts encore inexploités.
            </p>
            <p class="text-[#5A4234] text-xs sm:text-sm font-light leading-relaxed">
              La clarté sur cette donnée initiale est la condition première pour éviter toute fausse route stratégique.
            </p>
          </div>
          <div class="mt-6 pt-3 border-t border-[#B08D57]/15 text-xs uppercase tracking-[0.2em] text-[#B08D57] font-semibold">
            Point d'Appui Initial
          </div>
        </div>

        <!-- Stage Beta Card -->
        <div class="eq-card bg-[#FFFDF9] border border-[#B08D57]/25 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(58,33,21,0.06)] hover:border-[#B08D57] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4 border-b border-[#B08D57]/20 pb-3">
              <span class="font-serif text-3xl text-[#B08D57] font-medium">β</span>
              <span class="text-xs uppercase tracking-[0.2em] text-[#5A4234]/70 font-semibold">Étape 02</span>
            </div>
            <h3 class="font-serif text-xl sm:text-2xl text-[#3A2115] font-normal mb-3">
              Le mécanisme
            </h3>
            <p class="text-[#5A4234] text-sm sm:text-base font-light leading-relaxed mb-3">
              Le catalyseur d'action. C'est l'application méthodique des sept leviers du livre combinée aux protocoles d'exercices pratiques.
            </p>
            <p class="text-[#5A4234] text-xs sm:text-sm font-light leading-relaxed">
              Il convertit votre énergie brute en systèmes automatisés et en discipline stratégique.
            </p>
          </div>
          <div class="mt-6 pt-3 border-t border-[#B08D57]/15 text-xs uppercase tracking-[0.2em] text-[#B08D57] font-semibold">
            Catalyseur & Leviers
          </div>
        </div>

        <!-- Stage Omega Card -->
        <div class="eq-card bg-[#FFFDF9] border border-[#B08D57]/25 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(58,33,21,0.06)] hover:border-[#B08D57] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4 border-b border-[#B08D57]/20 pb-3">
              <span class="font-serif text-3xl text-[#3A2115] font-medium">Ω</span>
              <span class="text-xs uppercase tracking-[0.2em] text-[#B08D57] font-semibold">Résultat</span>
            </div>
            <h3 class="font-serif text-xl sm:text-2xl text-[#3A2115] font-normal mb-3">
              La version révélée
            </h3>
            <p class="text-[#5A4234] text-sm sm:text-base font-light leading-relaxed mb-3">
              L'aboutissement inévitable. La version totalement alignée et souveraine de vous-même, maîtresse de sa trajectoire et créatrice d'impact.
            </p>
            <p class="text-[#5A4234] text-xs sm:text-sm font-light leading-relaxed">
              Le sommet de la formule : la concrétisation durable de ce que vous êtes destiné à bâtir.
            </p>
          </div>
          <div class="mt-6 pt-3 border-t border-[#B08D57]/15 text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">
            Accomplissement Total
          </div>
        </div>
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
    gsap.fromTo(['.eq-tag', '.eq-title', '.eq-line', '.eq-sub'],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 85%',
          once: true
        }
      }
    )

    gsap.fromTo('.eq-sym-item',
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.4)',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          once: true
        }
      }
    )

    gsap.fromTo('.eq-card',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
          once: true
        }
      }
    )
  }, sectionRef.value)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>
