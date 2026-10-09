import type { Directive } from 'vue'

/**
 * v-reveal : révélation au scroll (GSAP ScrollTrigger côté client, neutre côté serveur).
 *   v-reveal            → fondu + translation
 *   v-reveal="'fade'"   → fondu seul
 *   v-reveal.stagger    → anime les enfants directs en cascade
 *   v-reveal:delay="0.2"
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reveal: Directive<HTMLElement, string | number | undefined> = {
    getSSRProps(binding) {
      return binding.modifiers.stagger ? { 'data-reveal-stagger': '' } : { 'data-reveal': typeof binding.value === 'string' ? binding.value : '' }
    },
    async mounted(el, binding) {
      if (import.meta.server) return
      const { gsap, ScrollTrigger } = await useGsap()
      const targets = binding.modifiers.stagger ? Array.from(el.children) as HTMLElement[] : [el]
      if (binding.modifiers.stagger) el.setAttribute('data-reveal-stagger', '')
      else el.setAttribute('data-reveal', typeof binding.value === 'string' ? binding.value : '')

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 })
        return
      }
      const delay = binding.arg === 'delay' ? Number(binding.value) || 0 : 0
      const tween = gsap.to(targets, {
        opacity: 1, y: 0, scale: 1,
        duration: 1.1,
        ease: 'expo.out',
        delay,
        stagger: binding.modifiers.stagger ? 0.09 : 0,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      })
      ;(el as any).__reveal = tween
      ScrollTrigger.refresh()
    },
    unmounted(el) {
      const t = (el as any).__reveal
      t?.scrollTrigger?.kill()
      t?.kill()
    }
  }
  nuxtApp.vueApp.directive('reveal', reveal)
})
