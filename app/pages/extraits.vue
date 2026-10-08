<script setup lang="ts">
import { ShoppingBag } from '@lucide/vue'
import { EXCERPTS } from '~/data/book'

useSeo({ title: 'Extraits du livre', description: 'Lisez trois extraits d’Une Formule : La magie du titre, la note explicative de la formule Α + β = Ω et l’ouverture de l’avant-propos.' })

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
        <p v-reveal class="mx-auto mt-6 max-w-xl font-serif text-[1.2rem] leading-relaxed text-ink-soft">Trois extraits, publiés tels quels, dans l’ordre voulu par l’auteur.</p>
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
        <article
          :id="`panel-${excerpt.slug}`"
          ref="article"
          :key="excerpt.slug"
          role="tabpanel"
          :aria-labelledby="`tab-${excerpt.slug}`"
          class="relative mx-auto mt-12 max-w-3xl rounded-[8px] border border-line bg-[#fffdf8] px-7 py-14 shadow-lift sm:px-12 md:px-20 md:py-20"
        >
          <p class="text-center font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">{{ excerpt.label }}</p>
          <h2 class="mt-3 text-center font-display text-display-sm">{{ excerpt.title }}</h2>
          <span class="rule-gold mx-auto mt-6" aria-hidden="true" />
          <p v-if="excerpt.formula" class="formula mt-8 text-center text-6xl text-ink" aria-label="Alpha plus bêta égale oméga">Α <span class="text-gold">+</span> <em class="text-caramel">β</em> <span class="text-gold">=</span> Ω</p>
          <div class="prose-book mt-10">
            <p v-for="(p, i) in excerpt.paragraphs" :key="i" :class="i === 0 && 'first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.8rem] first-letter:leading-[0.78] first-letter:text-caramel'">{{ p }}</p>
          </div>
          <p v-if="excerpt.note" class="mt-10 border-t border-line pt-6 text-center font-sans text-sm italic text-ink-muted">{{ excerpt.note }}</p>
          <p class="mt-12 text-center font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted">Une Formule …</p>
        </article>
      </Transition>

      <div class="mx-auto mt-10 flex max-w-3xl items-center justify-between gap-4">
        <button v-if="current > 0" type="button" class="min-h-[44px] font-sans text-sm text-ink-soft hover:text-ink" @click="select(current - 1)">← {{ EXCERPTS[current - 1]!.title }}</button>
        <span v-else />
        <button v-if="current < EXCERPTS.length - 1" type="button" class="min-h-[44px] font-sans text-sm text-ink-soft hover:text-ink" @click="select(current + 1)">{{ EXCERPTS[current + 1]!.title }} →</button>
      </div>

      <div v-reveal class="mx-auto mt-20 flex max-w-3xl flex-col items-center gap-6 rounded-[32px] border border-line bg-paper-2/70 px-8 py-12 text-center">
        <p class="font-display text-display-sm">La suite est entre les pages.</p>
        <UiButton to="/commander" size="lg" :icon-left="ShoppingBag">Commander le livre</UiButton>
      </div>
    </div>
  </div>
</template>
