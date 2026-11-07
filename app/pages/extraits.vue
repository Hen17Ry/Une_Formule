<script setup lang="ts">
import { BookOpen } from '@lucide/vue'
import { EXCERPTS, type Excerpt } from '~/data/book'

useSeo({ title: 'Extraits du livre', description: 'La première couverture, la quatrième de couverture et trois extraits d’Une Formule : La magie du titre, la note explicative de la formule Α + β = Ω et l’avant-propos.' })

/* Onglets : les deux faces de la couverture, puis les extraits. */
interface Tab { slug: string, kicker?: string, title: string, kind: 'front' | 'back' | 'text', text?: Excerpt }
const TABS: Tab[] = [
  { slug: 'premiere-couverture', title: 'Première couverture', kind: 'front' },
  { slug: 'quatrieme-de-couverture', title: 'Quatrième de couverture', kind: 'back' },
  ...EXCERPTS.map(e => ({ slug: e.slug, kicker: e.label, title: e.title, kind: 'text' as const, text: e }))
]

const route = useRoute()
const current = ref(TABS.findIndex(t => `#${t.slug}` === route.hash))
if (current.value < 0) current.value = 0
const tab = computed(() => TABS[current.value]!)
const progress = ref(0)
const article = ref<HTMLElement>()

function select(i: number) {
  current.value = i
  history.replaceState(history.state, '', `#${TABS[i]!.slug}`)
  document.getElementById(`tab-${TABS[i]!.slug}`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
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
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  if (current.value > 0) document.getElementById(`tab-${tab.value.slug}`)?.scrollIntoView({ inline: 'center', block: 'nearest' })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <div class="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-caramel" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
    <BrandRings class="pointer-events-none absolute -left-56 -top-32 h-[46rem] w-[46rem] opacity-40" />
    <div class="container relative">
      <header class="mx-auto max-w-3xl text-center">
        <p v-reveal class="label-gold">Le livre</p>
        <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">Extraits <em class="text-caramel">éditoriaux</em> du livre</UiSplitReveal>
      </header>

      <div id="lecture" role="tablist" aria-label="Couvertures et extraits" class="no-scrollbar z-20 mx-auto mt-14 flex max-w-6xl flex-wrap justify-center gap-1 rounded-[26px] border border-line bg-paper/85 p-1.5 shadow-soft backdrop-blur-xl lg:sticky lg:top-[84px] lg:flex-nowrap lg:overflow-x-auto lg:rounded-full" data-lenis-prevent>
        <button
          v-for="(t, i) in TABS"
          :id="`tab-${t.slug}`"
          :key="t.slug"
          role="tab"
          type="button"
          :aria-selected="current === i"
          :aria-controls="`panel-${t.slug}`"
          class="relative min-h-[44px] grow whitespace-nowrap rounded-full px-4 font-sans text-[0.88rem] transition-colors duration-300 lg:shrink-0"
          :class="current === i ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'"
          @click="select(i)"
        >
          <span v-if="t.kicker" class="hidden opacity-70 xl:inline">{{ t.kicker }} · </span>{{ t.title }}
        </button>
      </div>

      <Transition mode="out-in" enter-active-class="transition duration-700 ease-expo" enter-from-class="opacity-0 translate-y-6" leave-active-class="transition duration-200" leave-to-class="opacity-0">
        <div
          :id="`panel-${tab.slug}`"
          ref="article"
          :key="tab.slug"
          role="tabpanel"
          :aria-labelledby="`tab-${tab.slug}`"
          class="relative mx-auto mt-12 max-w-3xl"
        >
          <BookCoverPanel v-if="tab.kind !== 'text'" :side="tab.kind" />
          <BookTextArticle v-else :text="tab.text!" :label="tab.kicker" />
        </div>
      </Transition>

      <div class="mx-auto mt-10 flex max-w-3xl items-center justify-between gap-4">
        <button v-if="current > 0" type="button" class="min-h-[44px] text-left font-sans text-sm text-ink-soft hover:text-ink" @click="select(current - 1)">← {{ TABS[current - 1]!.title }}</button>
        <span v-else />
        <button v-if="current < TABS.length - 1" type="button" class="min-h-[44px] text-right font-sans text-sm text-ink-soft hover:text-ink" @click="select(current + 1)">{{ TABS[current + 1]!.title }} →</button>
      </div>

      <div v-reveal class="mx-auto mt-20 flex max-w-3xl flex-col items-center gap-6 rounded-[32px] border border-line bg-paper-2/70 px-8 py-12 text-center">
        <p class="font-display text-display-sm">La suite est entre les pages.</p>
        <UiButton to="/#ou-trouver" size="lg" :icon-left="BookOpen">Où trouver le livre</UiButton>
      </div>
    </div>
  </div>
</template>
