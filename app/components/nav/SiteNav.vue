<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { NAV_LINKS, isNavActive } from '~/data/nav'

/* Barre du haut. Sur mobile, les liens sont dans la barre d’onglets en bas (NavMobileTabBar). */
const route = useRoute()
const scrolled = ref(false)
const hidden = ref(false)
const links = NAV_LINKS

const bookOpen = ref(false)
const bookEl = ref<HTMLElement[]>([])
function onPointerDown(e: PointerEvent) {
  if (bookOpen.value && !bookEl.value.some(el => el.contains(e.target as Node))) bookOpen.value = false
}

let lastY = 0
function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 24
  hidden.value = y > 420 && y > lastY + 4 && !bookOpen.value
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

watch(() => route.fullPath, () => { bookOpen.value = false })

const isActive = (l: { to: string, also?: string[] }) => isNavActive(route.path, l)
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') bookOpen.value = false
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
      :class="scrolled ? 'border-line bg-paper/80 shadow-soft backdrop-blur-xl' : 'border-transparent bg-transparent'"
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

    </nav>
  </header>
</template>
