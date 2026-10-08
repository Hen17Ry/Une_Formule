<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { AUTHOR, BOOK } from '~/data/book'

useSeo({ title: `À propos de l’auteur — ${AUTHOR.name}`, description: AUTHOR.bio[0]! })
const line = ref<HTMLElement>()
let st: any
onMounted(async () => {
  const { gsap } = await useGsap()
  if (!line.value || prefersReducedMotion()) return
  const t = gsap.fromTo(line.value, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: line.value.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
  st = t.scrollTrigger
})
onBeforeUnmount(() => st?.kill())
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <BrandRings class="pointer-events-none absolute -right-60 -top-40 h-[50rem] w-[50rem] opacity-40" />
    <div class="container relative">
      <div class="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <header>
          <p v-reveal class="label-gold">À propos de l’auteur</p>
          <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">{{ AUTHOR.name }}</UiSplitReveal>
          <ul v-reveal.stagger class="mt-7 flex flex-wrap gap-2">
            <li v-for="r in AUTHOR.roles" :key="r" class="rounded-full border border-line bg-white/60 px-4 py-1.5 font-sans text-sm text-ink-soft">{{ r }}</li>
          </ul>
          <div class="prose-book mt-10 max-w-2xl">
            <p v-for="(p, i) in AUTHOR.bio" :key="i" v-reveal>{{ p }}</p>
          </div>
        </header>
        <div v-reveal="'scale'" class="relative mx-auto aspect-square w-full max-w-[28rem]">
          <BrandRings class="absolute inset-[-12%] h-[124%] w-[124%] opacity-80" />
          <div class="absolute inset-[11%] grid place-items-center rounded-full text-[#FFFDF9] shadow-book [background:var(--cover-soft)]">
            <div class="px-6 text-center">
              <p class="font-display text-[clamp(3.4rem,7vw,5rem)] leading-none tracking-[0.06em]">D·S·G</p>
              <span class="mx-auto mt-4 block h-px w-14 bg-white/60" aria-hidden="true" />
              <p class="mt-4 font-sans text-[0.66rem] uppercase tracking-[0.3em] text-white/85">Cotonou · Bénin</p>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-28" aria-labelledby="parcours">
        <p v-reveal class="label-gold">Le parcours</p>
        <h2 id="parcours" class="mt-4 font-display text-display-md">La rigueur du mathématicien, <em class="text-caramel">le terrain de l’accompagnement</em>.</h2>
        <ol class="relative mt-14 space-y-12 pl-10 md:pl-0">
          <span aria-hidden="true" class="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-1/2" />
          <span ref="line" aria-hidden="true" class="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-caramel md:left-1/2" />
          <li v-for="(t, i) in AUTHOR.timeline" :key="t.year" v-reveal class="relative md:grid md:grid-cols-2 md:gap-16">
            <span aria-hidden="true" class="absolute -left-10 top-2 h-[15px] w-[15px] rounded-full border-2 border-caramel bg-paper md:left-1/2 md:-translate-x-1/2" />
            <div :class="i % 2 ? 'md:col-start-2' : 'md:text-right'">
              <p class="font-display text-[2.6rem] leading-none text-caramel">{{ t.year }}</p>
              <h3 class="mt-3 font-display text-[1.6rem]">{{ t.title }}</h3>
              <p class="mt-2 font-serif text-[1.08rem] leading-relaxed text-ink-soft" :class="i % 2 ? '' : 'md:ml-auto'">{{ t.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <div v-reveal class="mt-28 rounded-[36px] border border-line bg-paper-2/70 px-8 py-14 text-center md:px-16">
        <p class="mx-auto max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] italic leading-tight text-ink">« {{ BOOK.maxim }} »</p>
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <UiButton to="/extraits" variant="outline">Lire l’avant-propos</UiButton>
          <UiButton to="/commander" :icon="ArrowRight">Commander le livre</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
