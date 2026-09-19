<template>
  <section
    id="extraits"
    ref="sectionRef"
    class="relative min-h-screen w-full bg-[#F8F4EE] text-[#3A2115] py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex items-center overflow-hidden"
  >
    <div class="container mx-auto max-w-6xl relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <span class="ex-tag inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
          Feuilleter l'Ouvrage
        </span>
        <h2 class="ex-title font-serif text-3xl sm:text-4xl md:text-5xl text-[#3A2115] font-normal tracking-tight leading-tight mb-4">
          Extraits Choisis du Manuscrit
        </h2>
        <div class="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent mx-auto mb-4" />
        <p class="text-[#5A4234] text-sm md:text-base font-light">
          Plongez au cœur des pages de l'édition limitée.
        </p>
      </div>

      <!-- Open Book 3D Container -->
      <div class="ex-book relative w-full bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-6 sm:p-10 md:p-14 shadow-[0_25px_60px_rgba(58,33,21,0.15)] overflow-hidden">
        <!-- Central Spine shadow -->
        <div class="hidden lg:block absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/10 to-black/5 pointer-events-none z-20" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10">
          <!-- Left Page -->
          <div class="flex flex-col justify-between h-full border-b lg:border-b-0 lg:border-r border-[#B08D57]/15 pb-8 lg:pb-0 lg:pr-10">
            <div>
              <div class="flex items-center justify-between mb-6">
                <span class="text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold">Chapitre {{ activePage + 1 }}</span>
                <span class="text-xs font-serif text-[#5A4234]/60">Page {{ (activePage + 1) * 2 - 1 }}</span>
              </div>
              <h3 class="font-serif text-2xl md:text-3xl text-[#3A2115] font-normal mb-4">
                {{ currentExcerpt.leftTitle }}
              </h3>
              <p class="text-[#5A4234] text-sm md:text-base font-light leading-relaxed first-letter:float-left first-letter:text-4xl first-letter:font-serif first-letter:mr-3 first-letter:text-[#B08D57]">
                {{ currentExcerpt.leftText }}
              </p>
            </div>
            <div class="mt-8 pt-4 border-t border-[#B08D57]/15">
              <p class="font-serif italic text-xs text-[#B08D57]">
                {{ currentExcerpt.leftQuote }}
              </p>
            </div>
          </div>

          <!-- Right Page -->
          <div class="flex flex-col justify-between h-full lg:pl-4">
            <div>
              <div class="flex items-center justify-between mb-6">
                <span class="text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold">Une Formule</span>
                <span class="text-xs font-serif text-[#5A4234]/60">Page {{ (activePage + 1) * 2 }}</span>
              </div>
              <h3 class="font-serif text-2xl md:text-3xl text-[#3A2115] font-normal mb-4">
                {{ currentExcerpt.rightTitle }}
              </h3>
              <p class="text-[#5A4234] text-sm md:text-base font-light leading-relaxed mb-4">
                {{ currentExcerpt.rightText }}
              </p>
            </div>

            <!-- Page Navigation Controls -->
            <div class="mt-8 pt-4 border-t border-[#B08D57]/15 flex items-center justify-between">
              <button
                type="button"
                class="text-xs uppercase tracking-[0.2em] text-[#B08D57] hover:text-[#3A2115] transition-colors font-medium flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                :disabled="activePage === 0"
                @click="activePage--"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Précédent</span>
              </button>

              <span class="text-xs tracking-widest text-[#5A4234]">
                {{ activePage + 1 }} / {{ excerpts.length }}
              </span>

              <button
                type="button"
                class="text-xs uppercase tracking-[0.2em] text-[#B08D57] hover:text-[#3A2115] transition-colors font-medium flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                :disabled="activePage === excerpts.length - 1"
                @click="activePage++"
              >
                <span>Suivant</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Excerpt {
  leftTitle: string
  leftText: string
  leftQuote: string
  rightTitle: string
  rightText: string
}

const sectionRef = ref<HTMLElement | null>(null)
const activePage = ref(0)
let ctx: gsap.Context | null = null

const excerpts: Excerpt[] = [
  {
    leftTitle: 'De l\'Intention Pure',
    leftText: 'Chaque grande œuvre commence par le refus délibéré du désordre. L\'intention pure n\'est pas un vœu pieux, mais un filtre impitoyable appliqué à la réalité quotidienne. Elle exige de renoncer à mille bonnes idées pour en concrétiser une seule d\'exception.',
    leftQuote: '« Ce que vous refusez détermine la valeur de ce que vous conservez. »',
    rightTitle: 'Le Silence Stratégique',
    rightText: 'Avant la tempête de l\'exécution doit régner le silence absolu de la réflexion. C\'est dans cet espace préservé que s\'élaborent les stratégies qui résistent au temps et aux imprévus.'
  },
  {
    leftTitle: 'La Densité du Temps',
    leftText: 'L\'illusion moderne est de croire que l\'accumulation des heures produit la grandeur. La réalité est que la valeur naît de la densité d\'intention insufflée dans des intervalles de concentration totale.',
    leftQuote: '« Une heure d\'immersion absolue vaut un mois de travail dispersé. »',
    rightTitle: 'L\'Effet Multiplicateur',
    rightText: 'Lorsque vous associez la maîtrise de l\'attention à des leviers organisationnels scalables, vos actions cessent d\'être linéaires : elles deviennent exponentielles.'
  }
]

const currentExcerpt = computed<Excerpt>(() => excerpts[activePage.value] ?? excerpts[0]!)

onMounted(() => {
  if (!import.meta.client || !sectionRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    gsap.from('.ex-book', {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>
