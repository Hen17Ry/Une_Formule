<script setup lang="ts">
import { ArrowRight, Check, ShieldCheck } from '@lucide/vue'
import { formatXof, xofToEur } from '~/data/book'

const { data: shop } = await useShop()
const preorder = computed(() => shop.value?.saleMode === 'PREORDER')
const includes = ['7 leviers, chacun appuyé sur des références scientifiques nommées', '16 exercices pratiques, pensés pour être faits', 'Une section Sources pour tout vérifier par soi-même']
</script>

<template>
  <section id="commander" class="relative overflow-hidden py-24 md:py-36" aria-labelledby="order-title">
    <div aria-hidden="true" class="absolute inset-x-4 inset-y-10 rounded-[48px] bg-[radial-gradient(90%_70%_at_30%_40%,#f6e8d8_0%,#f3e6d6_45%,#efe1cf_100%)] md:inset-x-8" />
    <BrandRings class="pointer-events-none absolute -left-40 top-1/2 h-[50rem] w-[50rem] -translate-y-1/2 opacity-50" />
    <div class="container relative grid items-center gap-16 py-10 lg:grid-cols-2">
      <div v-reveal="'scale'" class="flex justify-center py-6">
        <BrandBook :width="300" :rotate="-24" class="max-sm:scale-[.82]" />
      </div>
      <div>
        <span v-if="shop" class="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 font-sans text-[0.78rem] uppercase tracking-[0.2em] text-umber">
          <span class="h-2 w-2 animate-pulse rounded-full" :class="preorder ? 'bg-caramel' : 'bg-ok'" aria-hidden="true" />
          {{ preorder ? 'Précommande ouverte' : 'Disponible' }}
        </span>
        <UiSplitReveal id="order-title" class="mt-6 font-display text-display-md">Recevez votre exemplaire.</UiSplitReveal>
        <p v-reveal class="mt-4 max-w-lg font-serif text-lg leading-relaxed text-ink-soft">{{ preorder ? shop?.preorderNote : shop?.deliveryNote }}</p>

        <div v-if="shop" v-reveal class="mt-8 flex items-end gap-4">
          <p class="font-display text-[3.4rem] leading-none text-ink">{{ formatXof(shop.priceXof) }}</p>
          <p class="pb-1.5 font-sans text-sm text-ink-muted">
            <s v-if="shop.compareAtXof" class="mr-2">{{ formatXof(shop.compareAtXof) }}</s>≈ {{ xofToEur(shop.priceXof) }}
          </p>
        </div>

        <ul v-reveal.stagger class="mt-8 space-y-3">
          <li v-for="i in includes" :key="i" class="flex items-start gap-3 font-sans text-[0.98rem] text-ink-soft">
            <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-copper text-[#FFFDF9]"><Check class="h-3 w-3" :stroke-width="3" aria-hidden="true" /></span>
            {{ i }}
          </li>
        </ul>

        <div v-reveal class="mt-10 flex flex-wrap items-center gap-5">
          <UiButton to="/commander" size="lg" :icon="ArrowRight">{{ preorder ? 'Précommander' : 'Commander' }} le livre</UiButton>
          <p class="flex items-center gap-2 font-sans text-sm text-ink-muted"><ShieldCheck class="h-4 w-4 text-ok" aria-hidden="true" /> Mobile Money ou carte, via KkiaPay</p>
        </div>
      </div>
    </div>
  </section>
</template>
