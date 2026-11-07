<script setup lang="ts">
import { Clock } from '@lucide/vue'
import { readingMinutes, type Excerpt } from '~/data/book'

/* Un texte du livre, mis en page comme une page imprimée : rien n’est résumé ni modifié. */
const props = withDefaults(defineProps<{ text: Excerpt, heading?: 'h1' | 'h2', label?: string }>(), { heading: 'h2' })
const minutes = computed(() => readingMinutes(props.text))
const firstP = computed(() => props.text.blocks.findIndex(b => b.k === 'p'))
</script>

<template>
  <article class="relative rounded-[8px] border border-line bg-[#fffdf8] px-6 py-12 shadow-lift sm:px-12 md:px-20 md:py-20">
    <header class="text-center">
      <p v-if="label" class="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">{{ label }}</p>
      <component :is="heading" class="font-display leading-[1.05]" :class="[label && 'mt-3', heading === 'h1' ? 'text-display-md' : 'text-display-sm']">{{ text.title }}</component>
      <p v-if="text.subtitle" class="mt-3 font-display text-[1.6rem] italic text-caramel">{{ text.subtitle }}</p>
      <span class="rule-gold mx-auto mt-6" aria-hidden="true" />
      <p class="mt-5 inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted"><Clock class="h-3.5 w-3.5" aria-hidden="true" />{{ minutes }} min de lecture</p>
    </header>

    <p v-if="text.formula" class="formula mt-10 text-center text-[clamp(3rem,9vw,4.5rem)] leading-none text-ink" aria-label="Alpha plus bêta égale oméga">Α <span class="text-gold">+</span> <em class="text-caramel">β</em> <span class="text-gold">=</span> Ω</p>

    <div class="prose-book mx-auto mt-10 max-w-[38rem] text-pretty">
      <template v-for="(b, i) in text.blocks" :key="i">
        <h3 v-if="b.k === 'h'" class="!mt-14 mb-5 flex items-center gap-4 font-display text-[1.65rem] leading-tight text-ink">
          <span class="h-px w-8 shrink-0 bg-gold" aria-hidden="true" />{{ b.t }}
        </h3>
        <p v-else-if="b.k === 'end'" class="!mt-10 italic text-ink">{{ b.t }}</p>
        <p v-else-if="b.k === 'sign'" class="!mt-3 text-right font-display text-[1.5rem] tracking-[0.04em] text-ink">{{ b.t }}</p>
        <p
          v-else
          :class="i === firstP && 'first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.8rem] first-letter:leading-[0.78] first-letter:text-caramel'"
        >
          {{ b.t }}
        </p>
      </template>
    </div>

    <p class="mt-14 text-center font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">Une Formule …</p>
  </article>
</template>
