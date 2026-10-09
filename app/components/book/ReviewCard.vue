<script setup lang="ts">
import { Star } from '@lucide/vue'
import type { PublicReview } from '#shared/types'
import { leverByNumber } from '~/data/book'

const props = defineProps<{ review: PublicReview, compact?: boolean }>()
const lever = computed(() => props.review.lever ? leverByNumber(props.review.lever) : null)
const date = computed(() => new Date(props.review.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }))
</script>

<template>
  <figure class="flex h-full flex-col rounded-[26px] border border-line bg-white/75 p-7 shadow-soft" :class="compact ? 'w-[22rem] md:w-[26rem]' : ''">
    <div class="flex items-center justify-between gap-4">
      <div class="flex gap-0.5" :aria-label="`${review.rating} sur 5`" role="img">
        <Star v-for="n in 5" :key="n" class="h-4 w-4" :class="n <= review.rating ? 'fill-gold text-gold-deep' : 'text-ink/20'" :stroke-width="1.4" aria-hidden="true" />
      </div>
      <span class="inline-flex min-w-0 items-center gap-2 rounded-full bg-paper-2 px-3 py-1 font-sans text-[0.72rem] text-ink-soft" :title="lever ? `Levier ${lever.n} · ${lever.short}` : undefined">
        <span v-if="lever" class="h-2 w-2 shrink-0 rounded-full" :style="{ background: lever.color }" aria-hidden="true" />
        <span class="truncate">{{ lever ? `Levier ${lever.n} · ${lever.short}` : 'Le livre' }}</span>
      </span>
    </div>
    <blockquote class="mt-5 flex-1 font-serif text-[1.12rem] leading-relaxed text-ink" :class="compact && 'line-clamp-6'">
      « {{ review.quote }} »
    </blockquote>
    <figcaption class="mt-6 flex items-center gap-3 border-t border-line pt-5">
      <span class="grid h-10 w-10 place-items-center rounded-full font-display text-lg text-[#FFFDF9] [background:var(--cover-soft)]" aria-hidden="true">{{ review.author.charAt(0) }}</span>
      <span>
        <span class="block font-sans text-[0.95rem] font-medium text-ink">{{ review.author }}</span>
        <span class="block font-sans text-xs capitalize text-ink-muted">{{ date }}</span>
      </span>
    </figcaption>
  </figure>
</template>
