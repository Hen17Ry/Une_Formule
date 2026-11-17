<script setup lang="ts">
import { BookOpen, ScrollText, UserRound, CircleHelp, PenLine } from '@lucide/vue'
import { NAV_LINKS, isNavActive } from '~/data/nav'

/*
 * Mobile : les cinq entrées du menu, toujours à portée de pouce, en bas de l’écran.
 * « Le livre » ouvre une petite feuille avec ses quatre rubriques.
 * La barre s’efface quand on descend dans la page, revient dès qu’on remonte,
 * et se retire pendant la saisie d’un formulaire (clavier ouvert).
 */
const route = useRoute()
const ICONS = [BookOpen, ScrollText, UserRound, CircleHelp, PenLine]
const items = NAV_LINKS.map((l, i) => ({ ...l, icon: ICONS[i]! }))
const book = items[0]!

const activeIndex = computed(() => items.findIndex(l => isNavActive(route.path, l)))
const sheet = ref(false)
const hidden = ref(false)
const typing = ref(false)

let lastY = 0
function onScroll() {
  const y = window.scrollY
  const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 160
  if (nearEnd || y < 200) hidden.value = false
  else if (y > lastY + 6 && !sheet.value) hidden.value = true
  else if (y < lastY - 6) hidden.value = false
  lastY = y
}
const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches('input:not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable="true"]')
function onFocusIn(e: FocusEvent) { if (isField(e.target)) typing.value = true }
function onFocusOut(e: FocusEvent) { if (isField(e.target)) typing.value = false }
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') sheet.value = false }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('focusin', onFocusIn)
  document.removeEventListener('focusout', onFocusOut)
  window.removeEventListener('keydown', onKey)
})
watch(() => route.fullPath, () => { sheet.value = false; hidden.value = false })
</script>

<template>
  <div class="lg:hidden">
    <!-- Voile : un toucher en dehors referme la feuille -->
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0">
      <div v-if="sheet" class="fixed inset-0 z-[49] bg-ink/10 backdrop-blur-[2px]" aria-hidden="true" @click="sheet = false" />
    </Transition>

    <div
      class="tabbar fixed inset-x-0 bottom-0 z-50 px-3 transition-transform duration-500 ease-expo motion-reduce:transition-none"
      :class="(hidden || typing) && !sheet ? 'translate-y-[140%]' : 'translate-y-0'"
    >
      <!-- Feuille « Le livre » -->
      <Transition enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 translate-y-4 scale-[.98]" leave-active-class="transition duration-200" leave-to-class="opacity-0 translate-y-2">
        <div v-if="sheet" id="tabbar-le-livre" class="mx-auto mb-2 max-w-[26rem] origin-bottom rounded-[24px] border border-line bg-paper/95 p-2 shadow-lift backdrop-blur-xl">
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

      <!-- Barre d’onglets -->
      <nav aria-label="Navigation" class="relative mx-auto max-w-[26rem] rounded-[24px] border border-line/80 bg-paper/85 p-1.5 shadow-[0_18px_40px_-18px_rgba(74,44,22,.45)] backdrop-blur-xl">
        <span
          v-if="activeIndex >= 0"
          aria-hidden="true"
          class="absolute bottom-1.5 left-1.5 top-1.5 w-[calc((100%-0.75rem)/5)] rounded-[18px] bg-paper-2 transition-transform duration-500 ease-expo motion-reduce:transition-none"
          :style="{ transform: `translateX(${activeIndex * 100}%)` }"
        />
        <ul class="relative grid grid-cols-5">
          <li v-for="(l, i) in items" :key="l.to">
            <button
              v-if="l.children"
              type="button"
              class="tab"
              :class="activeIndex === i || sheet ? 'text-copper' : 'text-ink-soft'"
              :aria-expanded="sheet"
              aria-controls="tabbar-le-livre"
              @click="sheet = !sheet"
            >
              <component :is="l.icon" class="h-[1.3rem] w-[1.3rem]" :stroke-width="1.6" aria-hidden="true" />
              <span>{{ l.label }}</span>
            </button>
            <NuxtLink
              v-else
              :to="l.to"
              class="tab"
              :class="activeIndex === i ? 'text-copper' : 'text-ink-soft'"
              :aria-current="activeIndex === i ? 'page' : undefined"
            >
              <span v-if="l.to === '/retours'" class="-my-1 grid h-8 w-8 place-items-center rounded-full text-[#FFFDF9] shadow-[0_6px_14px_-6px_rgba(113,67,36,.9)] [background:var(--cover-gradient)]">
                <component :is="l.icon" class="h-4 w-4" :stroke-width="1.8" aria-hidden="true" />
              </span>
              <component :is="l.icon" v-else class="h-[1.3rem] w-[1.3rem]" :stroke-width="1.6" aria-hidden="true" />
              <span>{{ l.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.tabbar { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 10px); }
.tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  width: 100%; min-height: 54px; border-radius: 18px;
  font-family: 'Jost Variable', system-ui, sans-serif; font-size: 0.66rem; letter-spacing: .02em; white-space: nowrap;
  transition: color .3s ease;
  -webkit-tap-highlight-color: transparent;
}
.tab:focus-visible { outline: 2px solid var(--color-caramel, #A36B43); outline-offset: -2px; }
</style>
