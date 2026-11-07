<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import type { SourceEntry } from '#shared/types'
import { LEVERS } from '~/data/book'

useSeo({ title: 'À propos des sources', description: 'Les recherches citées dans le livre Une Formule, levier par levier : ce que le livre en dit et le lien vers la publication d’origine.' })

const { data } = await useFetch<{ sources: SourceEntry[] }>('/api/sources', { key: 'sources' })
const all = computed(() => data.value?.sources ?? [])

const groups = computed(() => [
  { lever: null as number | null, title: 'Le livre entier', slug: '' },
  ...LEVERS.map(l => ({ lever: l.n as number | null, title: l.title, slug: l.slug }))
].map(g => ({ ...g, items: all.value.filter(s => s.lever === g.lever) })).filter(g => g.items.length))

const hasStatus = computed(() => all.value.some(s => s.status))
const STATUS = { consultee: 'Consultée', connue: 'Non consultée, largement connue' } as const
const host = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' } }
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-40">
    <div class="container max-w-4xl">
      <header>
        <p v-reveal class="label-gold">Le livre</p>
        <UiSplitReveal tag="h1" immediate class="mt-5 font-display text-display-lg">À propos des <em class="text-caramel">sources</em>.</UiSplitReveal>
        <p v-reveal class="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink-soft">
          Chaque levier s’appuie sur des recherches nommées dans le livre. Les voici, une par une : ce que le livre en dit, et le lien vers la publication d’origine.
        </p>
        <dl v-if="hasStatus" v-reveal class="mt-8 grid gap-2 font-sans text-sm text-ink-muted sm:grid-cols-2">
          <div><dt class="inline font-medium text-ink">Consultée</dt><dd class="inline"> : publication lue par l’auteur.</dd></div>
          <div><dt class="inline font-medium text-ink">Largement connue</dt><dd class="inline"> : référence classique, non consultée directement.</dd></div>
        </dl>
      </header>

      <section v-for="g in groups" :id="g.lever ? `levier-${g.lever}` : 'livre'" :key="String(g.lever)" class="mt-16 scroll-mt-28" :aria-labelledby="`h-${g.lever ?? 'livre'}`">
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
          <h2 :id="`h-${g.lever ?? 'livre'}`" class="font-display text-[1.9rem] leading-tight">
            <span v-if="g.lever" class="mb-1.5 block font-sans text-xs uppercase tracking-[0.24em] text-caramel">Levier {{ g.lever }}</span>{{ g.title }}
          </h2>
          <NuxtLink v-if="g.slug" :to="`/les-7-leviers/${g.slug}`" class="link-underline font-sans text-sm text-ink-muted hover:text-ink">Voir le levier</NuxtLink>
        </div>
        <ul class="divide-y divide-line">
          <li v-for="s in g.items" :key="s.id" class="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 class="font-serif text-[1.2rem] font-medium leading-snug text-ink">{{ s.name }}</h3>
              <p v-if="s.reference" class="mt-1 font-sans text-[0.85rem] leading-relaxed text-ink-muted">{{ s.reference }}</p>
              <p v-if="s.claim" class="mt-2 font-serif text-[1.08rem] leading-relaxed text-ink-soft"><span class="font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">Dans le livre · </span>{{ s.claim }}</p>
            </div>
            <div class="flex flex-wrap items-start gap-2 md:flex-col md:items-end">
              <a v-if="s.url" :href="s.url" :title="host(s.url)" target="_blank" rel="noopener" class="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-white/70 px-4 font-sans text-sm text-ink transition-colors hover:border-caramel">
                Lire la source <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
              </a>
              <span v-if="s.status" class="rounded-full px-3 py-1 font-sans text-xs" :class="s.status === 'consultee' ? 'bg-ok/10 text-ok' : 'bg-gold/15 text-gold-deep'">{{ STATUS[s.status] }}</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
