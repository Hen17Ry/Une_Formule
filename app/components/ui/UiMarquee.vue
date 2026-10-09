<script setup lang="ts">
/* Port Vue du composant « Marquee » (Magic UI / 21st.dev) — défilement infini, pause au survol. */
withDefaults(defineProps<{ reverse?: boolean, duration?: string, gap?: string, repeat?: number, pauseOnHover?: boolean }>(), {
  duration: '60s', gap: '1.25rem', repeat: 2, pauseOnHover: true
})
</script>

<template>
  <div
    class="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    :style="{ '--duration': duration, '--gap': gap, gap }"
  >
    <div
      v-for="i in repeat"
      :key="i"
      :aria-hidden="i > 1 || undefined"
      class="flex shrink-0 items-stretch motion-reduce:animate-none"
      :class="[reverse ? 'animate-marquee-rev' : 'animate-marquee', pauseOnHover && 'group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]']"
      :style="{ gap }"
    >
      <slot />
    </div>
  </div>
</template>
