<script setup lang="ts">
import { BOOK } from '~/data/book'
useSeo({
  title: 'Une Formule… 7 leviers pour construire la vie que vous désirez',
  description: `${BOOK.hook} Le livre de ${BOOK.author} : extraits, retours des lecteurs et commande en ligne.`,
  path: '/',
  type: 'book'
})
</script>

<template>
  <div>
    <HomeHero />
    <HomeFormula />
    <HomeLevers />
    <HomeTitleMagic />
    <HomeExcerpt />
    <HomeAuthor />
    <HomeReviews />
    <HomeOrder />
    <HomeFaq />
  </div>
</template>
