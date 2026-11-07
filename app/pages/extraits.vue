<script setup lang="ts">
import { BookOpen } from '@lucide/vue'
import { EXCERPTS } from '~/data/book'

useSeo({ title: 'Extraits du livre', description: 'Lisez trois extraits d’Une Formule : La magie du titre, la note explicative de la formule Α + β = Ω et l’avant-propos.' })

const route = useRoute()
const current = ref(EXCERPTS.findIndex(e => `#${e.slug}` === route.hash))
if (current.value < 0) current.value = 0
const excerpt = computed(() => EXCERPTS[current.value]!)
const progress = ref(0)
const article = ref<HTMLElement>()

function select(i: number) {
  current.value = i
  history.replaceState(history.state, '', `#${EXCERPTS[i]!.slug}`)
  const top = document.getElementById('lecture')
  const lenis = (useNuxtApp().$lenis as any)?.()
  if (top && window.scrollY > top.offsetTop) lenis ? lenis.scrollTo(top, { offset: -100 }) : top.scrollIntoView()
}

function onScroll() {
  const el = article.value
  if (!el) return
  const r = el.getBoundingClientRect()
  progress.value = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height))
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <div class="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-caramel" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
    <BrandRings class="pointer-events-none absolute -left-56 -top-32 h-[46rem] w-[46rem] opacity-40" />
    <div class="container relative">
      <header class="mx-auto max-w-3xl text-center">
        <p v-reveal class="label-gold">Extraits du livre</p>
        <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">Ouvrir le livre, <em class="text-caramel">un peu</em>.</UiSplitReveal>
      </header>

      <div id="lecture" role="tablist" aria-label="Extraits" class="sticky top-[84px] z-20 mx-auto mt-14 flex max-w-3xl gap-1 overflow-x-auto rounded-full border border-line bg-paper/85 p-1.5 shadow-soft backdrop-blur-xl" data-lenis-prevent>
        <button
          v-for="(e, i) in EXCERPTS"
          :id="`tab-${e.slug}`"
          :key="e.slug"
          role="tab"
          type="button"
          :aria-selected="current === i"
          :aria-controls="`panel-${e.slug}`"
          class="relative min-h-[44px] flex-1 whitespace-nowrap rounded-full px-4 font-sans text-[0.9rem] transition-colors duration-300"
          :class="current === i ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'"
          @click="select(i)"
        >
          <span class="hidden opacity-70 sm:inline">{{ e.label }} · </span>{{ e.title }}
        </button>
      </div>

      <Transition mode="out-in" enter-active-class="transition duration-700 ease-expo" enter-from-class="opacity-0 translate-y-6" leave-active-class="transition duration-200" leave-to-class="opacity-0">
        <div
          :id="`panel-${excerpt.slug}`"
          ref="article"
          :key="excerpt.slug"
          role="tabpanel"
          :aria-labelledby="`tab-${excerpt.slug}`"
          class="relative mx-auto mt-12 max-w-3xl"
        >
          <BookTextArticle :text="excerpt" :label="excerpt.label" />
        </div>
      </Transition>

      <div class="mx-auto mt-10 flex max-w-3xl items-center justify-between gap-4">
        <button v-if="current > 0" type="button" class="min-h-[44px] font-sans text-sm text-ink-soft hover:text-ink" @click="select(current - 1)">← {{ EXCERPTS[current - 1]!.title }}</button>
        <span v-else />
        <button v-if="current < EXCERPTS.length - 1" type="button" class="min-h-[44px] font-sans text-sm text-ink-soft hover:text-ink" @click="select(current + 1)">{{ EXCERPTS[current + 1]!.title }} →</button>
      </div>

      <div v-reveal class="mx-auto mt-20 flex max-w-3xl flex-col items-center gap-6 rounded-[32px] border border-line bg-paper-2/70 px-8 py-12 text-center">
        <p class="font-display text-display-sm">La suite est entre les pages.</p>
        <UiButton to="/#ou-trouver" size="lg" :icon-left="BookOpen">Où trouver le livre</UiButton>
      </div>
    </div>
  </div>
</template>
