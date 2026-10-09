<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { LEVERS } from '~/data/book'
useSeo({ title: 'Les 7 leviers', description: 'Escalader le temps, tourner son cerveau dans le sens du succès, la loi de l’attraction… Les sept leviers du livre Une Formule.' })
const hovered = ref<number | null>(null)
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <BrandRings class="pointer-events-none absolute -right-56 -top-40 h-[48rem] w-[48rem] opacity-40" />
    <div class="container relative">
      <header class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p v-reveal class="label-gold">β, en sept facettes</p>
          <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">Les 7 <em class="text-caramel">leviers</em>.</UiSplitReveal>
        </div>
        <p v-reveal class="font-serif text-[1.2rem] leading-relaxed text-ink-soft">
          Le premier levier pose un geste central : se relier au Moi futur gagnant. Les six suivants ne le remplacent jamais : chacun revient, à sa manière, protéger, nourrir ou faire circuler la sensation qu’il installe.
        </p>
      </header>

      <ol class="mt-16 border-t border-line" @pointerleave="hovered = null">
        <li v-for="l in LEVERS" :key="l.n" v-reveal class="border-b border-line" @pointerenter="hovered = l.n">
          <NuxtLink :to="`/les-7-leviers/${l.slug}`" class="group grid items-center gap-x-8 gap-y-3 py-8 transition-opacity duration-500 md:grid-cols-[5rem_1.2fr_1fr_auto] md:py-10" :class="hovered && hovered !== l.n ? 'md:opacity-40' : 'opacity-100'">
            <span class="font-display text-5xl leading-none md:text-6xl" :style="{ color: l.color }">{{ String(l.n).padStart(2, '0') }}</span>
            <span class="font-display text-[2rem] leading-tight text-ink transition-transform duration-700 ease-expo group-hover:translate-x-2 md:text-[2.6rem]">{{ l.short }}</span>
            <span class="font-serif text-[1.08rem] italic leading-relaxed text-ink-soft">{{ l.question }}</span>
            <span class="hidden h-12 w-12 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:border-transparent group-hover:text-[#FFFDF9] md:grid" :style="hovered === l.n ? { background: l.color } : {}">
              <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
            </span>
          </NuxtLink>
        </li>
      </ol>
    </div>
  </div>
</template>
