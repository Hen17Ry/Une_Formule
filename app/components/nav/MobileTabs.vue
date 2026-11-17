<script setup lang="ts">
import { BookOpen, ScrollText, UserRound, CircleHelp, PenLine } from '@lucide/vue'
import { NAV_LINKS, isNavActive } from '~/data/nav'

/*
 * Mobile et tablette : les cinq entrées du menu, toujours visibles dans la barre du haut.
 * « Le livre » ouvre une feuille avec ses quatre rubriques, juste sous la barre.
 */
const open = defineModel<boolean>('open', { default: false })
const route = useRoute()
const ICONS = [BookOpen, ScrollText, UserRound, CircleHelp, PenLine]
const items = NAV_LINKS.map((l, i) => ({ ...l, icon: ICONS[i]! }))
const book = items[0]!
const activeIndex = computed(() => items.findIndex(l => isNavActive(route.path, l)))

watch(() => route.fullPath, () => { open.value = false })
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') open.value = false }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="relative min-w-0 flex-1">
    <span
      v-if="activeIndex >= 0"
      aria-hidden="true"
      class="absolute inset-y-0 left-0 w-1/5 rounded-[16px] bg-paper-2 transition-transform duration-500 ease-expo motion-reduce:transition-none"
      :style="{ transform: `translateX(${activeIndex * 100}%)` }"
    />
    <ul class="relative grid grid-cols-5">
      <li v-for="(l, i) in items" :key="l.to">
        <button
          v-if="l.children"
          type="button"
          class="tab"
          :class="activeIndex === i || open ? 'text-copper' : 'text-ink-soft'"
          :aria-expanded="open"
          aria-controls="menu-mobile-le-livre"
          :aria-label="l.label"
          @click="open = !open"
        >
          <component :is="l.icon" class="h-[1.15rem] w-[1.15rem]" :stroke-width="1.6" aria-hidden="true" />
          <span class="tab-label">{{ l.label }}</span>
        </button>
        <NuxtLink
          v-else
          :to="l.to"
          class="tab"
          :class="activeIndex === i ? 'text-copper' : 'text-ink-soft'"
          :aria-current="activeIndex === i ? 'page' : undefined"
          :aria-label="l.label"
        >
          <span v-if="l.to === '/retours'" class="-my-0.5 grid h-[1.65rem] w-[1.65rem] place-items-center rounded-full text-[#FFFDF9] shadow-[0_6px_14px_-6px_rgba(113,67,36,.9)] [background:var(--cover-gradient)]">
            <component :is="l.icon" class="h-3.5 w-3.5" :stroke-width="1.9" aria-hidden="true" />
          </span>
          <component :is="l.icon" v-else class="h-[1.15rem] w-[1.15rem]" :stroke-width="1.6" aria-hidden="true" />
          <span class="tab-label">{{ l.label }}</span>
        </NuxtLink>
      </li>
    </ul>

    <!-- Feuille « Le livre » (hors de l’en-tête, qui est animé) -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0">
        <div v-if="open" class="fixed inset-0 z-[49] bg-ink/10 backdrop-blur-[2px] lg:hidden" aria-hidden="true" @click="open = false" />
      </Transition>
      <Transition enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 -translate-y-3 scale-[.98]" leave-active-class="transition duration-200" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="open" id="menu-mobile-le-livre" class="fixed inset-x-3 top-[80px] z-[51] mx-auto max-w-md origin-top rounded-[24px] border border-line bg-paper/95 p-2 shadow-lift backdrop-blur-xl md:inset-x-5 lg:hidden">
          <p class="px-3 pb-1 pt-2 font-sans text-[0.68rem] uppercase tracking-[0.24em] text-ink-muted">Le livre</p>
          <NuxtLink
            v-for="c in book.children"
            :key="c.to"
            :to="c.to"
            class="flex items-center justify-between gap-3 rounded-[18px] px-3 py-3 transition-colors active:bg-paper-2"
            :class="route.path === c.to && 'bg-paper-2'"
          >
            <span>
              <span class="block font-display text-[1.25rem] leading-tight text-ink">{{ c.label }}</span>
              <span class="mt-0.5 block font-sans text-[0.78rem] text-ink-muted">{{ c.hint }}</span>
            </span>
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="route.path === c.to ? 'bg-caramel' : 'bg-transparent'" aria-hidden="true" />
          </NuxtLink>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  width: 100%; min-height: 48px; border-radius: 16px;
  font-family: 'Jost Variable', system-ui, sans-serif; letter-spacing: .01em; white-space: nowrap;
  transition: color .3s ease;
  -webkit-tap-highlight-color: transparent;
}
.tab-label { font-size: 0.62rem; line-height: 1; }
.tab:focus-visible { outline: 2px solid #A36B43; outline-offset: -2px; }
/* Très petits écrans : icônes seules (le nom reste lu par les lecteurs d’écran). */
@media (max-width: 359px) { .tab-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); } }
@media (min-width: 768px) { .tab-label { font-size: 0.7rem; } }
</style>
