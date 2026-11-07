<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { BOOK_SECTIONS, EXCERPTS } from '~/data/book'

const route = useRoute()
const section = BOOK_SECTIONS.find(s => s.slug === String(route.params.slug))
if (!section) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
const s = section!
const text = EXCERPTS.find(e => e.slug === s.excerpt)!
const i = BOOK_SECTIONS.indexOf(s)
const prev = BOOK_SECTIONS[i - 1]
const next = BOOK_SECTIONS[i + 1]

useSeo({ title: s.title, description: s.lead, type: 'article' })
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <BrandRings class="pointer-events-none absolute -right-56 -top-32 h-[46rem] w-[46rem] opacity-40" />
    <div class="container relative">
      <header class="mx-auto max-w-3xl text-center">
        <p v-reveal class="label-gold">Le livre</p>
        <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">{{ s.title }}</UiSplitReveal>
        <p v-reveal class="mx-auto mt-6 max-w-xl font-serif text-[1.2rem] leading-relaxed text-ink-soft">{{ s.lead }}</p>
      </header>

      <article class="relative mx-auto mt-14 max-w-3xl rounded-[8px] border border-line bg-[#fffdf8] px-7 py-14 shadow-lift sm:px-12 md:px-20 md:py-20">
        <p v-if="text.formula" class="formula text-center text-6xl text-ink" aria-label="Alpha plus bêta égale oméga">Α <span class="text-gold">+</span> <em class="text-caramel">β</em> <span class="text-gold">=</span> Ω</p>
        <div class="prose-book" :class="text.formula && 'mt-10'">
          <p v-for="(p, k) in text.paragraphs" :key="k" :class="k === 0 && 'first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.8rem] first-letter:leading-[0.78] first-letter:text-caramel'">{{ p }}</p>
        </div>
        <p v-if="text.note" class="mt-10 border-t border-line pt-6 text-center font-sans text-sm italic text-ink-muted">{{ text.note }}</p>
        <p class="mt-12 text-center font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">Une Formule …</p>
      </article>

      <nav class="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2" aria-label="Rubriques du livre">
        <NuxtLink v-if="prev" :to="`/le-livre/${prev.slug}`" class="group rounded-[24px] border border-line p-6 transition-colors hover:border-caramel">
          <span class="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted"><ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Précédent</span>
          <span class="mt-2 block font-display text-2xl">{{ prev.label }}</span>
        </NuxtLink>
        <NuxtLink v-else to="/les-7-leviers" class="group rounded-[24px] border border-line p-6 transition-colors hover:border-caramel">
          <span class="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted"><ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Le livre</span>
          <span class="mt-2 block font-display text-2xl">Les 7 leviers</span>
        </NuxtLink>
        <NuxtLink v-if="next" :to="`/le-livre/${next.slug}`" class="group rounded-[24px] border border-line p-6 text-right transition-colors hover:border-caramel">
          <span class="flex items-center justify-end gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted">Suivant <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
          <span class="mt-2 block font-display text-2xl">{{ next.label }}</span>
        </NuxtLink>
        <NuxtLink v-else to="/les-7-leviers" class="group rounded-[24px] border border-line p-6 text-right transition-colors hover:border-caramel">
          <span class="flex items-center justify-end gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted">Suivant <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
          <span class="mt-2 block font-display text-2xl">Les 7 leviers</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
