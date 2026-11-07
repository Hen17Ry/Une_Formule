<script setup lang="ts">
import { AUTHOR } from '~/data/book'
</script>

<template>
  <section class="relative overflow-hidden bg-paper-2/70 py-24 md:py-36" aria-labelledby="auteur-title">
    <div class="container grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
      <BookAuthorPhoto v-reveal="'scale'" />
      <div>
        <p v-reveal class="label-gold">À propos de l’auteur</p>
        <UiSplitReveal id="auteur-title" class="mt-5 font-display text-display-md">{{ AUTHOR.name }}</UiSplitReveal>
        <BookAuthorBio v-reveal class="mt-8 max-w-2xl font-serif text-[1.15rem] leading-relaxed text-ink-soft md:text-[1.2rem]" />
      </div>
    </div>
  </section>
</template>
