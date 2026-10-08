<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { LEVERS } from '~/data/book'

const A = ['F', 'O', 'R', 'M', 'U', 'L', 'E']
const B = ['L', 'U', 'M', 'I', 'È', 'R', 'E']
const root = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(async () => {
  const { gsap } = await useGsap()
  if (!root.value) return
  if (prefersReducedMotion()) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-word]', start: 'top 75%', end: 'top 25%', scrub: 0.8 } })
    tl.to('[data-face="a"]', { rotateX: 90, opacity: 0, stagger: 0.08, ease: 'power2.in', duration: 0.5 })
      .fromTo('[data-face="b"]', { rotateX: -90, opacity: 0 }, { rotateX: 0, opacity: 1, stagger: 0.08, ease: 'power2.out', duration: 0.5 }, 0.25)
    gsap.fromTo('[data-ray]', { strokeDashoffset: 420 }, {
      strokeDashoffset: 0, stagger: 0.06, ease: 'none',
      scrollTrigger: { trigger: '[data-prism]', start: 'top 80%', end: 'center 45%', scrub: 0.8 }
    })
    gsap.fromTo('[data-beam]', { strokeDashoffset: 300 }, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: '[data-prism]', start: 'top 90%', end: 'top 55%', scrub: 0.8 }
    })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="relative overflow-hidden py-28 md:py-40" aria-labelledby="magie-title">
    <div class="container">
      <div class="mx-auto max-w-3xl text-center">
        <p v-reveal class="label-gold">Extrait · La magie du titre</p>
        <UiSplitReveal id="magie-title" class="mt-5 font-display text-display-md">Avant de s’appeler <em>Une Formule</em>, ce livre a failli s’appeler <em class="text-caramel">La Lumière</em>.</UiSplitReveal>
      </div>

      <div data-word class="mx-auto mt-16 grid max-w-4xl grid-cols-7 gap-1.5 [perspective:900px] sm:gap-3" aria-label="Formule et Lumière : sept lettres chacun">
        <div v-for="(l, i) in A" :key="i" class="relative grid aspect-[3/4] place-items-center rounded-2xl border border-line bg-white/60 font-display text-[clamp(2rem,7vw,5.5rem)] leading-none text-ink shadow-soft [transform-style:preserve-3d]" aria-hidden="true">
          <span data-face="a" class="absolute inset-0 grid place-items-center [backface-visibility:hidden]">{{ l }}</span>
          <span data-face="b" class="absolute inset-0 grid place-items-center opacity-0 [backface-visibility:hidden] motion-reduce:hidden" :style="{ color: LEVERS[i]!.color }">{{ B[i] }}</span>
          <span class="absolute bottom-2 font-sans text-[0.6rem] tracking-[0.2em] text-ink-muted sm:bottom-3 sm:text-[0.65rem]">{{ i + 1 }}</span>
        </div>
      </div>

      <div class="mt-20 grid items-center gap-14 lg:grid-cols-2">
        <svg data-prism viewBox="0 0 520 300" class="w-full" aria-hidden="true" fill="none">
          <line data-beam x1="0" y1="168" x2="210" y2="150" stroke="#B08A45" stroke-width="3" stroke-linecap="round" stroke-dasharray="300" />
          <path d="M230 70 L300 210 L160 210 Z" fill="url(#prism-fill)" stroke="#B08A45" stroke-width="1.5" stroke-linejoin="round" />
          <defs>
            <linearGradient id="prism-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9" /><stop offset="1" stop-color="#EAD5C0" stop-opacity=".7" /></linearGradient>
          </defs>
          <line v-for="(l, i) in LEVERS" :key="l.n" data-ray x1="262" :y1="148 + i * 3" x2="520" :y2="70 + i * 30" :stroke="l.color" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="420" />
        </svg>
        <div>
          <p v-reveal class="font-display text-display-sm leading-tight text-ink">Sept lettres, sept couleurs.</p>
          <p v-reveal class="mt-6 max-w-xl font-serif text-[1.2rem] leading-relaxed text-ink-soft">
            Formule et Lumière comptent chacun sept lettres. La lumière blanche du soleil se décompose en sept couleurs quand elle traverse un prisme ou une goutte de pluie, du rouge au violet. Deux échos qui se répondent sans qu’on ait eu besoin de forcer quoi que ce soit pour les faire coïncider.
          </p>
          <div v-reveal class="mt-8">
            <UiButton to="/extraits#la-magie-du-titre" variant="outline" :icon="ArrowRight">Lire l’extrait en entier</UiButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
