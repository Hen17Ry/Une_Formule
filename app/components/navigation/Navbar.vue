<template>
  <header
    class="fixed top-0 left-0 w-full z-50 border-b transition-all duration-700 ease-out"
    :class="[
      isPaperTheme
        ? 'py-3.5 md:py-4 shadow-sm'
        : 'py-5 md:py-6'
    ]"
    :style="headerStyle"
  >
    <div class="container mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
      <!-- Left Logo -->
      <NuxtLink
        to="/"
        class="font-serif transition-colors duration-500 text-lg md:text-xl tracking-[0.2em] font-medium flex items-center gap-2 group"
        :class="isPaperTheme ? 'text-[#3A2115] hover:text-[#B08D57]' : 'text-[#E8DCC8] hover:text-[#C7A45D]'"
      >
        <span :class="isPaperTheme ? 'text-[#B08D57]' : 'text-[#C7A45D]'" class="transition-transform duration-300 group-hover:scale-110">Α</span>
        <span>+</span>
        <span :class="isPaperTheme ? 'text-[#B08D57]' : 'text-[#C7A45D]'">β</span>
        <span>=</span>
        <span :class="isPaperTheme ? 'text-[#B08D57]' : 'text-[#C7A45D]'">Ω</span>
      </NuxtLink>

      <!-- Desktop Nav Links (md+) -->
      <nav class="hidden md:flex items-center space-x-6 lg:space-x-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-xs lg:text-sm uppercase tracking-[0.2em] transition-colors duration-500 font-medium"
          :class="isPaperTheme ? 'text-[#3A2115]/85 hover:text-[#B08D57]' : 'text-[#E8DCC8] hover:text-[#C7A45D]'"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/commander"
          class="text-xs lg:text-sm uppercase tracking-[0.2em] transition-all duration-500 rounded-full px-5 py-2 font-medium shadow-sm"
          :class="isPaperTheme
            ? 'text-[#B08D57] border border-[#B08D57]/50 hover:border-[#B08D57] hover:bg-[#B08D57] hover:text-[#F8F4ED]'
            : 'text-[#C7A45D] border border-[#C7A45D]/60 hover:border-[#C7A45D] hover:bg-[#C7A45D]/20 hover:text-[#F6F0E7]'"
        >
          Commander
        </NuxtLink>
      </nav>

      <!-- Mobile Menu Trigger (< md) -->
      <button
        type="button"
        class="md:hidden transition-colors duration-500 text-xs uppercase tracking-[0.25em] font-medium flex items-center gap-2 px-3.5 py-1.5 border rounded-full backdrop-blur-md"
        :class="isPaperTheme
          ? 'text-[#B08D57] border-[#B08D57]/30 bg-[#F8F4ED]/90 hover:text-[#3A2115]'
          : 'text-[#C7A45D] border-[#C7A45D]/40 bg-[#120D09]/70 hover:text-[#F6F0E7]'"
        aria-label="Toggle menu"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span>MENU</span>
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="{ 'rotate-90': isMobileMenuOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Fullscreen Mobile Menu Drawer -->
    <Transition name="menu-fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-[#F8F4ED] z-50 flex flex-col justify-between p-8 md:hidden text-[#3A2115]"
      >
        <!-- Top Drawer Header -->
        <div class="flex items-center justify-between w-full border-b border-[#B08D57]/20 pb-4">
          <span class="font-serif text-[#B08D57] tracking-[0.2em] text-lg font-medium">
            Α + β = Ω
          </span>
          <button
            type="button"
            class="text-[#3A2115] hover:text-[#B08D57] transition-colors text-xs uppercase tracking-[0.2em] p-2 border border-[#B08D57]/30 rounded-full"
            aria-label="Close menu"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Centered Mobile Links -->
        <nav class="flex flex-col items-center justify-center space-y-6 my-auto">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-serif text-2xl text-[#3A2115] hover:text-[#B08D57] transition-colors tracking-wide"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <div class="pt-4">
            <NuxtLink
              to="/commander"
              class="inline-block font-serif text-lg text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-8 py-3 tracking-widest font-medium shadow-md"
              @click="isMobileMenuOpen = false"
            >
              Commander
            </NuxtLink>
          </div>
        </nav>

        <!-- Mobile Drawer Footer -->
        <div class="text-center text-[#3A2115]/60 text-xs tracking-[0.2em] uppercase font-light border-t border-[#B08D57]/20 pt-4">
          Une Formule · Maison d'Édition
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#imports'
import { useFrameSequence } from '../hero/useFrameSequence'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const windowScrollY = ref(0)
const { scrollProgress } = useFrameSequence()

const navLinks = [
  { label: 'Le Livre', to: '/le-livre' },
  { label: 'Les 7 leviers', to: '/les-7-leviers' },
  { label: 'La Genèse', to: '/la-genese' },
  { label: 'L\'auteur', to: '/auteur' },
  { label: 'Extraits', to: '/extraits' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Témoignages', to: '/temoignages' }
]

const navFactor = computed(() => {
  if (!import.meta.client) return 1
  if (route.path !== '/') return 1 // Always solid theme on non-home pages

  const heroEl = document.querySelector('section')
  const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight * 4
  const windowH = window.innerHeight

  if (windowScrollY.value >= heroHeight - windowH * 0.5) {
    return 1
  }

  const p = scrollProgress.value
  if (p < 0.85) {
    return 0
  }

  return Math.min(1, Math.max(0, (p - 0.85) / 0.15))
})

const isPaperTheme = computed(() => navFactor.value >= 0.5)

const headerStyle = computed(() => {
  const factor = navFactor.value
  const bgAlpha = (factor * 0.92).toFixed(3)
  const borderAlpha = (factor * 0.22).toFixed(3)
  const blurPx = (factor * 16).toFixed(1)

  return {
    backgroundColor: `rgba(248, 244, 237, ${bgAlpha})`,
    borderColor: `rgba(176, 141, 87, ${borderAlpha})`,
    backdropFilter: factor > 0.05 ? `blur(${blurPx}px)` : 'none',
    WebkitBackdropFilter: factor > 0.05 ? `blur(${blurPx}px)` : 'none'
  }
})

const handleScroll = () => {
  if (!import.meta.client) return
  windowScrollY.value = window.scrollY
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  }
})
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
