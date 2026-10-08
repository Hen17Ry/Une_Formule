<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { leverBySlug } from '~/data/book'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const lever = computed(() => slug.value === 'general' ? null : leverBySlug(slug.value))
if (slug.value !== 'general' && !lever.value) throw createError({ statusCode: 404, statusMessage: 'Levier introuvable', fatal: true })

const title = computed(() => lever.value ? `Retour sur le Levier ${lever.value.n} : ${lever.value.short}` : 'Retour général sur le livre')
useSeo({
  title: title.value,
  description: lever.value ? `Partagez ce que le levier « ${lever.value.short} » a changé pour vous.` : 'Partagez ce que le livre Une Formule a changé, concrètement, dans votre vie.'
})
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-36">
    <div aria-hidden="true" class="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(70%_100%_at_50%_0%,#f4e7d6,transparent)]" />
    <BrandRings class="pointer-events-none absolute -left-56 -top-20 h-[44rem] w-[44rem] opacity-40" />
    <div class="container relative max-w-5xl">
      <NuxtLink to="/retours" class="inline-flex min-h-[44px] items-center gap-2 font-sans text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft class="h-4 w-4" aria-hidden="true" /> Tous les formulaires
      </NuxtLink>

      <header class="mt-8 max-w-3xl">
        <div v-reveal class="flex items-center gap-3">
          <span v-if="lever" class="grid h-10 w-10 place-items-center rounded-full font-display text-lg text-[#FFFDF9]" :style="{ background: lever.color }" aria-hidden="true">{{ lever.n }}</span>
          <p class="label-gold">{{ lever ? `Levier ${lever.n}` : 'Le livre en entier' }}</p>
        </div>
        <h1 class="mt-5 font-display text-display-md">
          <template v-if="lever">Retour sur le Levier {{ lever.n }} : <em class="text-caramel">{{ lever.short }}</em></template>
          <template v-else>Retour <em class="text-caramel">général</em></template>
        </h1>
        <p v-if="lever" v-reveal class="mt-6 border-l-2 pl-5 font-serif text-[1.15rem] italic leading-relaxed text-ink-soft" :style="{ borderColor: lever.color }">« {{ lever.quote }} »</p>
        <p v-else v-reveal class="mt-6 font-serif text-[1.2rem] leading-relaxed text-ink-soft">Indépendamment de tout levier précis : ce que le livre vous a apporté, ce que vous aimeriez y trouver demain.</p>
      </header>

      <div class="mt-14">
        <FeedbackForm :lever="lever" />
      </div>
    </div>
  </div>
</template>
