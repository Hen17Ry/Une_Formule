<script setup lang="ts">
import { LEVERS, BOOK } from '~/data/book'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative overflow-hidden border-t border-line bg-paper-2/60 pt-20">
    <BrandRings class="pointer-events-none absolute -left-40 -top-40 h-[40rem] w-[40rem] opacity-40" />
    <div class="container relative">
      <div class="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p class="font-display text-[2.4rem] font-semibold uppercase leading-none tracking-[0.1em] text-ink">Une Formule<span class="text-caramel">…</span></p>
          <p class="mt-4 max-w-sm font-serif text-lg italic leading-relaxed text-ink-soft">« {{ BOOK.maxim }} »</p>
          <BrandFormula size="text-3xl" class="mt-6 text-umber" />
        </div>
        <div>
          <p class="label mb-5">Le livre</p>
          <ul class="space-y-3 text-[0.95rem]">
            <li><NuxtLink to="/" class="link-underline text-ink-soft hover:text-ink">Accueil</NuxtLink></li>
            <li><NuxtLink to="/les-7-leviers" class="link-underline text-ink-soft hover:text-ink">Les 7 leviers</NuxtLink></li>
            <li><NuxtLink to="/extraits" class="link-underline text-ink-soft hover:text-ink">Extraits du livre</NuxtLink></li>
            <li><NuxtLink to="/auteur" class="link-underline text-ink-soft hover:text-ink">À propos de l’auteur</NuxtLink></li>
            <li><NuxtLink to="/faq" class="link-underline text-ink-soft hover:text-ink">Questions / Réponses</NuxtLink></li>
            <li><NuxtLink to="/commander" class="link-underline text-ink-soft hover:text-ink">Commander</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="label mb-5">Retours des lecteurs</p>
          <ul class="space-y-3 text-[0.95rem]">
            <li v-for="l in LEVERS" :key="l.n">
              <NuxtLink :to="`/retours/${l.slug}`" class="link-underline text-ink-soft hover:text-ink">Levier {{ l.n }} · {{ l.short }}</NuxtLink>
            </li>
            <li><NuxtLink to="/retours/general" class="link-underline text-ink-soft hover:text-ink">Retour général</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="label mb-5">Informations</p>
          <ul class="space-y-3 text-[0.95rem]">
            <li><NuxtLink to="/avis" class="link-underline text-ink-soft hover:text-ink">Avis publiés</NuxtLink></li>
            <li><NuxtLink to="/mentions-legales" class="link-underline text-ink-soft hover:text-ink">Mentions légales & ventes</NuxtLink></li>
            <li><NuxtLink to="/admin" class="link-underline text-ink-soft hover:text-ink" rel="nofollow">Espace admin</NuxtLink></li>
          </ul>
          <p class="mt-8 text-sm leading-relaxed text-ink-muted">Paiement sécurisé par KkiaPay : Mobile Money et carte bancaire.</p>
        </div>
      </div>

      <div class="relative mt-8 select-none overflow-hidden" aria-hidden="true">
        <p class="formula translate-y-[18%] whitespace-nowrap text-center text-[17vw] leading-none text-caramel/[.12]">Α + β = Ω</p>
      </div>
    </div>
    <div class="relative border-t border-line">
      <div class="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-muted sm:flex-row">
        <p>© {{ year }} Une Formule · {{ BOOK.author }}</p>
        <p>uneformule.com</p>
      </div>
    </div>
  </footer>
</template>
