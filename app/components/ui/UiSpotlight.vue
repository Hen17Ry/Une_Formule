<script setup lang="ts">
/* Carte « spotlight » (21st.dev) : un halo doré suit le curseur. */
withDefaults(defineProps<{ tag?: string, color?: string }>(), { tag: 'div', color: 'rgba(196,144,103,.20)' })
const el = ref<HTMLElement>()
function move(e: PointerEvent) {
  const node = (el.value as any)?.$el ?? el.value
  if (!node) return
  const r = node.getBoundingClientRect()
  node.style.setProperty('--mx', `${e.clientX - r.left}px`)
  node.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<template>
  <component :is="tag" ref="el" class="group/spot relative isolate overflow-hidden" @pointermove="move">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -inset-px -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      :style="{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 65%)` }"
    />
    <slot />
  </component>
</template>
