<script setup lang="ts">
import { BOOK } from '~/data/book'
useSeo({ title: 'Mentions légales', description: 'Mentions légales du site uneformule.com.' })
const { data: shop } = await useShop()
</script>

<template>
  <div class="pb-28 pt-40">
    <div class="container max-w-3xl">
      <p class="label-gold">Informations</p>
      <h1 class="mt-5 font-display text-display-md">Mentions légales</h1>
      <div class="prose-book mt-12 space-y-10">
        <section>
          <h2 class="font-display text-3xl text-ink">Auteur et responsable du site</h2>
          <p class="mt-3">Le site uneformule.com présente le livre <em>Une Formule… 7 leviers pour construire la vie que vous désirez</em>, de {{ BOOK.author }}, Cotonou, Bénin.</p>
          <p v-if="shop?.isbn">ISBN : {{ shop.isbn }}</p>
        </section>
        <section v-if="shop?.contactEmail">
          <h2 class="font-display text-3xl text-ink">Contact</h2>
          <p class="mt-3"><a :href="`mailto:${shop.contactEmail}`" class="link-underline">{{ shop.contactEmail }}</a></p>
        </section>
        <section>
          <h2 class="font-display text-3xl text-ink">Hébergement</h2>
          <p class="mt-3">Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>
        </section>
        <section>
          <h2 class="font-display text-3xl text-ink">Données personnelles</h2>
          <p class="mt-3">Les retours de lecteurs ne sont publiés qu’avec l’accord explicite de leur auteur, anonymement ou avec son seul prénom. L’adresse email, facultative, n’est jamais publiée : elle sert uniquement à recontacter le lecteur si besoin.</p>
        </section>
      </div>
    </div>
  </div>
</template>
