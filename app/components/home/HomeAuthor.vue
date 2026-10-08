<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { AUTHOR } from '~/data/book'
</script>

<template>
  <section class="relative overflow-hidden bg-paper-2/70 py-24 md:py-36" aria-labelledby="auteur-title">
    <div class="container grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
      <div v-reveal="'scale'" class="relative mx-auto aspect-square w-full max-w-[26rem]">
        <BrandRings class="absolute inset-[-14%] h-[128%] w-[128%] opacity-70" />
        <div class="absolute inset-[12%] grid place-items-center rounded-full text-[#FFFDF9] shadow-book [background:var(--cover-soft)]">
          <div class="text-center">
            <p class="font-display text-[clamp(3.5rem,8vw,5.5rem)] font-medium leading-none tracking-[0.06em]">D·S·G</p>
            <span class="mx-auto mt-4 block h-px w-14 bg-white/60" aria-hidden="true" />
            <p class="mt-4 font-sans text-[0.68rem] uppercase tracking-[0.32em] text-white/85">Mathématicien · Coach</p>
          </div>
        </div>
      </div>
      <div>
        <p v-reveal class="label-gold">À propos de l’auteur</p>
        <UiSplitReveal id="auteur-title" class="mt-5 font-display text-display-md">{{ AUTHOR.name }}</UiSplitReveal>
        <ul v-reveal.stagger class="mt-6 flex flex-wrap gap-2">
          <li v-for="r in AUTHOR.roles" :key="r" class="rounded-full border border-line bg-white/60 px-4 py-1.5 font-sans text-sm text-ink-soft">{{ r }}</li>
        </ul>
        <p v-reveal class="mt-8 max-w-2xl font-serif text-[1.2rem] leading-relaxed text-ink-soft">{{ AUTHOR.bio[2] }}</p>
        <dl v-reveal.stagger class="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-8">
          <div><dt class="label">Carrière</dt><dd class="mt-2 font-display text-4xl text-ink"><UiNumberTicker :value="1997" :grouping="false" />*</dd></div>
          <div><dt class="label">Terrain</dt><dd class="mt-2 font-display text-4xl text-ink">+<UiNumberTicker :value="20" /> ans</dd></div>
          <div><dt class="label">Exercices</dt><dd class="mt-2 font-display text-4xl text-ink"><UiNumberTicker :value="16" /></dd></div>
        </dl>
        <p class="mt-3 font-sans text-xs text-ink-muted">* début dans l’enseignement des mathématiques.</p>
        <div v-reveal class="mt-10">
          <UiButton to="/auteur" variant="outline" :icon="ArrowRight">Découvrir son parcours</UiButton>
        </div>
      </div>
    </div>
  </section>
</template>
