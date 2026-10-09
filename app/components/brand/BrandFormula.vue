<script setup lang="ts">
/* Α + β = Ω, comme sur la couverture. */
withDefaults(defineProps<{ size?: string, animate?: boolean }>(), { size: 'text-5xl' })
</script>

<template>
  <span class="formula inline-flex items-baseline gap-[0.32em] whitespace-nowrap" :class="size" role="img" aria-label="Alpha plus bêta égale oméga">
    <span aria-hidden="true">Α</span>
    <span aria-hidden="true" class="text-gold-deep">+</span>
    <span aria-hidden="true" class="italic">β</span>
    <span aria-hidden="true" class="text-gold-deep">=</span>
    <span aria-hidden="true">Ω</span>
  </span>
</template>
