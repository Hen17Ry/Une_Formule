<script setup lang="ts">
import { BOOK } from '~/data/book'
const year = new Date().getFullYear()
const { data: shop } = useShop()
const links = [
  { to: '/les-7-leviers', label: 'Le livre' },
  { to: '/extraits', label: 'Extraits' },
  { to: '/auteur', label: 'L’auteur' },
  { to: '/faq', label: 'Questions' },
  { to: '/retours', label: 'Retours' }
]
</script>

<template>
  <footer class="relative overflow-hidden border-t border-line bg-paper-2/60 pt-16 md:pt-20">
    <div class="container relative">
      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-14">
        <div class="sm:col-span-2 lg:col-span-1">
          <p class="font-display text-[2.4rem] font-semibold uppercase leading-none tracking-[0.1em] text-ink">Une Formule<span class="text-caramel">…</span></p>
          <p class="mt-4 max-w-sm font-serif text-lg italic leading-relaxed text-ink-soft">« {{ BOOK.maxim }} »</p>
        </div>
        <nav aria-label="Pied de page">
          <ul class="space-y-3 text-[0.95rem]">
            <li v-for="l in links" :key="l.to"><NuxtLink :to="l.to" class="link-underline text-ink-soft hover:text-ink">{{ l.label }}</NuxtLink></li>
          </ul>
        </nav>
        <div>
          <ul class="space-y-3 text-[0.95rem]">
            <li><NuxtLink to="/#ou-trouver" class="link-underline text-ink-soft hover:text-ink">Où trouver le livre</NuxtLink></li>
            <li><NuxtLink to="/avis" class="link-underline text-ink-soft hover:text-ink">Avis publiés</NuxtLink></li>
            <li><NuxtLink to="/mentions-legales" class="link-underline text-ink-soft hover:text-ink">Mentions légales</NuxtLink></li>
            <li v-if="shop?.contactEmail"><a :href="`mailto:${shop.contactEmail}`" class="link-underline text-ink-soft hover:text-ink">{{ shop.contactEmail }}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="relative mt-14 border-t border-line">
      <div class="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-muted sm:flex-row">
        <p>© {{ year }} Une Formule · {{ BOOK.author }}</p>
        <p>uneformule.com</p>
      </div>
    </div>
  </footer>
</template>
