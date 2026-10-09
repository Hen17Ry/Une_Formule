<script setup lang="ts">
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      'name': 'Une Formule… 7 leviers pour construire la vie que vous désirez',
      'author': { '@type': 'Person', 'name': 'Dieudonné Sossa Gossou' },
      'inLanguage': 'fr',
      'genre': 'Développement personnel',
      'image': 'https://www.uneformule.com/images/couverture.webp'
    })
  }]
})
</script>

<template>
  <div class="relative">
    <a href="#contenu" class="skip-link">Aller au contenu</a>
    <NavIntroCurtain />
    <NavSiteNav />
    <main id="contenu" class="relative">
      <slot />
    </main>
    <NavSiteFooter />
  </div>
</template>
