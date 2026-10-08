<script setup lang="ts">
import { PenLine, Star } from '@lucide/vue'
import type { PublicReview } from '#shared/types'
import { LEVERS } from '~/data/book'

useSeo({ title: 'Avis des lecteurs', description: 'Les retours des lecteurs du livre Une Formule, relus et publiés avec leur accord.' })

const filter = ref<'all' | 'general' | number>('all')
const { data } = await useFetch<{ reviews: PublicReview[], count: number, average: number | null }>('/api/reviews', { key: 'all-reviews' })
const list = computed(() => {
  const all = data.value?.reviews ?? []
  if (filter.value === 'all') return all
  if (filter.value === 'general') return all.filter(r => r.kind === 'GENERAL')
  return all.filter(r => r.lever === filter.value)
})
const countFor = (f: 'general' | number) => (data.value?.reviews ?? []).filter(r => f === 'general' ? r.kind === 'GENERAL' : r.lever === f).length
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <BrandRings class="pointer-events-none absolute -right-56 -top-40 h-[48rem] w-[48rem] opacity-40" />
    <div class="container relative">
      <header class="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p v-reveal class="label-gold">Ils ont lu Une Formule</p>
          <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">Avis des <em class="text-caramel">lecteurs</em>.</UiSplitReveal>
          <p v-reveal class="mt-6 max-w-xl font-serif text-[1.2rem] leading-relaxed text-ink-soft">Relus par l’auteur, publiés avec l’accord des lecteurs.</p>
        </div>
        <div v-if="data?.count" v-reveal class="flex items-center gap-5 rounded-[24px] border border-line bg-white/70 px-6 py-5">
          <p class="font-display text-6xl leading-none"><UiNumberTicker :value="data.average ?? 0" :decimals="1" /></p>
          <div>
            <div class="flex gap-0.5" aria-hidden="true"><Star v-for="n in 5" :key="n" class="h-4 w-4 fill-gold text-gold-deep" :stroke-width="1.4" /></div>
            <p class="mt-1 font-sans text-sm text-ink-muted">sur {{ data.count }} avis</p>
          </div>
        </div>
      </header>

      <div v-if="data?.count" class="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filtrer les avis">
        <button type="button" class="min-h-[44px] rounded-full border px-5 font-sans text-sm transition-colors" :class="filter === 'all' ? 'border-copper bg-copper text-[#FFFDF9]' : 'border-line bg-white/60 text-ink-soft hover:border-caramel'" :aria-pressed="filter === 'all'" @click="filter = 'all'">Tous · {{ data.count }}</button>
        <button type="button" class="min-h-[44px] rounded-full border px-5 font-sans text-sm transition-colors" :class="filter === 'general' ? 'border-copper bg-copper text-[#FFFDF9]' : 'border-line bg-white/60 text-ink-soft hover:border-caramel'" :aria-pressed="filter === 'general'" @click="filter = 'general'">Le livre · {{ countFor('general') }}</button>
        <button
          v-for="l in LEVERS"
          :key="l.n"
          type="button"
          class="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors"
          :class="filter === l.n ? 'border-copper bg-copper text-[#FFFDF9]' : 'border-line bg-white/60 text-ink-soft hover:border-caramel'"
          :aria-pressed="filter === l.n"
          :title="l.short"
          @click="filter = l.n"
        >
          <span class="h-2 w-2 rounded-full" :style="{ background: l.color }" aria-hidden="true" />L{{ l.n }} · {{ countFor(l.n) }}
        </button>
      </div>

      <TransitionGroup v-if="list.length" tag="div" class="mt-10 columns-1 gap-5 md:columns-2 xl:columns-3" move-class="transition duration-500" enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 translate-y-4" leave-active-class="hidden">
        <div v-for="r in list" :key="r.id" class="mb-5 break-inside-avoid"><BookReviewCard :review="r" /></div>
      </TransitionGroup>
      <div v-else class="mt-14 rounded-[32px] border border-dashed border-line-strong bg-white/50 px-8 py-16 text-center">
        <p class="font-display text-[1.9rem]">{{ data?.count ? 'Aucun avis pour ce filtre pour l’instant.' : 'Les premiers avis arrivent bientôt.' }}</p>
        <p class="mx-auto mt-3 max-w-md font-serif text-lg text-ink-soft">Vous avez lu le livre ? Votre retour peut être le premier.</p>
      </div>

      <div class="mt-16 flex justify-center">
        <UiButton to="/retours" size="lg" :icon-left="PenLine">Donner mon retour</UiButton>
      </div>
    </div>
  </div>
</template>
