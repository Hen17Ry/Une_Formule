<script setup lang="ts">
import { ArrowUpRight, Mail } from '@lucide/vue'
import { BOOK } from '~/data/book'
const year = new Date().getFullYear()
const { data: shop } = useShop()
const site = [
  { to: '/les-7-leviers', label: 'Le livre' },
  { to: '/extraits', label: 'Extraits' },
  { to: '/auteur', label: 'L’auteur' },
  { to: '/faq', label: 'Questions' },
  { to: '/retours', label: 'Retours' }
]
const infos = [
  { to: '/#ou-trouver', label: 'Où trouver le livre' },
  { to: '/avis', label: 'Avis publiés' },
  { to: '/mentions-legales', label: 'Mentions légales' }
]
</script>

<template>
  <footer class="relative overflow-hidden border-t border-line bg-paper-2/60 pt-16 md:pt-20">
    <div class="container relative">
      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-14">
        <div class="sm:col-span-2 lg:col-span-1">
          <NuxtLink to="/" class="font-display text-[2.4rem] font-semibold uppercase leading-none tracking-[0.1em] text-ink" aria-label="Une Formule — accueil">Une Formule<span class="text-caramel">…</span></NuxtLink>
          <p class="mt-4 max-w-sm font-serif text-lg italic leading-relaxed text-ink-soft">« {{ BOOK.maxim }} »</p>
        </div>

        <nav aria-labelledby="footer-site">
          <p id="footer-site" class="font-sans text-[0.7rem] font-medium uppercase tracking-[0.26em] text-caramel">Le site</p>
          <ul class="mt-4">
            <li v-for="l in site" :key="l.to">
              <NuxtLink :to="l.to" class="footer-link group">
                <span class="footer-label">{{ l.label }}</span>
                <span class="footer-arrow" aria-hidden="true"><ArrowUpRight class="h-3.5 w-3.5" /></span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-infos">
          <p id="footer-infos" class="font-sans text-[0.7rem] font-medium uppercase tracking-[0.26em] text-caramel">Informations</p>
          <ul class="mt-4">
            <li v-for="l in infos" :key="l.to">
              <NuxtLink :to="l.to" class="footer-link group">
                <span class="footer-label">{{ l.label }}</span>
                <span class="footer-arrow" aria-hidden="true"><ArrowUpRight class="h-3.5 w-3.5" /></span>
              </NuxtLink>
            </li>
            <li v-if="shop?.contactEmail">
              <a :href="`mailto:${shop.contactEmail}`" class="footer-link group">
                <span class="footer-label">{{ shop.contactEmail }}</span>
                <span class="footer-arrow" aria-hidden="true"><Mail class="h-3.5 w-3.5" /></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="relative mt-14 border-t border-line">
      <div class="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-muted sm:flex-row">
        <p>© {{ year }} Une Formule · {{ BOOK.author }}</p>
        <p>uneformule.com</p>
      </div>
      <!-- Place pour la barre d’onglets mobile -->
      <div aria-hidden="true" class="h-[var(--tabbar)] lg:hidden" />
    </div>
  </footer>
</template>

<style scoped>
/* Liens clairement cliquables : soulignés, avec une flèche dans une pastille qui s’anime au survol. */
.footer-link {
  display: inline-flex; align-items: center; gap: .65rem;
  min-height: 44px; padding: .15rem 0;
  font-family: 'Jost Variable', system-ui, sans-serif; font-size: 1rem; color: #2E1F15;
  -webkit-tap-highlight-color: transparent;
}
.footer-label {
  text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 6px;
  text-decoration-color: rgba(163, 107, 67, .45);
  transition: color .3s ease, text-decoration-color .3s ease;
}
.footer-arrow {
  display: grid; place-items: center; width: 1.6rem; height: 1.6rem; flex-shrink: 0;
  border-radius: 9999px; border: 1px solid rgba(163, 107, 67, .35); color: #A36B43; background: rgba(255, 253, 249, .7);
  transition: transform .5s cubic-bezier(.16, 1, .3, 1), background-color .3s ease, color .3s ease, border-color .3s ease;
}
.footer-link:hover .footer-label, .footer-link:focus-visible .footer-label { color: #8A5530; text-decoration-color: #A36B43; }
.footer-link:hover .footer-arrow, .footer-link:focus-visible .footer-arrow { background: #8A5530; border-color: #8A5530; color: #FFFDF9; transform: translate(2px, -2px); }
.footer-link.router-link-exact-active .footer-label { color: #8A5530; text-decoration-color: #A36B43; }
@media (prefers-reduced-motion: reduce) { .footer-arrow { transition: none; } }
</style>
