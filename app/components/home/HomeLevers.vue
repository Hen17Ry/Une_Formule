<script setup lang="ts">
import { ArrowUpRight, MessageSquareQuote } from '@lucide/vue'
import { LEVERS } from '~/data/book'

const root = ref<HTMLElement>()
const track = ref<HTMLElement>()
const active = ref(0)
let mm: gsap.MatchMedia | null = null

onMounted(async () => {
  const { gsap } = await useGsap()
  if (!root.value || !track.value) return
  mm = gsap.matchMedia()
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const distance = () => track.value!.scrollWidth - window.innerWidth + 48
    gsap.to(track.value!, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value!,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: self => { active.value = Math.min(6, Math.floor(self.progress * 7)) }
      }
    })
  })
})
onBeforeUnmount(() => mm?.revert())

/* Carrousel mobile : repère du levier visible */
function onTrackScroll() {
  const el = track.value
  if (!el || window.innerWidth >= 1024) return
  const card = el.firstElementChild as HTMLElement | null
  if (!card) return
  active.value = Math.min(6, Math.round(el.scrollLeft / (card.offsetWidth + 16)))
}
</script>

<template>
  <section id="leviers" ref="root" class="relative overflow-hidden bg-paper-2/70 py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0" aria-labelledby="leviers-title">
    <div class="container relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="label-gold">β, révélé en sept facettes</p>
        <h2 id="leviers-title" class="mt-4 font-display text-display-md">Sept leviers. <em class="text-caramel">Un seul geste central.</em></h2>
      </div>
      <div class="flex items-center gap-6">
        <p class="max-w-sm font-serif text-lg leading-relaxed text-ink-soft">Chaque levier peut s’activer indépendamment des six autres, à votre propre rythme.</p>
        <div class="hidden gap-1.5 lg:flex" aria-hidden="true">
          <span v-for="(l, i) in LEVERS" :key="l.n" class="h-1.5 rounded-full transition-all duration-700 ease-expo" :class="i === active ? 'w-8' : 'w-1.5 opacity-40'" :style="{ background: l.color }" />
        </div>
      </div>
    </div>

    <div
      ref="track"
      class="relative mt-10 flex gap-4 px-5 md:px-8 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-5 max-lg:overflow-x-auto max-lg:pb-4 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:mt-14 lg:w-max lg:gap-6 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-12"
      aria-label="Les sept leviers"
      @scroll.passive="onTrackScroll"
    >
      <article
        v-for="l in LEVERS"
        :key="l.n"
        class="group relative flex shrink-0 snap-center flex-col overflow-hidden rounded-[32px] border border-line bg-paper p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift max-lg:min-h-[29rem] max-lg:w-[min(84vw,26rem)] sm:p-8 md:p-10 lg:h-[min(62vh,580px)] lg:w-[min(30rem,38vw)]"
      >
        <span aria-hidden="true" class="pointer-events-none absolute -right-6 -top-10 font-display text-[13rem] leading-none text-transparent [-webkit-text-stroke:1px_var(--c)] opacity-40 transition-transform duration-1000 ease-expo group-hover:-translate-x-3 group-hover:translate-y-2" :style="{ '--c': l.color }">{{ l.n }}</span>
        <div class="relative flex items-center gap-3">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: l.color }" aria-hidden="true" />
          <span class="label">Levier {{ l.n }}</span>
        </div>
        <h3 class="relative mt-6 max-w-[18ch] font-display text-[2.1rem] leading-[1.08] md:text-[2.4rem]">{{ l.short }}</h3>
        <p class="relative mt-4 font-serif text-[1.1rem] italic leading-relaxed text-ink-soft">{{ l.question }}</p>
        <blockquote class="relative mt-auto border-l-2 pl-5 pt-8 font-serif text-[1.02rem] leading-relaxed text-ink-muted lg:line-clamp-4" :style="{ borderColor: l.color }">« {{ l.quote }} »</blockquote>
        <div class="relative mt-8 flex flex-wrap gap-2">
          <NuxtLink :to="`/les-7-leviers/${l.slug}`" class="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink/[.04] px-5 text-[0.9rem] text-ink transition-colors hover:bg-ink/[.08]">
            Explorer <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink :to="`/retours/${l.slug}`" class="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-[0.9rem] text-ink-soft transition-colors hover:border-caramel hover:text-ink">
            <MessageSquareQuote class="h-4 w-4" aria-hidden="true" /> Mon retour
          </NuxtLink>
        </div>
      </article>
      <NuxtLink
        to="/les-7-leviers"
        class="group relative flex shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[32px] p-8 text-[#FFFDF9] [background:var(--cover-soft)] max-lg:min-h-[29rem] max-lg:w-[min(84vw,26rem)] md:p-10 lg:h-[min(62vh,580px)] lg:w-[min(24rem,30vw)]"
      >
        <BrandRings class="absolute -right-32 -top-32 h-[30rem] w-[30rem] opacity-60" :spin="false" />
        <span class="relative font-sans text-xs uppercase tracking-label text-white/80">Vue d’ensemble</span>
        <span class="relative mt-3 font-display text-[2.4rem] leading-[1.05]">Sept leviers, un seul geste, prolongé à chaque étape.</span>
        <span class="relative mt-8 inline-flex items-center gap-2 text-sm">Parcourir les leviers <ArrowUpRight class="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" /></span>
      </NuxtLink>
    </div>
    <div class="mt-4 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
      <span v-for="(l, i) in LEVERS" :key="l.n" class="h-1.5 rounded-full transition-all duration-500 ease-expo" :class="i === active ? 'w-7' : 'w-1.5 opacity-40'" :style="{ background: l.color }" />
    </div>
  </section>
</template>
