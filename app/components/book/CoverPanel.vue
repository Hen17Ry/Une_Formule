<script setup lang="ts">
import { Maximize2 } from '@lucide/vue'
import { COVERS, type CoverSide } from '~/data/book'

/* Une face de la couverture, présentée comme une page : visuel en grand, agrandissable ; texte de la quatrième en clair. */
const props = defineProps<{ side: CoverSide }>()
const cover = computed(() => COVERS[props.side])
const zoom = ref<CoverSide | null>(null)
const tilt = reactive({ x: 0, y: 0 })
function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tilt.y = ((e.clientX - r.left) / r.width - 0.5) * 12
  tilt.x = -((e.clientY - r.top) / r.height - 0.5) * 8
}
function onLeave() { tilt.x = 0; tilt.y = 0 }
</script>

<template>
  <article class="relative rounded-[8px] border border-line bg-[#fffdf8] px-6 py-12 shadow-lift sm:px-12 md:px-20 md:py-20">
    <header class="text-center">
      <p class="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">Couverture</p>
      <h2 class="mt-3 font-display text-display-sm leading-[1.05]">{{ cover.title }}</h2>
      <span class="rule-gold mx-auto mt-6" aria-hidden="true" />
    </header>

    <div class="mt-10 flex justify-center [perspective:1400px]" @pointermove="onMove" @pointerleave="onLeave">
      <button
        type="button"
        class="group relative block w-full max-w-[22rem] transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        :style="{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }"
        :aria-label="`Agrandir la ${cover.title.toLowerCase()}`"
        @click="zoom = side"
      >
        <img
          :src="cover.src"
          :srcset="`${cover.sm} 520w, ${cover.src} 1000w`"
          sizes="(min-width: 640px) 352px, 80vw"
          :alt="cover.alt"
          width="1000"
          height="1419"
          class="block w-full rounded-[3px] shadow-book"
          :class="side === 'back' && 'ring-1 ring-line'"
        >
        <span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-[3px] bg-[linear-gradient(115deg,rgba(255,255,255,.2),rgba(255,255,255,0)_40%)]" />
        <span class="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 font-sans text-xs text-ink shadow-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
          <Maximize2 class="h-3.5 w-3.5" aria-hidden="true" /> Agrandir
        </span>
      </button>
    </div>

    <BookBackCoverText v-if="side === 'back'" with-author class="mx-auto mt-14 max-w-[38rem] font-serif text-[1.08rem] leading-[1.7] text-ink-soft" />

    <p class="mt-14 text-center font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">Une Formule …</p>
    <BookCoverZoom v-model="zoom" />
  </article>
</template>
