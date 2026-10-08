<script setup lang="ts">
import { Search, PenLine } from '@lucide/vue'
import { FAQ } from '~/data/book'

useSeo({ title: 'Questions / Réponses', description: 'Tout ce qu’il faut savoir sur le livre Une Formule : la formule Α + β = Ω, la science derrière les sept leviers, la façon de le lire.' })
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': FAQ.flatMap(g => g.items).map(i => ({ '@type': 'Question', 'name': i.q, 'acceptedAnswer': { '@type': 'Answer', 'text': i.a } }))
    })
  }]
})

const q = ref('')
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const groups = computed(() => {
  const term = norm(q.value.trim())
  if (!term) return FAQ
  return FAQ.map(g => ({ ...g, items: g.items.filter(i => norm(i.q + ' ' + i.a).includes(term)) })).filter(g => g.items.length)
})
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <BrandRings class="pointer-events-none absolute -right-56 -top-40 h-[48rem] w-[48rem] opacity-40" />
    <div class="container relative grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
      <header class="lg:sticky lg:top-32 lg:self-start">
        <p v-reveal class="label-gold">Questions / Réponses</p>
        <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">Vos <em class="text-caramel">questions</em>.</UiSplitReveal>
        <label class="relative mt-10 block">
          <span class="sr-only">Rechercher une question</span>
          <Search class="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input v-model="q" type="search" placeholder="Rechercher : science, attraction, ordre…" class="h-14 w-full rounded-full border border-line bg-white/75 pl-14 pr-5 font-sans text-[1rem] placeholder:text-ink/40 focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15">
        </label>
        <nav class="mt-8 hidden lg:block" aria-label="Thèmes">
          <ul class="space-y-2">
            <li v-for="(g, i) in groups" :key="g.title"><a :href="`#theme-${i}`" class="link-underline font-sans text-[0.95rem] text-ink-soft hover:text-ink">{{ g.title }}</a></li>
          </ul>
        </nav>
      </header>

      <div>
        <section v-for="(g, i) in groups" :id="`theme-${i}`" :key="g.title" class="mb-14 scroll-mt-32">
          <h2 class="mb-2 font-sans text-xs uppercase tracking-[0.26em] text-ink-muted">{{ g.title }}</h2>
          <UiAccordion :items="g.items" />
        </section>
        <p v-if="!groups.length" class="rounded-[24px] border border-dashed border-line-strong px-6 py-10 text-center font-serif text-lg text-ink-soft">Aucune question ne correspond à « {{ q }} ».</p>

        <div class="mt-8 flex flex-col items-start gap-5 rounded-[28px] bg-paper-2/70 p-8 md:flex-row md:items-center md:justify-between">
          <p class="font-display text-[1.6rem] leading-snug">Vous avez lu le livre ? Dites-nous ce qu’il a changé.</p>
          <UiButton to="/retours" :icon-left="PenLine" class="shrink-0">Donner mon retour</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
