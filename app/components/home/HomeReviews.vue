<script setup lang="ts">
import { PenLine, ArrowUpRight } from '@lucide/vue'
import type { PublicReview } from '#shared/types'

const { data } = await useFetch<{ reviews: PublicReview[], count: number }>('/api/reviews', { query: { limit: 6 }, key: 'home-reviews' })
const reviews = computed(() => data.value?.reviews ?? [])
</script>

<template>
  <section class="relative overflow-hidden py-24 md:py-36" aria-labelledby="avis-title">
    <div class="container">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p v-reveal class="label-gold">Retours des lecteurs</p>
          <UiSplitReveal id="avis-title" class="mt-5 font-display text-display-md">Ce que les lecteurs en <em class="text-caramel">font</em>.</UiSplitReveal>
          <p v-reveal class="mt-5 font-serif text-lg leading-relaxed text-ink-soft">Chaque retour est lu par l’auteur avant toute publication. Il nourrit la prochaine édition.</p>
        </div>
      </div>
    </div>

    <div v-if="reviews.length" class="container mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <BookReviewCard v-for="r in reviews" :key="r.id" :review="r" />
    </div>
    <div v-else class="container mt-14">
      <div v-reveal class="relative overflow-hidden rounded-[32px] border border-dashed border-line-strong bg-white/50 px-8 py-14 text-center">
        <p class="formula text-6xl text-caramel/70" aria-hidden="true">“ ”</p>
        <p class="mx-auto mt-4 max-w-xl font-display text-[1.9rem] leading-snug">Les premiers retours de lecteurs apparaîtront ici.</p>
        <p class="mx-auto mt-3 max-w-lg font-serif text-lg text-ink-soft">Vous avez lu un levier, pratiqué un exercice ? Soyez parmi les premiers à partager ce que vous en retenez.</p>
      </div>
    </div>

    <div class="container mt-12 flex flex-wrap items-center justify-center gap-3">
      <UiButton to="/retours" :icon-left="PenLine">Donner mon retour</UiButton>
      <UiButton v-if="(data?.count ?? 0) > reviews.length" to="/avis" variant="outline" :icon="ArrowUpRight">Tous les avis</UiButton>
    </div>
  </section>
</template>
