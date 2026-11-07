<script setup lang="ts">
import { X } from '@lucide/vue'
import { COVERS, type CoverSide } from '~/data/book'

/* Couverture en grand (première ou quatrième), avec bascule et fermeture au clavier. */
const side = defineModel<CoverSide | null>({ required: true })
const closeBtn = ref<HTMLButtonElement>()
const { $stopScroll, $startScroll } = useNuxtApp()
let lastFocus: HTMLElement | null = null

watch(side, (v, old) => {
  if (import.meta.server) return
  if (v && !old) {
    lastFocus = document.activeElement as HTMLElement
    ;($stopScroll as any)?.()
    nextTick(() => closeBtn.value?.focus())
  }
  if (!v && old) {
    ;($startScroll as any)?.()
    lastFocus?.focus()
  }
})
const close = () => { side.value = null }
function onKey(e: KeyboardEvent) {
  if (!side.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') side.value = side.value === 'front' ? 'back' : 'front'
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (side.value) ($startScroll as any)?.()
})
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0" leave-active-class="transition duration-300" leave-to-class="opacity-0">
      <div v-if="side" class="fixed inset-0 z-[80] flex flex-col bg-paper/95 backdrop-blur-xl" role="dialog" aria-modal="true" :aria-label="COVERS[side].title" data-lenis-prevent @click.self="close">
        <div class="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div class="flex rounded-full border border-line bg-white/80 p-1" role="group" aria-label="Face affichée">
            <button
              v-for="s in (['front', 'back'] as const)"
              :key="s"
              type="button"
              class="min-h-[40px] rounded-full px-4 font-sans text-[0.85rem] transition-colors"
              :class="side === s ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'"
              :aria-pressed="side === s"
              @click="side = s"
            >
              {{ COVERS[s].short }}
            </button>
          </div>
          <button ref="closeBtn" type="button" class="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/80 text-ink hover:border-caramel" aria-label="Fermer" @click="close"><X class="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div class="flex min-h-0 flex-1 items-center justify-center overflow-auto px-4 pb-8" @click.self="close">
          <Transition mode="out-in" enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 scale-[.97]" leave-active-class="transition duration-150" leave-to-class="opacity-0">
            <img :key="side" :src="COVERS[side].hd" :alt="COVERS[side].alt" class="max-h-full w-auto max-w-full rounded-[4px] object-contain shadow-book" width="1600" height="2270">
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
