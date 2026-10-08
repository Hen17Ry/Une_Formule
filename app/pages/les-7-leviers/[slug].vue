<script setup lang="ts">
import { ArrowLeft, ArrowRight, MessageSquareQuote, FlaskConical, NotebookPen } from '@lucide/vue'
import { LEVERS, leverBySlug } from '~/data/book'

const route = useRoute()
const lever = computed(() => leverBySlug(String(route.params.slug)))
if (!lever.value) throw createError({ statusCode: 404, statusMessage: 'Levier introuvable', fatal: true })
const l = lever.value!
const prev = LEVERS.find(x => x.n === l.n - 1)
const next = LEVERS.find(x => x.n === l.n + 1)

useSeo({ title: `Levier ${l.n} : ${l.short}`, description: `${l.question} ${l.mechanism[0]}`, type: 'article' })
</script>

<template>
  <div class="relative overflow-x-clip pb-24">
    <!-- En-tête -->
    <header class="relative overflow-x-clip pb-20 pt-40">
      <div aria-hidden="true" class="absolute inset-0" :style="{ background: `radial-gradient(60% 80% at 80% 20%, ${l.color}1f, transparent 70%)` }" />
      <span aria-hidden="true" class="pointer-events-none absolute -right-10 top-16 select-none font-display text-[clamp(16rem,40vw,34rem)] leading-none text-transparent opacity-50 [-webkit-text-stroke:1.5px_var(--c)]" :style="{ '--c': l.color }">{{ l.n }}</span>
      <div class="container relative">
        <NuxtLink to="/les-7-leviers" class="inline-flex min-h-[44px] items-center gap-2 font-sans text-sm text-ink-muted hover:text-ink"><ArrowLeft class="h-4 w-4" aria-hidden="true" /> Les 7 leviers</NuxtLink>
        <div v-reveal class="mt-8 flex items-center gap-3">
          <span class="h-3 w-3 rounded-full" :style="{ background: l.color }" aria-hidden="true" />
          <p class="label">Levier {{ l.n }} sur 7</p>
        </div>
        <UiSplitReveal tag="h1" immediate class="mt-5 max-w-4xl font-display text-display-lg">{{ l.title }}</UiSplitReveal>
        <p v-reveal class="mt-8 max-w-2xl font-serif text-[1.35rem] italic leading-relaxed text-ink-soft">{{ l.question }}</p>
      </div>
    </header>

    <div class="container grid gap-16 lg:grid-cols-[1fr_20rem]">
      <article class="max-w-3xl">
        <figure v-reveal class="relative rounded-[28px] border border-line bg-white/70 p-8 shadow-soft md:p-12">
          <span aria-hidden="true" class="absolute -top-7 left-8 font-display text-[6rem] leading-none" :style="{ color: l.color }">“</span>
          <blockquote class="font-display text-[1.7rem] leading-snug text-ink md:text-[2rem]">{{ l.quote }}</blockquote>
          <figcaption class="mt-5 font-sans text-xs uppercase tracking-[0.24em] text-ink-muted">Ouverture du levier {{ l.n }}</figcaption>
        </figure>

        <section class="mt-16" aria-labelledby="mecanisme">
          <p class="label-gold">Le mécanisme</p>
          <h2 id="mecanisme" class="mt-3 font-display text-display-sm">Comment ce levier agit</h2>
          <div class="prose-book mt-6">
            <p v-for="(p, i) in l.mechanism" :key="i" v-reveal>{{ p }}</p>
            <p v-reveal>Dans l’économie du livre, ce levier <em>{{ l.role }}</em></p>
          </div>
        </section>

        <section class="mt-16" aria-labelledby="science">
          <p class="label-gold flex items-center gap-2"><FlaskConical class="h-4 w-4" aria-hidden="true" /> Le socle scientifique</p>
          <h2 id="science" class="mt-3 font-display text-display-sm">Sur quoi il s’appuie</h2>
          <p v-reveal class="prose-book mt-6">{{ l.science }}</p>
          <ul v-reveal.stagger class="mt-6 flex flex-wrap gap-2">
            <li v-for="r in l.references" :key="r" class="rounded-full border border-line bg-white/70 px-4 py-2 font-sans text-sm text-ink-soft">{{ r }}</li>
          </ul>
          <p v-if="l.echo" v-reveal class="mt-8 rounded-[22px] bg-paper-2 px-6 py-5 font-serif text-[1.05rem] leading-relaxed text-ink-soft"><span class="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">Un écho extérieur · </span>{{ l.echo }}</p>
        </section>

        <section class="mt-16" aria-labelledby="exercices">
          <p class="label-gold flex items-center gap-2"><NotebookPen class="h-4 w-4" aria-hidden="true" /> Application {{ l.n }}</p>
          <h2 id="exercices" class="mt-3 font-display text-display-sm">Les exercices</h2>
          <p v-reveal class="mt-4 font-serif text-lg italic text-ink-soft">{{ l.practice }}</p>
          <div v-reveal.stagger class="mt-8 grid gap-4 sm:grid-cols-2">
            <div v-for="e in l.exercises" :key="e.n" class="rounded-[24px] border border-line bg-white/70 p-6">
              <p class="font-sans text-xs uppercase tracking-[0.22em]" :style="{ color: l.color }">Exercice {{ e.n }}</p>
              <h3 class="mt-2 font-display text-[1.45rem] leading-tight">{{ e.title }}</h3>
              <p class="mt-3 font-serif text-[1.02rem] leading-relaxed text-ink-soft">{{ e.text }}</p>
            </div>
          </div>
          <p class="mt-6 font-sans text-sm text-ink-muted">Le déroulé complet de chaque exercice se trouve dans le livre.</p>
        </section>
      </article>

      <aside class="lg:pt-2">
        <div class="sticky top-28 space-y-4">
          <div class="rounded-[28px] p-7 text-[#FFFDF9] [background:var(--cover-soft)]">
            <MessageSquareQuote class="h-6 w-6" aria-hidden="true" />
            <p class="mt-4 font-display text-[1.7rem] leading-tight">Vous avez pratiqué ce levier ?</p>
            <p class="mt-2 font-sans text-sm text-white/90">Votre retour nourrit la prochaine édition.</p>
            <NuxtLink :to="`/retours/${l.slug}`" class="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#FFFDF9] px-5 font-sans text-sm font-medium text-umber transition-transform duration-500 ease-expo hover:-translate-y-0.5">Donner mon retour <ArrowRight class="h-4 w-4" aria-hidden="true" /></NuxtLink>
          </div>
          <div class="rounded-[28px] border border-line bg-white/70 p-7">
            <p class="font-display text-[1.5rem] leading-tight">Le livre complet</p>
            <p class="mt-2 font-sans text-sm text-ink-muted">Sept leviers, seize exercices, une section Sources.</p>
            <UiButton to="/commander" size="sm" class="mt-5">Commander</UiButton>
          </div>
        </div>
      </aside>
    </div>

    <nav class="container mt-24 grid gap-4 border-t border-line pt-10 sm:grid-cols-2" aria-label="Leviers voisins">
      <NuxtLink v-if="prev" :to="`/les-7-leviers/${prev.slug}`" class="group rounded-[24px] border border-line p-6 transition-colors hover:border-caramel">
        <span class="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted"><ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Levier {{ prev.n }}</span>
        <span class="mt-2 block font-display text-2xl">{{ prev.short }}</span>
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="next" :to="`/les-7-leviers/${next.slug}`" class="group rounded-[24px] border border-line p-6 text-right transition-colors hover:border-caramel">
        <span class="flex items-center justify-end gap-2 font-sans text-xs uppercase tracking-[0.22em] text-ink-muted">Levier {{ next.n }} <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
        <span class="mt-2 block font-display text-2xl">{{ next.short }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
