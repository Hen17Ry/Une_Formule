<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'

const { data: shop } = await useShop()
const links = computed(() => (shop.value?.platformLinks ?? []).filter(l => l.label && l.url))
</script>

<template>
  <section id="ou-trouver" class="relative overflow-hidden py-24 md:py-32" aria-labelledby="ou-trouver-title">
    <div aria-hidden="true" class="absolute inset-x-4 inset-y-6 rounded-[48px] bg-[radial-gradient(90%_70%_at_30%_40%,#f6e8d8_0%,#f3e6d6_45%,#efe1cf_100%)] md:inset-x-8" />
    <div class="container relative grid items-center gap-12 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div v-reveal="'scale'" class="flex justify-center py-4">
        <BrandBook :width="280" :rotate="-24" class="max-sm:scale-[.8]" />
      </div>
      <div class="max-lg:text-center">
        <p v-reveal class="label-gold">Le livre</p>
        <UiSplitReveal id="ou-trouver-title" class="mt-5 font-display text-display-md">Où trouver <em class="text-caramel">le livre</em>.</UiSplitReveal>

        <p v-if="!links.length" v-reveal class="mt-5 max-w-lg font-serif text-lg leading-relaxed text-ink-soft max-lg:mx-auto">
          Bientôt disponible. Les liens vers les plateformes de vente seront publiés ici dès la sortie.
        </p>
        <template v-else>
          <p v-reveal class="mt-5 max-w-lg font-serif text-lg leading-relaxed text-ink-soft max-lg:mx-auto">Choisissez votre plateforme.</p>
          <ul v-reveal.stagger class="mt-8 flex flex-wrap gap-3 max-lg:justify-center">
            <li v-for="l in links" :key="l.url">
              <UiButton :href="l.url" target="_blank" rel="noopener" size="lg" :icon="ArrowUpRight" :magnetic="false">{{ l.label }}</UiButton>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </section>
</template>
