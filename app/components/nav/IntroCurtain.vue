<script setup lang="ts">
/* Rideau d’ouverture (première visite de la session) : la couleur de la couverture se lève sur le site. */
const show = ref(false)
const root = ref<HTMLElement>()
const intro = useState<'idle' | 'playing' | 'lifting' | 'done'>('intro', () => 'idle')

onMounted(async () => {
  let seen = false
  try { seen = sessionStorage.getItem('uf-intro') === '1' } catch {}
  if (seen || prefersReducedMotion() || useRoute().path.startsWith('/admin')) return
  try { sessionStorage.setItem('uf-intro', '1') } catch {}
  intro.value = 'playing'
  show.value = true
  await nextTick()
  const { gsap } = await useGsap()
  const el = root.value!
  const tl = gsap.timeline({ onComplete: () => { show.value = false; intro.value = 'done' } })
  tl.from(el.querySelectorAll('[data-g]'), { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' })
    .from(el.querySelector('[data-line]'), { scaleX: 0, duration: 0.8, ease: 'expo.inOut' }, '-=0.6')
    .to(el.querySelector('[data-inner]'), { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.25')
    .add(() => { intro.value = 'lifting' }, '-=0.15')
    .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'expo.inOut' }, '<')
})
</script>

<template>
  <div v-if="show" ref="root" class="fixed inset-0 z-[90] grid place-items-center text-paper [background:var(--cover-soft)] [clip-path:inset(0_0_0_0)]" aria-hidden="true">
    <BrandRings class="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" />
    <div data-inner class="relative text-center">
      <div class="formula flex items-baseline justify-center gap-[0.3em] overflow-hidden text-[clamp(3rem,10vw,7rem)] leading-none">
        <span data-g>Α</span><span data-g class="text-gold-light">+</span><span data-g class="italic">β</span><span data-g class="text-gold-light">=</span><span data-g>Ω</span>
      </div>
      <span data-line class="mx-auto mt-6 block h-px w-24 origin-center bg-gold-light/80" />
      <p class="mt-5 overflow-hidden font-sans text-xs uppercase tracking-[0.4em] text-paper/80"><span data-g class="inline-block">Une Formule…</span></p>
    </div>
  </div>
</template>
