import type { gsap as GSAP } from 'gsap'
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import type { SplitText as SPLIT } from 'gsap/SplitText'

let loaded: Promise<{ gsap: typeof GSAP, ScrollTrigger: typeof ST, SplitText: typeof SPLIT }> | null = null

/** Charge GSAP + plugins une seule fois, côté client. */
export function useGsap() {
  if (!loaded) {
    loaded = Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([g, s, t]) => {
      g.gsap.registerPlugin(s.ScrollTrigger, t.SplitText)
      g.gsap.defaults({ ease: 'expo.out' })
      return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger, SplitText: t.SplitText }
    })
  }
  return loaded
}

export function prefersReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
