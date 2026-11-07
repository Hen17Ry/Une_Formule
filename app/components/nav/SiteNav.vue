<script setup lang="ts">
import { Menu, X, ChevronDown } from '@lucide/vue'
import { EXCERPTS } from '~/data/book'

const route = useRoute()
const scrolled = ref(false)
const hidden = ref(false)
const menuOpen = ref(false)
const { $stopScroll, $startScroll } = useNuxtApp()

interface NavChild { to: string, label: string, hint: string }
interface NavLink { to: string, label: string, also?: string[], children?: NavChild[] }

const HINTS: Record<string, string> = {
  'la-magie-du-titre': 'Formule ou Lumière ?',
  'note-explicative-de-la-formule': 'Α + β = Ω, terme à terme',
  'avant-propos': 'D’où vient ce livre'
}
/* Cinq entrées ; « Le livre » ouvre un sous-menu. */
const links: NavLink[] = [
  {
    to: '/les-7-leviers',
    label: 'Le livre',
    also: ['/le-livre'],
    children: [
      { to: '/les-7-leviers', label: 'Les leviers', hint: 'Sept leviers, seize exercices' },
      ...EXCERPTS.map(e => ({ to: e.path, label: e.menu, hint: HINTS[e.slug] ?? '' }))
    ]
  },
  { to: '/extraits', label: 'Extraits' },
  { to: '/auteur', label: 'L’auteur' },
  { to: '/faq', label: 'Questions' },
  { to: '/retours', label: 'Retours', also: ['/avis'] }
]

const bookOpen = ref(false)
const mobileBookOpen = ref(false)
const bookEl = ref<HTMLElement[]>([])
function onPointerDown(e: PointerEvent) {
  if (bookOpen.value && !bookEl.value.some(el => el.contains(e.target as Node))) bookOpen.value = false
}

let lastY = 0
function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 24
  hidden.value = y > 420 && y > lastY + 4 && !menuOpen.value && !bookOpen.value
  if (y < lastY - 4) hidden.value = false
  lastY = y
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointerdown', onPointerDown)
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('pointerdown', onPointerDown)
})

watch(() => route.fullPath, () => { menuOpen.value = false; bookOpen.value = false })
watch(menuOpen, (v) => {
  if (import.meta.server) return
  document.documentElement.style.overflow = v ? 'hidden' : ''
  v ? ($stopScroll as any)?.() : ($startScroll as any)?.()
})

const isActive = (l: { to: string, also?: string[] }) => [l.to, ...(l.also ?? [])].some(to => route.path === to || route.path.startsWith(to + '/'))
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { menuOpen.value = false; bookOpen.value = false }
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-700 ease-expo md:px-5 md:pt-4"
    :class="hidden ? '-translate-y-[130%]' : 'translate-y-0'"
    @keydown="onKey"
  >
    <nav
      aria-label="Navigation principale"
      class="flex h-[60px] w-full max-w-6xl items-center justify-between gap-3 rounded-full border pl-5 pr-2 transition-all duration-700 ease-expo"
      :class="scrolled || menuOpen ? 'border-line bg-paper/80 shadow-soft backdrop-blur-xl' : 'border-transparent bg-transparent'"
    >
      <NuxtLink to="/" class="group flex items-center gap-3" aria-label="Une Formule — accueil">
        <span class="grid h-9 w-9 place-items-center rounded-full text-[1.15rem] text-paper shadow-[0_6px_16px_-8px_rgba(113,67,36,.8)] [background:var(--cover-gradient)] transition-transform duration-700 ease-expo group-hover:rotate-[360deg]">
          <span class="font-display leading-none">Ω</span>
        </span>
        <span class="whitespace-nowrap font-display text-[1.05rem] font-semibold uppercase tracking-[0.14em] text-ink sm:text-[1.25rem]">Une Formule<span class="text-caramel">…</span></span>
      </NuxtLink>

      <ul class="hidden items-center gap-0.5 lg:flex">
        <li v-for="l in links" :key="l.to" class="relative">
          <div v-if="l.children" ref="bookEl">
            <button
              type="button"
              class="relative flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 font-sans text-[0.92rem] transition-colors duration-300"
              :class="isActive(l) || bookOpen ? 'text-ink' : 'text-ink-soft hover:text-ink'"
              :aria-expanded="bookOpen"
              aria-controls="menu-le-livre"
              @click="bookOpen = !bookOpen"
            >
              {{ l.label }}
              <ChevronDown class="h-4 w-4 transition-transform duration-500 ease-expo" :class="bookOpen && 'rotate-180'" aria-hidden="true" />
              <span v-if="isActive(l)" class="absolute bottom-1 left-[calc(50%-8px)] h-1 w-1 -translate-x-1/2 rounded-full bg-caramel" />
            </button>
            <Transition enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 translate-y-2" leave-active-class="transition duration-200" leave-to-class="opacity-0 translate-y-1">
              <div v-if="bookOpen" id="menu-le-livre" class="absolute left-1/2 top-full z-10 mt-4 w-[21rem] -translate-x-1/2 rounded-[26px] border border-line bg-paper/95 p-2 shadow-lift backdrop-blur-xl">
                <NuxtLink
                  v-for="c in l.children"
                  :key="c.to"
                  :to="c.to"
                  class="block rounded-[20px] px-4 py-3 transition-colors hover:bg-paper-2"
                  :class="route.path === c.to && 'bg-paper-2'"
                >
                  <span class="block font-display text-[1.3rem] leading-tight text-ink">{{ c.label }}</span>
                  <span class="mt-0.5 block font-sans text-[0.8rem] text-ink-muted">{{ c.hint }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>
          <NuxtLink
            v-else
            :to="l.to"
            class="relative whitespace-nowrap rounded-full px-4 py-2 font-sans text-[0.92rem] transition-colors duration-300"
            :class="l.to === '/retours'
              ? 'ml-2 bg-copper px-5 text-[#FFFDF9] hover:bg-umber'
              : isActive(l) ? 'text-ink' : 'text-ink-soft hover:text-ink'"
          >
            {{ l.label }}
            <span v-if="isActive(l) && l.to !== '/retours'" class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-caramel" />
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/60 text-ink transition-colors hover:border-caramel"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" class="h-5 w-5" aria-hidden="true" />
          <Menu v-else class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  </header>

  <!-- Menu mobile plein écran -->
  <Transition
    enter-active-class="transition-[clip-path] duration-[900ms] ease-in-out-expo" enter-from-class="[clip-path:circle(0%_at_calc(100%-40px)_40px)]" enter-to-class="[clip-path:circle(150%_at_calc(100%-40px)_40px)]"
    leave-active-class="transition-[clip-path] duration-500 ease-in-out-expo" leave-from-class="[clip-path:circle(150%_at_calc(100%-40px)_40px)]" leave-to-class="[clip-path:circle(0%_at_calc(100%-40px)_40px)]"
  >
    <div v-if="menuOpen" id="mobile-menu" class="fixed inset-0 z-40 overflow-y-auto bg-paper px-6 pb-10 pt-28 lg:hidden" data-lenis-prevent>
      <BrandRings class="pointer-events-none absolute -right-48 top-10 h-[34rem] w-[34rem] opacity-50" />
      <nav aria-label="Menu mobile" class="relative">
        <ul class="space-y-1">
          <li v-for="(l, i) in links" :key="l.to" class="mobile-item" :style="{ '--i': i }">
            <template v-if="l.children">
              <button
                type="button"
                class="flex w-full items-baseline justify-between border-b border-line py-4 text-left font-display text-[2.1rem] leading-none"
                :class="isActive(l) ? 'text-caramel' : 'text-ink'"
                :aria-expanded="mobileBookOpen"
                aria-controls="mobile-le-livre"
                @click="mobileBookOpen = !mobileBookOpen"
              >
                <span class="flex items-center gap-2">{{ l.label }} <ChevronDown class="h-6 w-6 transition-transform duration-500 ease-expo" :class="mobileBookOpen && 'rotate-180'" aria-hidden="true" /></span>
                <span class="font-sans text-xs text-ink-muted">0{{ i + 1 }}</span>
              </button>
              <div id="mobile-le-livre" class="grid transition-[grid-template-rows] duration-500 ease-expo" :class="mobileBookOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'" :inert="!mobileBookOpen || undefined">
                <ul class="overflow-hidden">
                  <li v-for="c in l.children" :key="c.to">
                    <NuxtLink :to="c.to" class="flex items-baseline justify-between border-b border-line/70 py-3 pl-5 font-serif text-[1.3rem]" :class="route.path === c.to ? 'text-caramel' : 'text-ink-soft'">
                      {{ c.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </template>
            <NuxtLink v-else :to="l.to" class="flex items-baseline justify-between border-b border-line py-4 font-display text-[2.1rem] leading-none" :class="isActive(l) ? 'text-caramel' : 'text-ink'">
              {{ l.label }}
              <span class="font-sans text-xs text-ink-muted">0{{ i + 1 }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-item {
  animation: menu-in 0.9s var(--ease-out) both;
  animation-delay: calc(0.18s + var(--i) * 0.05s);
}
@keyframes menu-in {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}
</style>
