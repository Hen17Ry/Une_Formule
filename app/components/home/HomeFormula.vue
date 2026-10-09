<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { FORMULA_TERMS } from '~/data/book'

const root = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(async () => {
  const { gsap } = await useGsap()
  if (prefersReducedMotion() || !root.value) return
  ctx = gsap.context(() => {
    gsap.from('[data-term-glyph]', {
      scale: 0.55, opacity: 0, rotate: -8, duration: 1.6, stagger: 0.16, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-terms]', start: 'top 80%', once: true }
    })
    gsap.from('[data-op]', {
      scale: 0, opacity: 0, duration: 1.2, stagger: 0.16, delay: 0.3, ease: 'back.out(2)',
      scrollTrigger: { trigger: '[data-terms]', start: 'top 80%', once: true }
    })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="formule" ref="root" class="relative overflow-hidden py-28 md:py-40" aria-labelledby="formule-title">
    <BrandRings class="pointer-events-none absolute -right-60 top-10 h-[46rem] w-[46rem] opacity-40" />
    <div class="container relative">
      <div class="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div>
          <p v-reveal class="label-gold">Note explicative de la formule</p>
          <UiSplitReveal id="formule-title" class="mt-5 font-display text-display-lg text-ink">
            Pas un ornement. <em class="text-caramel">Un raccourci.</em>
          </UiSplitReveal>
        </div>
        <p v-reveal class="max-w-xl font-serif text-[1.2rem] leading-relaxed text-ink-soft lg:justify-self-end">
          Vous l’avez déjà vue sur la couverture : <span class="formula whitespace-nowrap text-ink">Α + β = Ω</span>. C’est un raccourci volontaire des convictions qui portent ce livre, écrit par quelqu’un qui est, entre autres titres, mathématicien.
        </p>
      </div>

      <div data-terms class="mt-14 grid items-stretch gap-4 md:mt-20 md:grid-cols-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-3">
        <template v-for="(t, i) in FORMULA_TERMS" :key="t.symbol">
          <UiSpotlight tag="article" class="surface flex flex-col p-7 lg:p-10">
            <div class="flex items-start justify-between">
              <span data-term-glyph class="formula block bg-clip-text text-[6rem] leading-[0.85] text-transparent lg:text-[7.5rem] [background-image:var(--cover-gradient)]" :class="t.symbol === 'β' && 'italic'" aria-hidden="true">{{ t.symbol }}</span>
              <span class="rounded-full border border-line px-3 py-1 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">{{ t.role }}</span>
            </div>
            <p class="mt-8 font-sans text-xs uppercase tracking-[0.24em] text-ink-muted">{{ t.name }}</p>
            <h3 class="mt-2 font-display text-[1.75rem] leading-tight lg:text-[2rem]">{{ t.title }}</h3>
            <p class="mt-4 font-serif text-[1.08rem] leading-relaxed text-ink-soft">{{ t.text }}</p>
          </UiSpotlight>
          <div v-if="i < 2" data-op class="formula grid place-items-center text-5xl text-gold max-md:-my-2 md:max-lg:hidden" aria-hidden="true">{{ i === 0 ? '+' : '=' }}</div>
        </template>
      </div>

      <div v-reveal class="mt-16 flex flex-col items-start justify-between gap-8 border-t border-line pt-10 md:flex-row md:items-center">
        <p class="max-w-3xl font-display text-[1.6rem] leading-snug text-ink md:text-[1.9rem]">
          Le matériau, c’est <span class="formula">Α</span>. Le magicien, c’est vous dès que vous actionnez <span class="formula italic">β</span>. Et l’architecte qui dessine les plans d’<span class="formula">Ω</span>, c’est encore vous.
        </p>
        <UiButton to="/extraits#note-explicative-de-la-formule" variant="outline" :icon="ArrowRight" class="shrink-0">Lire la note complète</UiButton>
      </div>
    </div>
  </section>
</template>
