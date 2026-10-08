<script setup lang="ts">
/* Cercles concentriques et fragments d’équations, repris du dessin de la couverture. */
withDefaults(defineProps<{ spin?: boolean, opacity?: number }>(), { spin: true, opacity: 1 })
</script>

<template>
  <svg viewBox="0 0 800 800" fill="none" aria-hidden="true" class="pointer-events-none select-none" :style="{ opacity }">
    <defs>
      <radialGradient id="ring-fade" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stop-color="#B08A45" stop-opacity=".55" />
        <stop offset="100%" stop-color="#B08A45" stop-opacity="0" />
      </radialGradient>
      <path id="ring-arc" d="M 400 400 m -300 0 a 300 300 0 1 1 600 0 a 300 300 0 1 1 -600 0" />
    </defs>
    <g :class="spin && 'origin-center animate-spin-slow motion-reduce:animate-none'" style="transform-box: fill-box">
      <circle cx="400" cy="400" r="120" stroke="url(#ring-fade)" stroke-width="1" />
      <circle cx="400" cy="400" r="190" stroke="url(#ring-fade)" stroke-width="1" />
      <circle cx="400" cy="400" r="260" stroke="url(#ring-fade)" stroke-width=".8" />
      <circle cx="400" cy="400" r="330" stroke="url(#ring-fade)" stroke-width=".7" stroke-dasharray="2 7" />
      <circle cx="400" cy="400" r="392" stroke="url(#ring-fade)" stroke-width=".6" />
      <text font-family="Cormorant Garamond Variable, serif" font-size="22" fill="#B08A45" fill-opacity=".4" letter-spacing="6">
        <textPath href="#ring-arc">Α + β = Ω · Σ · π · ∞ · Δ · Α + β = Ω · φ · λ · Ω = Α + β · θ · Α + β = Ω ·</textPath>
      </text>
    </g>
  </svg>
</template>
