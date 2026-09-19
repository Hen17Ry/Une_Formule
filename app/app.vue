<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/hero/frames/frame_0001.webp', type: 'image/webp' },
    { rel: 'preload', as: 'image', href: '/hero/frames/frame_0002.webp', type: 'image/webp' },
    { rel: 'preload', as: 'image', href: '/hero/frames/frame_0003.webp', type: 'image/webp' },
    { rel: 'preload', as: 'image', href: '/hero/frames/frame_0004.webp', type: 'image/webp' },
    { rel: 'preload', as: 'image', href: '/hero/frames/frame_0005.webp', type: 'image/webp' }
  ]
})
</script>
