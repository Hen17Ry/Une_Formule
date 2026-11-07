<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { EXCERPTS } from '~/data/book'

const route = useRoute()
const found = EXCERPTS.find(e => e.path === `/le-livre/${route.params.slug}`)
if (!found) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
const text = found!
const i = EXCERPTS.indexOf(text)
const prev = EXCERPTS[i - 1]
const next = EXCERPTS[i + 1]

const first = text.blocks.find(b => b.k === 'p')!.t
useSeo({ title: text.title, description: first.length > 155 ? `${first.slice(0, 152).replace(/\s+\S*$/, '')}…` : first, type: 'article' })

/* Barre de progression de lecture */
const wrap = ref<HTMLElement>()
const progress = ref(0)
function onScroll() {
  const el = wrap.value
  if (!el) return
  const r = el.getBoundingClientRect()
  progress.value = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height))
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-36">
    <div class="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-caramel" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
    <BrandRings class="pointer-events-none absolute -right-56 -top-32 h-[46rem] w-[46rem] opacity-40" />
    <div class="container relative">
      <nav class="mx-auto flex max-w-3xl items-center justify-center gap-2 font-sans text-sm text-ink-muted" aria-label="Fil d’Ariane">
        <NuxtLink to="/les-7-leviers" class="hover:text-ink">Le livre</NuxtLink>
        <span aria-hidden="true">/</span>
        <span class="text-ink">{{ text.menu }}</span>
      </nav>

      <div ref="wrap" class="mx-auto mt-8 max-w-3xl">
        <BookTextArticle :text="text" heading="h1" />
      </div>

      <nav class="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2" aria-label="Pages du livre">
        <NuxtLink :to="prev ? prev.path : '/les-7-leviers'" class="group rounded-[24px] border border-line p-6 transition-colors hover:border-caramel">
          <span class="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted"><ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Précédent</span>
          <span class="mt-2 block font-display text-2xl">{{ prev ? prev.menu : 'Les 7 leviers' }}</span>
        </NuxtLink>
        <NuxtLink :to="next ? next.path : '/les-7-leviers'" class="group rounded-[24px] border border-line p-6 text-right transition-colors hover:border-caramel">
          <span class="flex items-center justify-end gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted">Suivant <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
          <span class="mt-2 block font-display text-2xl">{{ next ? next.menu : 'Les 7 leviers' }}</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
