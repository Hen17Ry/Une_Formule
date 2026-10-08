<script setup lang="ts">
import { ChevronDown, Menu, X, ArrowUpRight } from '@lucide/vue'
import { LEVERS } from '~/data/book'

const route = useRoute()
const scrolled = ref(false)
const hidden = ref(false)
const menuOpen = ref(false)
const feedbackOpen = ref(false)
const { $stopScroll, $startScroll } = useNuxtApp()

const links = [
  { to: '/les-7-leviers', label: 'Les 7 leviers' },
  { to: '/extraits', label: 'Extraits' },
  { to: '/auteur', label: 'L’auteur' },
  { to: '/faq', label: 'Questions / Réponses' }
]

let lastY = 0
function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 24
  hidden.value = y > 420 && y > lastY + 4 && !menuOpen.value && !feedbackOpen.value
  if (y < lastY - 4) hidden.value = false
  lastY = y
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(() => route.fullPath, () => { menuOpen.value = false; feedbackOpen.value = false })
watch(menuOpen, (v) => {
  if (import.meta.server) return
  document.documentElement.style.overflow = v ? 'hidden' : ''
  v ? ($stopScroll as any)?.() : ($startScroll as any)?.()
})

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')

let closeTimer: ReturnType<typeof setTimeout> | undefined
const openFeedback = () => { clearTimeout(closeTimer); feedbackOpen.value = true }
const closeFeedback = () => { closeTimer = setTimeout(() => (feedbackOpen.value = false), 160) }
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { feedbackOpen.value = false; menuOpen.value = false }
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
        <span class="font-display text-[1.05rem] font-semibold uppercase tracking-[0.14em] text-ink sm:text-[1.25rem]">Une Formule<span class="text-caramel">…</span></span>
      </NuxtLink>

      <ul class="hidden items-center gap-1 lg:flex">
        <li v-for="l in links" :key="l.to">
          <NuxtLink
            :to="l.to"
            class="relative rounded-full px-4 py-2 font-sans text-[0.92rem] transition-colors duration-300"
            :class="isActive(l.to) ? 'text-ink' : 'text-ink-soft hover:text-ink'"
          >
            {{ l.label }}
            <span v-if="isActive(l.to)" class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-caramel" />
          </NuxtLink>
        </li>
        <li class="relative" @pointerenter="openFeedback" @pointerleave="closeFeedback">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-[0.92rem] transition-colors duration-300"
            :class="isActive('/retours') || isActive('/avis') ? 'text-ink' : 'text-ink-soft hover:text-ink'"
            :aria-expanded="feedbackOpen"
            aria-controls="nav-feedback"
            @click="feedbackOpen = !feedbackOpen"
          >
            Retours des lecteurs
            <ChevronDown class="h-4 w-4 transition-transform duration-500 ease-expo" :class="feedbackOpen && 'rotate-180'" aria-hidden="true" />
          </button>
          <Transition
            enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 translate-y-2 scale-[.98]"
            leave-active-class="transition duration-200" leave-to-class="opacity-0 translate-y-1"
          >
            <div v-show="feedbackOpen" id="nav-feedback" class="absolute left-1/2 top-[calc(100%+14px)] w-[640px] -translate-x-1/2 rounded-[28px] border border-line bg-paper/95 p-3 shadow-lift backdrop-blur-xl">
              <div class="grid grid-cols-[1.25fr_1fr] gap-2">
                <ul class="space-y-0.5">
                  <li class="px-3 pb-2 pt-2"><span class="label">Un retour sur un levier</span></li>
                  <li v-for="l in LEVERS" :key="l.n">
                    <NuxtLink :to="`/retours/${l.slug}`" class="group flex items-center gap-3 rounded-2xl px-3 py-2 text-[0.92rem] text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink">
                      <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-sm text-paper" :style="{ background: l.color }">{{ l.n }}</span>
                      <span class="truncate">{{ l.short }}</span>
                    </NuxtLink>
                  </li>
                </ul>
                <div class="flex flex-col gap-2">
                  <NuxtLink to="/retours/general" class="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-[22px] p-5 text-[#FFFDF9] [background:var(--cover-soft)]">
                    <BrandRings class="absolute -right-24 -top-24 h-72 w-72 opacity-60" :spin="false" />
                    <span class="relative font-sans text-[0.7rem] uppercase tracking-label text-paper/80">Le livre en entier</span>
                    <span class="relative mt-1 font-display text-2xl leading-tight">Donner un retour général</span>
                    <ArrowUpRight class="absolute right-4 top-4 h-5 w-5 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                  </NuxtLink>
                  <NuxtLink to="/avis" class="flex items-center justify-between rounded-[18px] border border-line px-4 py-3 text-[0.92rem] text-ink-soft transition-colors hover:border-caramel hover:text-ink">
                    Lire les avis publiés <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
                  </NuxtLink>
                  <NuxtLink to="/retours" class="flex items-center justify-between rounded-[18px] border border-line px-4 py-3 text-[0.92rem] text-ink-soft transition-colors hover:border-caramel hover:text-ink">
                    Tous les formulaires <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </Transition>
        </li>
      </ul>

      <div class="flex items-center gap-2">
        <UiButton to="/commander" size="sm" class="hidden sm:inline-flex">Commander</UiButton>
        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/60 text-ink transition-colors hover:border-caramel lg:hidden"
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
    <div v-if="menuOpen" id="mobile-menu" class="fixed inset-0 z-40 overflow-y-auto bg-paper px-6 pb-10 pt-28" data-lenis-prevent>
      <BrandRings class="pointer-events-none absolute -right-48 top-10 h-[34rem] w-[34rem] opacity-50" />
      <nav aria-label="Menu mobile" class="relative">
        <ul class="space-y-1">
          <li v-for="(l, i) in [{ to: '/', label: 'Accueil' }, ...links, { to: '/retours', label: 'Retours des lecteurs' }, { to: '/avis', label: 'Avis publiés' }]" :key="l.to" class="mobile-item" :style="{ '--i': i }">
            <NuxtLink :to="l.to" class="flex items-baseline justify-between border-b border-line py-4 font-display text-[2.1rem] leading-none text-ink">
              {{ l.label }}
              <span class="font-sans text-xs text-ink-muted">0{{ i + 1 }}</span>
            </NuxtLink>
          </li>
        </ul>
        <div class="mobile-item mt-8" style="--i: 8">
          <span class="label">Donner un retour</span>
          <div class="mt-3 flex flex-wrap gap-2">
            <NuxtLink v-for="l in LEVERS" :key="l.n" :to="`/retours/${l.slug}`" class="grid h-11 w-11 place-items-center rounded-full font-display text-lg text-paper" :style="{ background: l.color }" :aria-label="`Levier ${l.n} : ${l.short}`">{{ l.n }}</NuxtLink>
            <NuxtLink to="/retours/general" class="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm">Général</NuxtLink>
          </div>
        </div>
        <div class="mobile-item mt-10" style="--i: 9">
          <UiButton to="/commander" size="lg" block>Commander le livre</UiButton>
        </div>
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
