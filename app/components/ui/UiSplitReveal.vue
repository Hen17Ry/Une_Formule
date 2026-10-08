<script setup lang="ts">
/* Titre révélé ligne par ligne (GSAP SplitText, masque par ligne). */
const props = withDefaults(defineProps<{ tag?: string, delay?: number, immediate?: boolean }>(), { tag: 'h2', delay: 0, immediate: false })
const el = ref<HTMLElement>()
let split: any, tween: any

onMounted(async () => {
  const { gsap, SplitText } = await useGsap()
  if (!el.value) return
  await Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 700))])
  if (prefersReducedMotion()) { el.value.style.opacity = '1'; return }
  split = SplitText.create(el.value, { type: 'lines', mask: 'lines', linesClass: 'split-line-inner' })
  el.value.style.opacity = '1'
  tween = gsap.from(split.lines, {
    yPercent: 110, duration: 1.25, ease: 'expo.out', stagger: 0.1, delay: props.delay,
    scrollTrigger: props.immediate ? undefined : { trigger: el.value, start: 'top 88%', once: true }
  })
})
onBeforeUnmount(() => { tween?.scrollTrigger?.kill(); tween?.kill(); split?.revert() })
</script>

<template>
  <component :is="tag" ref="el" class="[.js-ready_&]:opacity-0">
    <slot />
  </component>
</template>
