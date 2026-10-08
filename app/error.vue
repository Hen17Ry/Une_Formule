<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ title: notFound.value ? 'Page introuvable — Une Formule' : 'Erreur — Une Formule' })
</script>

<template>
  <div class="relative grid min-h-dvh place-items-center overflow-hidden bg-paper px-6 text-center">
    <BrandRings class="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 opacity-50" />
    <div class="relative">
      <p class="formula text-[clamp(5rem,18vw,12rem)] leading-none text-caramel/80">{{ notFound ? 'Ω ≠ ?' : 'β…' }}</p>
      <h1 class="mt-6 font-display text-display-sm">{{ notFound ? 'Cette page n’existe pas (encore).' : 'Une erreur est survenue.' }}</h1>
      <p class="mx-auto mt-4 max-w-md font-serif text-lg text-ink-soft">{{ notFound ? 'Le chemin s’est perdu quelque part entre Α et Ω.' : error.statusMessage }}</p>
      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <UiButton @click="clearError({ redirect: '/' })">Retour à l’accueil</UiButton>
        <UiButton variant="outline" @click="clearError({ redirect: '/extraits' })">Lire un extrait</UiButton>
      </div>
    </div>
  </div>
</template>
