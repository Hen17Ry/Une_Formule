<script setup lang="ts">
/* Livre en CSS 3D (couverture réelle) — utilisé hors du hero, et en repli du modèle WebGL. */
const props = withDefaults(defineProps<{ width?: number, interactive?: boolean, rotate?: number }>(), { width: 280, interactive: true, rotate: -22 })
const el = ref<HTMLElement>()
const tilt = reactive({ x: 0, y: 0 })

function move(e: PointerEvent) {
  if (!props.interactive || e.pointerType !== 'mouse' || prefersReducedMotion()) return
  const r = el.value!.getBoundingClientRect()
  tilt.y = ((e.clientX - r.left) / r.width - 0.5) * 22
  tilt.x = -((e.clientY - r.top) / r.height - 0.5) * 14
}
function leave() { tilt.x = 0; tilt.y = 0 }
const height = computed(() => Math.round(props.width * 1.5))
const depth = computed(() => Math.round(props.width * 0.12))
</script>

<template>
  <div ref="el" class="relative [perspective:1600px]" :style="{ width: `${width}px`, height: `${height}px` }" @pointermove="move" @pointerleave="leave">
    <div
      class="relative h-full w-full transition-transform duration-[900ms] ease-expo [transform-style:preserve-3d]"
      :style="{ transform: `rotateY(${rotate + tilt.y}deg) rotateX(${tilt.x}deg)` }"
    >
      <!-- tranche des pages -->
      <div
        class="absolute top-[1.5%] right-0 h-[97%] origin-right [background:repeating-linear-gradient(90deg,#f4ecdf_0_2px,#e3d5c1_2px_3px)]"
        :style="{ width: `${depth}px`, transform: `translateX(${depth / 2}px) rotateY(90deg) translateX(${depth / 2}px)` }"
      />
      <!-- dos -->
      <div class="absolute inset-0 rounded-[3px] bg-umber" :style="{ transform: `translateZ(-${depth}px)` }" />
      <!-- reliure -->
      <div
        class="absolute left-0 top-0 h-full origin-left [background:linear-gradient(90deg,#6a3e21,#8a5530_40%,#714324)]"
        :style="{ width: `${depth}px`, transform: `rotateY(-90deg)` }"
      />
      <!-- couverture -->
      <div class="absolute inset-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] shadow-book">
        <img src="/images/couverture.webp" alt="Couverture du livre Une Formule… 7 leviers pour construire la vie que vous désirez, de Dieudonné Sossa Gossou" class="h-full w-full object-cover" :width="width" :height="height" loading="lazy" decoding="async">
        <div class="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/25 via-white/10 to-transparent" />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/15" />
      </div>
    </div>
    <div aria-hidden="true" class="absolute -bottom-8 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-[50%] bg-umber/25 blur-xl" />
  </div>
</template>
