<template>
  <section
    id="auteur"
    ref="sectionRef"
    class="relative min-h-screen w-full bg-[#F8F4EE] text-[#3A2115] py-28 md:py-40 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex items-center overflow-hidden"
  >
    <div class="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      <!-- Left Column: Author Portrait & Emblem Frame -->
      <div class="lg:col-span-5 flex justify-center">
        <div class="author-frame relative w-full max-w-md aspect-[4/5] bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(58,33,21,0.12)] flex flex-col justify-between overflow-hidden group">
          <!-- Inner Decorative Border -->
          <div class="absolute inset-4 border border-[#B08D57]/20 rounded-2xl pointer-events-none" />

          <!-- Author Emblem / Initials -->
          <div class="flex items-center justify-between z-10">
            <span class="font-serif text-[#B08D57] text-2xl font-medium tracking-widest">DSG</span>
            <span class="text-xs uppercase tracking-[0.25em] text-[#5A4234]/70 font-medium">L'Auteur</span>
          </div>

          <!-- Central Emblem Monogram -->
          <div class="my-auto text-center z-10 py-12">
            <div class="w-24 h-24 rounded-full border border-[#B08D57]/40 mx-auto flex items-center justify-center mb-6 bg-[#F8F4EE] shadow-sm">
              <span class="font-serif text-3xl text-[#B08D57]">DS</span>
            </div>
            <h3 class="font-serif text-2xl text-[#3A2115] font-normal mb-1">Dieudonné Sossa GOSSOU</h3>
            <p class="text-xs uppercase tracking-[0.2em] text-[#5A4234]/80">Auteur & Penseur Stratégique</p>
          </div>

          <!-- Card Footer Signature -->
          <div class="text-center border-t border-[#B08D57]/20 pt-4 z-10">
            <span class="font-serif italic text-xs text-[#B08D57]">« Penser les lois, appliquer l'action. »</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Editorial Bio Prose -->
      <div class="lg:col-span-7 flex flex-col space-y-6 md:space-y-8 text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
        <div>
          <span class="author-tag uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-3 inline-block">
            Portrait Éditorial
          </span>
          <h2 class="author-title font-serif text-3xl sm:text-4xl md:text-5xl text-[#3A2115] font-normal tracking-tight leading-tight mb-4">
            Dieudonné Sossa GOSSOU
          </h2>
          <div class="author-line w-20 h-[1px] bg-gradient-to-r from-[#B08D57] via-[#B08D57]/40 to-transparent mb-6" />
        </div>

        <p class="author-text leading-relaxed">
          Penseur pragmatique et observateur des dynamiques de réussite, <strong class="text-[#3A2115] font-normal">Dieudonné Sossa GOSSOU</strong> consacre son œuvre à la déconstruction des leviers de la haute performance individuelle et collective.
        </p>

        <blockquote class="author-quote border-l-2 border-[#B08D57] pl-6 py-2 my-2 font-serif italic text-xl text-[#B08D57] leading-snug">
          « L'excellence n'est pas un acte accidentel, mais la conséquence prévisible de principes universels observés avec discipline. »
        </blockquote>

        <p class="author-text leading-relaxed">
          À travers cet ouvrage d'exception, il synthétise des années de recherche et de mentorat en une formule accessible, épurée de tout artifice commercial, destinée à devenir une référence incontournable de la littérature stratégique contemporaine.
        </p>

        <div class="author-footer pt-4 flex items-center gap-6">
          <div class="flex flex-col">
            <span class="font-serif text-2xl text-[#3A2115]">15+</span>
            <span class="text-xs uppercase tracking-[0.2em] text-[#5A4234]/80">Années d'Expérience</span>
          </div>
          <div class="w-[1px] h-10 bg-[#B08D57]/30" />
          <div class="flex flex-col">
            <span class="font-serif text-2xl text-[#3A2115]">7</span>
            <span class="text-xs uppercase tracking-[0.2em] text-[#5A4234]/80">Leviers Fondamentaux</span>
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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from('.author-frame', {
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: 'power3.out'
    })

    tl.from(['.author-tag', '.author-title', '.author-line'], {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6')

    tl.from(['.author-text', '.author-quote', '.author-footer'], {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
  }, sectionRef.value)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>
