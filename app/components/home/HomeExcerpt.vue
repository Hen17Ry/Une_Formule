<script setup lang="ts">
import { BookOpen } from '@lucide/vue'
import { EXCERPTS } from '~/data/book'
const avantPropos = EXCERPTS[2]!
</script>

<template>
  <section class="relative py-24 md:py-32" aria-labelledby="extrait-title">
    <div class="container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p v-reveal class="label-gold">Extrait · Avant-propos</p>
        <UiSplitReveal id="extrait-title" class="mt-5 font-display text-display-md">Sur trois cents candidats, <em class="text-caramel">sept</em> ont été admis.</UiSplitReveal>
        <p v-reveal class="mt-6 max-w-md font-serif text-lg leading-relaxed text-ink-soft">L’ouverture du livre, telle que l’auteur l’a écrite. Trois extraits sont à lire en ligne, le reste vous attend entre les pages.</p>
        <div v-reveal class="mt-9 flex flex-wrap gap-3">
          <UiButton to="/extraits" :icon-left="BookOpen">Lire les trois extraits</UiButton>
        </div>
      </div>

      <div v-reveal="'scale'" class="relative">
        <div aria-hidden="true" class="absolute inset-0 translate-x-4 translate-y-4 rotate-[2.5deg] rounded-[6px] border border-line bg-paper-3" />
        <div aria-hidden="true" class="absolute inset-0 translate-x-2 translate-y-2 rotate-[1deg] rounded-[6px] border border-line bg-paper-2" />
        <article class="relative rounded-[6px] border border-line bg-[#fffdf8] px-8 py-12 shadow-lift md:px-14 md:py-16">
          <p class="text-center font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">Présentation du livre</p>
          <h3 class="mt-3 text-center font-display text-3xl">Avant-propos</h3>
          <span class="rule-gold mx-auto mt-5" aria-hidden="true" />
          <div class="relative mt-8 max-h-[19rem] overflow-hidden [mask-image:linear-gradient(#000_55%,transparent)]">
            <p class="prose-book first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-caramel">{{ avantPropos.paragraphs[0] }}</p>
          </div>
          <p class="mt-4 text-center font-sans text-[0.7rem] uppercase tracking-[0.3em] text-ink-muted">Une Formule …</p>
        </article>
      </div>
    </div>
  </section>
</template>
