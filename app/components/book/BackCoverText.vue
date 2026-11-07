<script setup lang="ts">
import { BACK_COVER } from '~/data/book'
/* Texte de la quatrième de couverture, tel qu’imprimé. */
defineProps<{ withAuthor?: boolean }>()
</script>

<template>
  <div>
    <p class="font-sans text-[1.15rem] font-semibold leading-snug text-copper">{{ BACK_COVER.heading }}</p>
    <p class="mt-4"><em>{{ BACK_COVER.intro }}</em> {{ BACK_COVER.text }}</p>
    <p class="mt-3">{{ BACK_COVER.key }}</p>
    <p class="formula my-3 text-center text-[1.9rem] leading-none text-ink" aria-label="Alpha plus bêta égale oméga">Α <span class="text-gold">+</span> <em class="text-caramel">β</em> <span class="text-gold">=</span> Ω</p>
    <ul class="space-y-1">
      <li v-for="t in BACK_COVER.terms" :key="t.sym" class="flex gap-2"><span class="text-caramel" aria-hidden="true">•</span><span><strong class="font-semibold text-ink">{{ t.sym }}</strong>{{ t.text }}</span></li>
    </ul>
    <p class="mt-4">{{ BACK_COVER.closing }} <em class="text-caramel">{{ BACK_COVER.quote }}</em></p>
    <p class="mt-4 border-b border-caramel/50 pb-4 text-center font-semibold text-copper">{{ BACK_COVER.call }}</p>
    <template v-if="withAuthor">
      <p class="mt-6 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-copper">L’auteur</p>
      <p class="mt-2">{{ BACK_COVER.author.split('Dieudonné GOSSOU')[0] }}<strong class="font-semibold text-ink">Dieudonné GOSSOU</strong>{{ BACK_COVER.author.split('Dieudonné GOSSOU')[1] }}</p>
    </template>
  </div>
</template>
