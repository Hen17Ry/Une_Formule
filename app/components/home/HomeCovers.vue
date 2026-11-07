<script setup lang="ts">
import { Maximize2, X, RotateCcw } from '@lucide/vue'
import { BACK_COVER, BOOK } from '~/data/book'

/*
 * « Recto, verso » : la première et la quatrième de couverture.
 * Ordinateur : le livre se retourne au fil du défilement (section collante).
 * Mobile : on touche le livre pour le retourner.
 * Un clic sur « Agrandir » ouvre la couverture en grand.
 */
type Side = 'front' | 'back'
const FRONT = { src: '/images/couverture.webp?v=8', sm: '/images/couverture-sm.webp?v=8', hd: '/images/couverture-hd.webp', alt: 'Première de couverture : Une Formule… 7 leviers pour construire la vie que vous désirez, Α + β = Ω, Dieudonné Gossou' }
const BACK = { src: '/images/quatrieme.webp', sm: '/images/quatrieme-sm.webp', hd: '/images/quatrieme-hd.webp', alt: 'Quatrième de couverture : Quand l’intuition et la rationalité se rejoignent' }

const root = ref<HTMLElement>()
const scrollMode = ref(false)   // ordinateur, animations autorisées
const rot = ref(-18)            // rotation du livre (degrés)
const tilt = reactive({ x: 0, y: 0 })
const side = computed<Side>(() => {
  const a = ((rot.value % 360) + 360) % 360
  return a > 90 && a < 270 ? 'back' : 'front'
})
const shadowScale = computed(() => 0.5 + 0.5 * Math.abs(Math.cos((rot.value * Math.PI) / 180)))

/* ── Mobile / mouvement réduit : bascule au toucher ── */
function flip(to?: Side) {
  const target = to ?? (side.value === 'front' ? 'back' : 'front')
  if (scrollMode.value) return scrollToSide(target)
  rot.value = target === 'back' ? 180 - 14 : -14
}

/* ── Ordinateur : position de défilement correspondant à une face ── */
function scrollToSide(target: Side) {
  const el = root.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  const y = top + (el.offsetHeight - window.innerHeight) * (target === 'back' ? 0.82 : 0.05)
  const lenis = (useNuxtApp().$lenis as any)?.()
  lenis ? lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: 'smooth' })
}

/* ── Légère inclinaison au survol (souris) ── */
function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tilt.y = ((e.clientX - r.left) / r.width - 0.5) * 16
  tilt.x = -((e.clientY - r.top) / r.height - 0.5) * 10
}
function onLeave() { tilt.x = 0; tilt.y = 0 }

/* ── Agrandissement ── */
const zoom = ref<Side | null>(null)
const closeBtn = ref<HTMLButtonElement>()
let lastFocus: HTMLElement | null = null
const { $stopScroll, $startScroll } = useNuxtApp()
function openZoom(s: Side = side.value) {
  lastFocus = document.activeElement as HTMLElement
  zoom.value = s
  ;($stopScroll as any)?.()
  nextTick(() => closeBtn.value?.focus())
}
function closeZoom() {
  zoom.value = null
  ;($startScroll as any)?.()
  lastFocus?.focus()
}
function onKey(e: KeyboardEvent) {
  if (!zoom.value) return
  if (e.key === 'Escape') closeZoom()
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') zoom.value = zoom.value === 'front' ? 'back' : 'front'
}

let mm: any
onMounted(async () => {
  window.addEventListener('keydown', onKey)
  if (prefersReducedMotion()) { rot.value = -14; return }
  const { gsap, ScrollTrigger } = await useGsap()
  mm = gsap.matchMedia()
  mm.add('(min-width: 1024px)', () => {
    scrollMode.value = true
    let tween: any
    // La section s’allonge d’abord (240vh), puis on mesure le défilement.
    nextTick(() => {
      const state = { r: -18 }
      tween = gsap.to(state, {
        r: 198,
        ease: 'power1.inOut',
        onUpdate: () => { rot.value = state.r },
        scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.9 }
      })
      ScrollTrigger.refresh()
    })
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); scrollMode.value = false; rot.value = -14 }
  })
  mm.add('(max-width: 1023px)', () => { rot.value = -14 })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  mm?.revert()
  if (zoom.value) ($startScroll as any)?.()
})

const bookStyle = computed(() => ({ transform: `rotateX(${6 + tilt.x}deg) rotateY(${rot.value + tilt.y}deg)` }))
</script>

<template>
  <section id="couverture" ref="root" class="relative" :class="scrollMode && 'h-[240vh]'" aria-labelledby="couverture-title">
    <div class="relative overflow-hidden" :class="scrollMode ? 'sticky top-0 flex h-[100svh] items-center' : 'py-24 md:py-32'">
      <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_50%,#f3e2cc_0%,rgba(251,247,241,0)_70%)]" />
      <BrandRings class="pointer-events-none absolute -left-40 top-1/2 h-[52rem] w-[52rem] -translate-y-1/2 opacity-50" />

      <div class="container relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <!-- Le livre -->
        <div class="flex flex-col items-center">
          <div class="cover-stage relative [perspective:1800px]" @pointermove="onMove" @pointerleave="onLeave">
            <button
              type="button"
              class="book relative block [transform-style:preserve-3d] motion-safe:transition-transform"
              :class="scrollMode ? 'duration-200 ease-out' : 'duration-[1100ms] ease-in-out-expo'"
              :style="bookStyle"
              :aria-label="scrollMode ? `Agrandir la ${side === 'front' ? 'première' : 'quatrième'} de couverture` : 'Retourner le livre'"
              @click="scrollMode ? openZoom() : flip()"
            >
              <span class="face front">
                <img :src="FRONT.src" :srcset="`${FRONT.sm} 520w, ${FRONT.src} 1000w`" sizes="(min-width: 1024px) 340px, 250px" :alt="FRONT.alt" width="1000" height="1419" loading="lazy" decoding="async">
                <span class="gloss" aria-hidden="true" />
                <span class="hinge hinge-left" aria-hidden="true" />
              </span>
              <span class="face back">
                <img :src="BACK.src" :srcset="`${BACK.sm} 520w, ${BACK.src} 1000w`" sizes="(min-width: 1024px) 340px, 250px" :alt="BACK.alt" width="1000" height="1419" loading="lazy" decoding="async">
                <span class="gloss" aria-hidden="true" />
                <span class="hinge hinge-right" aria-hidden="true" />
              </span>
              <span class="spine" aria-hidden="true">
                <span class="spine-title">UNE FORMULE…</span>
                <span class="spine-author">DIEUDONNÉ GOSSOU</span>
              </span>
              <span class="edge edge-right" aria-hidden="true" />
              <span class="edge edge-top" aria-hidden="true" />
              <span class="edge edge-bottom" aria-hidden="true" />
            </button>
          </div>
          <span aria-hidden="true" class="mt-10 block h-6 w-[240px] rounded-[50%] bg-umber/25 blur-xl transition-transform duration-300 lg:w-[300px]" :style="{ transform: `scaleX(${shadowScale})` }" />

          <!-- Commandes -->
          <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
            <div class="flex rounded-full border border-line bg-white/70 p-1 shadow-soft backdrop-blur" role="group" aria-label="Face affichée">
              <button
                v-for="s in (['front', 'back'] as const)"
                :key="s"
                type="button"
                class="min-h-[40px] rounded-full px-4 font-sans text-[0.85rem] transition-colors duration-300"
                :class="side === s ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'"
                :aria-pressed="side === s"
                @click="flip(s)"
              >
                {{ s === 'front' ? 'Première' : 'Quatrième' }}
              </button>
            </div>
            <button type="button" class="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line bg-white/70 px-4 font-sans text-[0.85rem] text-ink-soft shadow-soft transition-colors hover:text-ink" @click="openZoom()">
              <Maximize2 class="h-4 w-4" aria-hidden="true" /> Agrandir
            </button>
          </div>
          <p class="mt-4 flex items-center gap-1.5 font-sans text-xs text-ink-muted">
            <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
            <span class="lg:hidden">Touchez le livre pour le retourner</span>
            <span class="hidden lg:inline">{{ scrollMode ? 'Faites défiler pour retourner le livre' : 'Cliquez sur le livre pour le retourner' }}</span>
          </p>
        </div>

        <!-- Le texte de la face visible -->
        <div class="relative">
          <p class="label-gold">Le livre, recto verso</p>
          <h2 id="couverture-title" class="mt-4 font-display text-display-md">
            <Transition mode="out-in" enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition duration-200" leave-to-class="opacity-0 -translate-y-2">
              <span :key="side" class="block">{{ side === 'front' ? 'Première' : 'Quatrième' }}<br>de couverture</span>
            </Transition>
          </h2>

          <!-- Les deux textes occupent la même cellule : la hauteur reste stable quand on retourne le livre. -->
          <div class="relative mt-8 grid">
              <!-- Recto -->
              <div class="panel [grid-area:1/1]" :class="side === 'front' ? 'is-on' : 'is-off'" :aria-hidden="side !== 'front'">
                <p class="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-semibold uppercase leading-[0.95] tracking-[0.04em] text-ink">Une Formule<span class="text-caramel">…</span></p>
                <p class="mt-5 font-sans text-[0.8rem] uppercase tracking-[0.32em] text-caramel">7 leviers pour</p>
                <p class="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] uppercase leading-tight text-ink">Construire la vie que vous désirez</p>
                <p class="formula mt-6 text-[clamp(2.2rem,3.6vw,3rem)] leading-none text-ink" aria-label="Alpha plus bêta égale oméga">Α <span class="text-gold">+</span> <em class="text-caramel">β</em> <span class="text-gold">=</span> Ω</p>
                <p class="mt-7 font-sans text-[0.8rem] uppercase tracking-[0.3em] text-ink-muted">{{ BOOK.author }}</p>
              </div>
              <!-- Verso, tel qu’imprimé -->
              <div class="panel [grid-area:1/1] font-serif text-[clamp(0.98rem,1.85vh,1.08rem)] leading-[1.6] text-ink-soft" :class="side === 'back' ? 'is-on' : 'is-off'" :aria-hidden="side !== 'back'">
                <p class="font-sans text-[1.15rem] font-semibold leading-snug text-copper">{{ BACK_COVER.heading }}</p>
                <p class="mt-4"><em>{{ BACK_COVER.intro }}</em> {{ BACK_COVER.text }}</p>
                <p class="mt-3">{{ BACK_COVER.key }}</p>
                <p class="formula my-3 text-center text-[1.9rem] leading-none text-ink" aria-label="Alpha plus bêta égale oméga">Α <span class="text-gold">+</span> <em class="text-caramel">β</em> <span class="text-gold">=</span> Ω</p>
                <ul class="space-y-1">
                  <li v-for="t in BACK_COVER.terms" :key="t.sym" class="flex gap-2"><span class="text-caramel" aria-hidden="true">•</span><span><strong class="font-semibold text-ink">{{ t.sym }}</strong>{{ t.text }}</span></li>
                </ul>
                <p class="mt-4">{{ BACK_COVER.closing }} <em class="text-caramel">{{ BACK_COVER.quote }}</em></p>
                <p class="mt-4 border-b border-caramel/50 pb-4 text-center font-semibold text-copper">{{ BACK_COVER.call }}</p>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agrandissement -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0" leave-active-class="transition duration-300" leave-to-class="opacity-0">
        <div v-if="zoom" class="fixed inset-0 z-[80] flex flex-col bg-paper/95 backdrop-blur-xl" role="dialog" aria-modal="true" :aria-label="zoom === 'front' ? 'Première de couverture' : 'Quatrième de couverture'" data-lenis-prevent @click.self="closeZoom">
          <div class="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
            <div class="flex rounded-full border border-line bg-white/80 p-1" role="group" aria-label="Face affichée">
              <button v-for="s in (['front', 'back'] as const)" :key="s" type="button" class="min-h-[40px] rounded-full px-4 font-sans text-[0.85rem] transition-colors" :class="zoom === s ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'" :aria-pressed="zoom === s" @click="zoom = s">
                {{ s === 'front' ? 'Première' : 'Quatrième' }}
              </button>
            </div>
            <button ref="closeBtn" type="button" class="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/80 text-ink hover:border-caramel" aria-label="Fermer" @click="closeZoom"><X class="h-5 w-5" aria-hidden="true" /></button>
          </div>
          <div class="flex min-h-0 flex-1 items-center justify-center overflow-auto px-4 pb-8" @click.self="closeZoom">
            <Transition mode="out-in" enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 scale-[.97]" leave-active-class="transition duration-150" leave-to-class="opacity-0">
              <img :key="zoom" :src="zoom === 'front' ? FRONT.hd : BACK.hd" :alt="zoom === 'front' ? FRONT.alt : BACK.alt" class="max-h-full w-auto max-w-full rounded-[4px] object-contain shadow-book" width="1600" height="2270">
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.cover-stage { --w: 250px; --h: calc(var(--w) * 1.419); --d: calc(var(--w) * 0.13); }
@media (min-width: 1024px) { .cover-stage { --w: 340px; } }
.book { width: var(--w); height: var(--h); cursor: pointer; }
.face { position: absolute; inset: 0; overflow: hidden; border-radius: 2px 5px 5px 2px; backface-visibility: hidden; -webkit-backface-visibility: hidden; box-shadow: 0 30px 60px -30px rgba(74, 44, 22, .55); }
.face img { display: block; width: 100%; height: 100%; object-fit: cover; }
.front { transform: translateZ(calc(var(--d) / 2)); }
.back { transform: rotateY(180deg) translateZ(calc(var(--d) / 2)); border-radius: 5px 2px 2px 5px; }
.gloss { position: absolute; inset: 0; background: linear-gradient(115deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 70%, rgba(255,255,255,.08) 100%); pointer-events: none; }
.hinge { position: absolute; top: 0; bottom: 0; width: 7%; pointer-events: none; }
.hinge-left { left: 0; background: linear-gradient(90deg, rgba(40,22,10,.35), rgba(255,255,255,.12) 35%, transparent); }
.hinge-right { right: 0; background: linear-gradient(270deg, rgba(40,22,10,.22), rgba(255,255,255,.1) 35%, transparent); }
.spine {
  position: absolute; top: 0; left: calc(50% - var(--d) / 2); width: var(--d); height: 100%;
  transform: rotateY(-90deg) translateZ(calc(var(--w) / 2));
  background: linear-gradient(90deg, #7e5029, #b07a48 45%, #9c6838 70%, #74482a);
  display: flex; align-items: center; justify-content: space-between; flex-direction: column; padding: 9% 0;
  writing-mode: vertical-rl;
}
.spine-title { font-family: 'EB Garamond Variable', Georgia, serif; font-weight: 700; color: #fcf0de; font-size: calc(var(--d) * 0.42); letter-spacing: .02em; }
.spine-author { font-family: 'EB Garamond Variable', Georgia, serif; font-weight: 600; color: #22160e; font-size: calc(var(--d) * 0.2); letter-spacing: .18em; }
.panel { transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1), visibility 0s; }
.panel.is-off { opacity: 0; transform: translateY(14px); visibility: hidden; pointer-events: none; transition: opacity .25s ease, transform .25s ease, visibility 0s .25s; }
@media (prefers-reduced-motion: reduce) { .panel, .panel.is-off { transition: none; transform: none; } }
.edge { position: absolute; background: repeating-linear-gradient(90deg, #f6efe3 0 2px, #e2d4bf 2px 3px); }
.edge-right { top: 1.2%; left: calc(50% - var(--d) / 2); width: var(--d); height: 97.6%; transform: rotateY(90deg) translateZ(calc(var(--w) / 2 - 2px)); }
.edge-top, .edge-bottom { left: 1%; width: 97%; height: var(--d); top: calc(50% - var(--d) / 2); background: repeating-linear-gradient(0deg, #f6efe3 0 2px, #e2d4bf 2px 3px); }
.edge-top { transform: rotateX(90deg) translateZ(calc(var(--h) / 2 - 2px)); }
.edge-bottom { transform: rotateX(-90deg) translateZ(calc(var(--h) / 2 - 2px)); }
</style>
