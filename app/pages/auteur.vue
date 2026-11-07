<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { AUTHOR, BOOK } from '~/data/book'

useSeo({ title: `À propos de l’auteur — ${AUTHOR.name}`, description: AUTHOR.bio.split('. ').slice(0, 2).join('. ') + '.', image: AUTHOR.photo })
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <div class="container relative">
      <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <header>
          <p v-reveal class="label-gold">À propos de l’auteur</p>
          <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">{{ AUTHOR.name }}</UiSplitReveal>
          <BookAuthorBio v-reveal class="prose-book mt-10 max-w-2xl" />
        </header>
        <div class="w-full max-lg:order-first max-lg:mx-auto max-lg:max-w-[17rem]">
          <BookAuthorPhoto v-reveal="'scale'" eager />
        </div>
      </div>

      <div v-reveal class="mt-28 rounded-[36px] border border-line bg-paper-2/70 px-8 py-14 text-center md:px-16">
        <p class="mx-auto max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] italic leading-tight text-ink">« {{ BOOK.maxim }} »</p>
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <UiButton to="/le-livre/avant-propos" variant="outline">Lire l’avant-propos</UiButton>
          <UiButton to="/#ou-trouver" :icon="ArrowRight">Où trouver le livre</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
