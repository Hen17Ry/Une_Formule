<script setup lang="ts">
import { AUTHOR } from '~/data/book'
/* Portrait de l’auteur, dans un médaillon aux tons de la couverture. */
defineProps<{ eager?: boolean }>()
</script>

<template>
  <div class="relative mx-auto aspect-square w-full max-w-[26rem]">
    <BrandRings class="absolute inset-[-14%] h-[128%] w-[128%] opacity-70" />
    <div class="absolute inset-[10%] rounded-full p-[6px] shadow-book [background:var(--cover-soft)]">
      <img
        :src="AUTHOR.photo"
        :srcset="`${AUTHOR.photoSmall} 360w, ${AUTHOR.photo} 720w`"
        sizes="(min-width: 1024px) 22rem, 70vw"
        :alt="`Portrait de ${AUTHOR.name}`"
        width="720"
        height="720"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        class="h-full w-full rounded-full object-cover ring-1 ring-white/50"
      >
    </div>
  </div>
</template>
