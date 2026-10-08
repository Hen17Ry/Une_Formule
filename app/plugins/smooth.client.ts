import Lenis from 'lenis'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { gsap, ScrollTrigger } = await useGsap()
  // Les éléments animés ne sont masqués qu’une fois GSAP chargé : sans JS, tout reste lisible.
  document.documentElement.classList.add('js-ready')

  const route = useRoute()
  let lenis: Lenis | null = null

  const start = () => {
    if (lenis || prefersReducedMotion() || route.path.startsWith('/admin')) return
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
  }
  const stop = () => {
    if (!lenis) return
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
  function raf(time: number) { lenis?.raf(time * 1000) }

  start()

  // Remonter en haut à chaque changement de page, après la transition de sortie.
  nuxtApp.hook('page:transition:finish', () => {
    if (route.path.startsWith('/admin')) stop()
    else start()
    if (!route.hash) {
      lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    } else {
      const target = document.querySelector(route.hash)
      if (target) lenis ? lenis.scrollTo(target as HTMLElement, { offset: -90 }) : target.scrollIntoView()
    }
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  window.addEventListener('load', () => ScrollTrigger.refresh())
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return { provide: { lenis: () => lenis, stopScroll: () => lenis?.stop(), startScroll: () => lenis?.start() } }
})
