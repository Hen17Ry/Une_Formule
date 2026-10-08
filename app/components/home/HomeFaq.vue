<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { FAQ } from '~/data/book'
const items = [FAQ[0]!.items[0]!, FAQ[2]!.items[1]!, FAQ[2]!.items[0]!, FAQ[0]!.items[3]!, FAQ[2]!.items[2]!]
</script>

<template>
  <section class="relative py-24 md:py-32" aria-labelledby="faq-title">
    <div class="container grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p v-reveal class="label-gold">Questions / Réponses</p>
        <UiSplitReveal id="faq-title" class="mt-5 font-display text-display-md">Avant d’ouvrir le livre.</UiSplitReveal>
        <p v-reveal class="mt-5 max-w-sm font-serif text-lg leading-relaxed text-ink-soft">Ce qu’on demande le plus souvent à propos d’Une Formule.</p>
        <div v-reveal class="mt-8"><UiButton to="/faq" variant="outline" :icon="ArrowRight">Toutes les questions</UiButton></div>
      </div>
      <div v-reveal>
        <UiAccordion :items="items" :default-open="0" />
      </div>
    </div>
  </section>
</template>
