<template>
  <section
    id="genese"
    ref="sectionRef"
    class="relative w-full bg-[#F8F4EE] text-[#3A2115] py-16 sm:py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex flex-col justify-center overflow-hidden"
  >
    <!-- Soft ambient paper glow background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-[#B08D57]/10 via-transparent to-transparent pointer-events-none" />

    <div class="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      <!-- Left Column: Monumental Title -->
      <div class="lg:col-span-5 flex flex-col items-start">
        <span class="origin-tag uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4 inline-block drop-shadow-sm">
          La Genèse
        </span>

        <h2 class="origin-title font-serif text-[#3A2115] font-normal tracking-[-0.04em] leading-[0.88] text-[clamp(4rem,9vw,10.5rem)] mb-6 drop-shadow-md">
          L'origine
        </h2>

        <div class="origin-divider w-24 h-[1px] bg-gradient-to-r from-[#B08D57] via-[#B08D57]/40 to-transparent" />
      </div>

      <!-- Right Column: Narrative Prose -->
      <div class="lg:col-span-7 flex flex-col space-y-6 md:space-y-8 text-[#5A4234] text-base md:text-lg lg:text-xl font-light leading-relaxed">
        <p class="origin-text leading-relaxed">
          Rien de ce qui est écrit dans ces pages ne découle de théories abstraites ou de dogmes académiques. <strong class="text-[#3A2115] font-normal">Une Formule</strong> s'est forgée au fil de 15 années d'observations sur le terrain, d'expérimentations réelles et d'études comportementales rigoureuses.
        </p>

        <!-- Elegant Pull-Quote -->
        <blockquote class="origin-quote border-l-2 border-[#B08D57] pl-6 py-2 my-4 font-serif italic text-xl md:text-2xl text-[#B08D57] leading-snug">
          « Une loi ne s'invente pas : elle se découvre en éliminant tout ce qui est superflu. »
        </blockquote>

        <p class="origin-text leading-relaxed">
          En analysant les parcours de leaders, d'inventeurs et de bâtisseurs d'exception, un schéma universel s'est révélé : la capacité récurrente à condenser des problèmes d'une complexité extrême en quelques équations décisionnelles simples et inébranlables.
        </p>

        <p class="origin-text leading-relaxed">
          Ce livre est la synthèse ultime de cette quête. Un guide stratégique conçu pour quiconque refuse l'aléatoire et exige la maîtrise totale de sa destinée.
        </p>

        <!-- Decorative formula signature -->
        <div class="origin-sig pt-6 flex items-center gap-4 text-[#B08D57] font-serif tracking-[0.2em] text-sm md:text-base font-medium">
          <span>Α + β = Ω</span>
          <span class="w-12 h-[1px] bg-[#B08D57]/40" />
          <span class="text-xs uppercase tracking-[0.3em] text-[#5A4234]/60 font-sans">Le Manuscrit Originel</span>
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
    gsap.fromTo(['.origin-tag', '.origin-title', '.origin-divider'],
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

    gsap.fromTo(['.origin-text', '.origin-quote', '.origin-sig'],
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
          start: 'top 80%',
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
