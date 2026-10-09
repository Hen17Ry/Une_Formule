<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { LEVERS } from '~/data/book'
useSeo({ title: 'Retours des lecteurs', description: 'Donnez votre retour sur l’un des sept leviers du livre Une Formule, ou sur le livre en général.' })
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <BrandRings class="pointer-events-none absolute -right-56 -top-40 h-[48rem] w-[48rem] opacity-40" />
    <div class="container relative">
      <header class="max-w-3xl">
        <p v-reveal class="label-gold">Retours des lecteurs</p>
        <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">Votre lecture <em class="text-caramel">compte</em>.</UiSplitReveal>
        <p v-reveal class="mt-6 max-w-2xl font-serif text-[1.25rem] leading-relaxed text-ink-soft">
          Choisissez le levier sur lequel vous souhaitez vous exprimer, ou donnez un retour sur le livre entier. Quelques minutes suffisent : seules la note et l’autorisation de citation sont requises.
        </p>
      </header>

      <div v-reveal.stagger class="mt-12 grid gap-3 min-[400px]:grid-cols-2 sm:mt-16 sm:gap-4 lg:grid-cols-4">
        <UiSpotlight
          v-for="l in LEVERS"
          :key="l.n"
          tag="article"
          class="group rounded-[28px] border border-line bg-white/70 shadow-soft transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
          :color="`${l.color}22`"
        >
          <NuxtLink :to="`/retours/${l.slug}`" class="flex h-full min-h-[11rem] flex-col p-5 sm:min-h-[15rem] sm:p-7">
            <div class="flex items-center justify-between">
              <span class="grid h-11 w-11 place-items-center rounded-full font-display text-xl text-[#FFFDF9]" :style="{ background: l.color }">{{ l.n }}</span>
              <ArrowUpRight class="h-5 w-5 text-ink-muted transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
            </div>
            <p class="mt-auto pt-6 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted sm:pt-8">Levier {{ l.n }}</p>
            <h2 class="mt-2 font-display text-[1.3rem] leading-tight sm:text-[1.65rem]">{{ l.short }}</h2>
          </NuxtLink>
        </UiSpotlight>
        <NuxtLink to="/retours/general" class="group relative flex min-h-[11rem] flex-col overflow-hidden rounded-[28px] p-5 text-[#FFFDF9] shadow-lift [background:var(--cover-soft)] sm:min-h-[15rem] sm:p-7">
          <BrandRings class="absolute -right-24 -top-24 h-80 w-80 opacity-60" :spin="false" />
          <ArrowUpRight class="relative ml-auto h-5 w-5 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          <p class="relative mt-auto font-sans text-xs uppercase tracking-[0.22em] text-white/85">Le livre en entier</p>
          <h2 class="relative mt-2 font-display text-[1.3rem] leading-tight text-[#FFFDF9] sm:text-[1.65rem]">Retour général</h2>
        </NuxtLink>
      </div>

      <div v-reveal class="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 md:flex-row md:items-center">
        <p class="max-w-xl font-serif text-lg text-ink-soft">Chaque retour est relu avant publication. Votre adresse email n’est jamais affichée.</p>
        <UiButton to="/avis" variant="outline" :icon="ArrowUpRight">Lire les avis publiés</UiButton>
      </div>
    </div>
  </div>
</template>
