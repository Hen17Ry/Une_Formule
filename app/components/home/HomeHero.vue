<script setup lang="ts">
import { ArrowRight, BookOpen } from '@lucide/vue'
import { BOOK } from '~/data/book'

const section = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const ready = ref(false)
const failed = ref(false)
const reduced = ref(false)
const stage = ref(0)
const intro = useState<'idle' | 'playing' | 'lifting' | 'done'>('intro', () => 'idle')

let scene: import('~/lib/book-scene').BookScene | null = null
let tl: gsap.core.Timeline | null = null
let io: IntersectionObserver | null = null
let mq: MediaQueryList | null = null
const cleanups: (() => void)[] = []

const stages = ['Le livre', 'La maxime', 'La formule']
const maximWords = [
  { w: 'Vous' }, { w: 'êtes' }, { w: 'l’architecte,', em: true }, { w: 'le' }, { w: 'matériau', em: true },
  { w: 'et' }, { w: 'le' }, { w: 'magicien', em: true }, { w: 'de' }, { w: 'votre' }, { w: 'vie.' }
]

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

async function playIntro() {
  const { gsap, SplitText } = await useGsap()
  const root = section.value
  if (!root) return
  // On n’attend pas indéfiniment les polices (réseaux lents) : 700 ms au plus.
  await Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 700))])
  const title = root.querySelector('[data-title]') as HTMLElement
  const split = SplitText.create(title, { type: 'chars', mask: 'chars' })
  title.style.opacity = '1'
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.035 })
    .fromTo(root.querySelectorAll('[data-intro]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.09 }, '-=1.05')
    .from(root.querySelector('[data-book-wrap]'), { opacity: 0, scale: 0.94, duration: 1.6 }, 0.1)
}

onMounted(async () => {
  reduced.value = prefersReducedMotion()
  const root = section.value!

  // Intro : attendre la levée du rideau d’ouverture s’il est joué.
  if (reduced.value) {
    root.querySelector<HTMLElement>('[data-title]')!.style.opacity = '1'
    root.querySelectorAll<HTMLElement>('[data-intro]').forEach(el => (el.style.opacity = '1'))
  } else if (intro.value === 'playing') {
    const stop = watch(intro, (v) => { if (v !== 'playing') { stop(); playIntro() } })
  } else {
    playIntro()
  }

  // Scène 3D
  if (webglAvailable()) {
    const { BookScene } = await import('~/lib/book-scene')
    scene = new BookScene(canvas.value!, {
      onReady: () => { ready.value = true },
      onError: () => { failed.value = true }
    })
    mq = window.matchMedia('(min-width: 1024px)')
    const applyLayout = () => scene?.setLayout(mq!.matches ? 'desktop' : 'mobile')
    applyLayout()
    mq.addEventListener('change', applyLayout)
    cleanups.push(() => mq?.removeEventListener('change', applyLayout))
    scene.load('/models/UNE_FORMULE_BOOK_LOW.glb')
    if (import.meta.dev) (window as any).__bookScene = scene

    const onResize = () => scene?.resize()
    window.addEventListener('resize', onResize)
    cleanups.push(() => window.removeEventListener('resize', onResize))

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    cleanups.push(() => window.removeEventListener('pointermove', onPointer))

    io = new IntersectionObserver(([entry]) => entry?.isIntersecting ? scene?.start() : scene?.stop(), { rootMargin: '100px' })
    io.observe(root)
  } else {
    failed.value = true
  }

  if (reduced.value) return

  // Chorégraphie liée au scroll
  const { gsap } = await useGsap()
  const proxy = { p: 0 }
  tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.9,
      onUpdate: (self) => {
        const p = self.progress
        stage.value = p < 0.28 ? 0 : p < 0.6 ? 1 : 2
      }
    }
  })
  tl.to(proxy, { p: 1, duration: 1, ease: 'none', onUpdate: () => scene?.setProgress(proxy.p) }, 0)
    // 1 — le livre
    .to('[data-layer="1"]', { opacity: 0, y: -60, duration: 0.12 }, 0.14)
    .to('[data-scroll-hint]', { opacity: 0, duration: 0.05 }, 0.02)
    // 2 — la maxime
    .fromTo('[data-layer="2"]', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08 }, 0.27)
    .fromTo('[data-maxim-word]', { opacity: 0.12 }, { opacity: 1, duration: 0.16, stagger: 0.012, ease: 'none' }, 0.3)
    .to('[data-layer="2"]', { opacity: 0, y: -50, duration: 0.08 }, 0.53)
    // 3 — la formule
    .fromTo('[data-layer="3"]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.64)
    .fromTo('[data-glyph]', { yPercent: 60, opacity: 0, filter: 'blur(8px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.16, stagger: 0.03, ease: 'expo.out' }, 0.66)
    .fromTo('[data-layer3-text]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.82)
    // décor
    .to('[data-rings]', { rotate: 50, scale: 1.25, duration: 1, ease: 'none' }, 0)
    .to('[data-glow]', { scale: 1.4, opacity: 0.9, duration: 1, ease: 'none' }, 0)
})

onBeforeUnmount(() => {
  tl?.scrollTrigger?.kill()
  tl?.kill()
  io?.disconnect()
  cleanups.forEach(fn => fn())
  scene?.dispose()
  scene = null
})

const scrollToNext = () => {
  const el = document.getElementById('formule')
  const lenis = (useNuxtApp().$lenis as any)?.()
  lenis ? lenis.scrollTo(el, { duration: 2.2 }) : el?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section ref="section" class="relative" :class="reduced ? 'h-[100svh] min-h-[640px]' : 'h-[330vh] lg:h-[360vh]'" aria-labelledby="hero-title">
    <div class="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
      <!-- Décor -->
      <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_40%,#fffaf3_0%,#fbf7f1_40%,#f3e8da_100%)]" />
      <div data-glow aria-hidden="true" class="absolute left-[55%] top-[45%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,191,134,.35),rgba(196,144,103,.12)_45%,transparent_70%)] opacity-70 max-lg:left-1/2 max-lg:top-[34%]" />
      <div data-rings aria-hidden="true" class="absolute left-[60%] top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 max-lg:left-1/2 max-lg:top-[34%] max-lg:h-[110vmax] max-lg:w-[110vmax]">
        <BrandRings class="h-full w-full opacity-50" :spin="false" />
      </div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 select-none font-display text-caramel/[.13]">
        <span class="absolute left-[6%] top-[18%] text-[9vmin] italic animate-float">β</span>
        <span class="absolute right-[7%] top-[14%] text-[7vmin] animate-float [animation-delay:-2s]">Σ</span>
        <span class="absolute bottom-[12%] left-[44%] text-[8vmin] animate-float [animation-delay:-4s]">Ω</span>
        <span class="absolute bottom-[22%] right-[4%] text-[6vmin] italic animate-float [animation-delay:-1s]">π</span>
      </div>

      <!-- Livre : WebGL, ou couverture en CSS 3D en attendant / en repli -->
      <div data-book-wrap class="absolute inset-0">
        <canvas ref="canvas" class="absolute inset-0 h-full w-full transition-opacity duration-1000" :class="ready && !failed ? 'opacity-100' : 'opacity-0'" aria-hidden="true" />
        <Transition leave-active-class="transition-opacity duration-700" leave-to-class="opacity-0">
          <div v-if="!ready || failed" class="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 lg:left-[68%] lg:top-1/2">
            <BrandBook :width="failed ? 300 : 260" :interactive="false" :rotate="-28" class="max-lg:scale-[.72]" />
          </div>
        </Transition>
      </div>

      <!-- Étape 1 : le livre -->
      <div data-layer="1" class="container pointer-events-none absolute inset-0 flex items-end pb-[9vh] lg:items-center lg:pb-0">
        <div class="pointer-events-auto max-w-[46rem] max-lg:mx-auto max-lg:text-center">
          <p data-intro class="label mb-5 lg:mb-7">Le livre de {{ BOOK.author }}</p>
          <h1 id="hero-title" class="text-ink">
            <span data-title class="block font-display text-[clamp(3.1rem,7vw,7.2rem)] font-semibold uppercase leading-[0.92] tracking-[0.04em]">Une<br>Formule<span class="text-caramel">…</span></span>
            <span data-intro class="mt-5 flex items-center gap-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.34em] text-ink-soft max-lg:justify-center lg:mt-7">
              <span class="h-px w-10 bg-gold" aria-hidden="true" />7 leviers pour<span class="h-px w-10 bg-gold" aria-hidden="true" />
            </span>
            <span data-intro class="mt-3 block font-display text-[clamp(1.75rem,3.4vw,3.1rem)] font-medium leading-[1.05] text-ink lg:mt-4">Construire la vie<br class="hidden lg:block"> que vous désirez</span>
          </h1>
          <p data-intro class="mt-5 hidden max-w-md font-serif text-[1.15rem] leading-relaxed text-ink-soft lg:block">{{ BOOK.hook }}</p>
          <div data-intro class="mt-7 flex flex-wrap gap-3 max-lg:justify-center lg:mt-10">
            <UiButton to="/commander" size="lg" :icon="ArrowRight">Commander le livre</UiButton>
            <UiButton to="/extraits" size="lg" variant="outline" :icon-left="BookOpen" class="max-sm:hidden">Lire un extrait</UiButton>
          </div>
        </div>
      </div>

      <!-- Étape 2 : la maxime -->
      <div data-layer="2" class="container pointer-events-none absolute inset-0 flex items-end pb-[12vh] opacity-0 lg:items-center lg:justify-end lg:pb-0" :aria-hidden="reduced || undefined">
        <div class="max-w-[36rem] max-lg:text-center">
          <p class="label-gold mb-6">La maxime du livre</p>
          <p class="font-display text-[clamp(2.1rem,4.6vw,4.4rem)] font-medium leading-[1.06] text-ink">
            <span v-for="(m, i) in maximWords" :key="i" data-maxim-word class="inline-block" :class="m.em && 'italic text-caramel'">{{ m.w }}&nbsp;</span>
          </p>
        </div>
      </div>

      <!-- Étape 3 : la formule -->
      <div data-layer="3" class="pointer-events-none absolute inset-x-0 top-[13vh] text-center opacity-0 lg:top-[11vh]" :aria-hidden="reduced || undefined">
        <p class="label-gold">L’équation du livre</p>
        <p class="formula mt-4 flex items-baseline justify-center gap-[0.28em] text-[clamp(3.6rem,11vw,10rem)] leading-none text-ink" aria-label="Alpha plus bêta égale oméga">
          <span data-glyph aria-hidden="true">Α</span><span data-glyph aria-hidden="true" class="text-gold">+</span><span data-glyph aria-hidden="true" class="italic text-caramel">β</span><span data-glyph aria-hidden="true" class="text-gold">=</span><span data-glyph aria-hidden="true">Ω</span>
        </p>
        <p data-layer3-text class="mx-auto mt-5 max-w-xl px-6 font-serif text-[1.15rem] leading-relaxed text-ink-soft md:text-[1.3rem]">
          Vous, plus le mécanisme activé un levier à la fois, égale la version de vous déjà en germe.
        </p>
      </div>

      <!-- Indicateur d’étapes -->
      <ol v-if="!reduced" class="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 xl:flex" aria-hidden="true">
        <li v-for="(s, i) in stages" :key="s" class="flex items-center justify-end gap-3 font-sans text-[0.7rem] uppercase tracking-[0.24em] transition-colors duration-500" :class="stage === i ? 'text-ink' : 'text-ink/35'">
          {{ s }}
          <span class="h-px transition-all duration-700 ease-expo" :class="stage === i ? 'w-10 bg-caramel' : 'w-4 bg-ink/25'" />
        </li>
      </ol>

      <button
        v-if="!reduced"
        data-scroll-hint
        type="button"
        class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-muted lg:flex"
        @click="scrollToNext"
      >
        Faites défiler
        <span class="relative h-12 w-px overflow-hidden bg-ink/15" aria-hidden="true"><span class="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2.2s_ease-in-out_infinite] bg-caramel" /></span>
      </button>
    </div>
  </section>
</template>

<style>
@keyframes scrollhint {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}
</style>
