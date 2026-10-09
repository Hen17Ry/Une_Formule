<script setup lang="ts">
import { PenLine, ArrowUpRight, Star } from '@lucide/vue'
import type { PublicReview } from '#shared/types'

const { data } = await useFetch<{ reviews: PublicReview[], count: number, average: number | null }>('/api/reviews', { query: { limit: 24 }, key: 'home-reviews' })
const reviews = computed(() => data.value?.reviews ?? [])
const half = computed(() => Math.ceil(reviews.value.length / 2))
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
        <div v-if="data?.count" v-reveal class="flex items-center gap-5 rounded-[24px] border border-line bg-white/60 px-6 py-4">
          <p class="font-display text-5xl leading-none text-ink"><UiNumberTicker :value="data.average ?? 0" :decimals="1" /></p>
          <div>
            <div class="flex gap-0.5" aria-hidden="true"><Star v-for="n in 5" :key="n" class="h-4 w-4 fill-gold text-gold-deep" :stroke-width="1.4" /></div>
            <p class="mt-1 font-sans text-sm text-ink-muted">{{ data.count }} avis publié{{ data.count > 1 ? 's' : '' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="reviews.length >= 4" class="mt-14 space-y-5">
      <UiMarquee duration="70s"><BookReviewCard v-for="r in reviews.slice(0, half)" :key="r.id" :review="r" compact /></UiMarquee>
      <UiMarquee duration="80s" reverse><BookReviewCard v-for="r in reviews.slice(half)" :key="r.id" :review="r" compact /></UiMarquee>
    </div>
    <div v-else-if="reviews.length" class="container mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
      <UiButton v-if="data?.count" to="/avis" variant="outline" :icon="ArrowUpRight">Tous les avis</UiButton>
    </div>
  </section>
</template>
