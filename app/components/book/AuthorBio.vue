<script setup lang="ts">
import { AUTHOR } from '~/data/book'
/* Biographie de l’auteur, avec le titre du livre en italique. */
const [before, after] = AUTHOR.bio.split(AUTHOR.bookTitle) as [string, string?]
</script>

<template>
  <p>{{ before }}<template v-if="after !== undefined"><em>{{ AUTHOR.bookTitle }}</em>{{ after }}</template></p>
</template>
