<script setup lang="ts">
/* Port Vue de « Text Reveal » (Magic UI / 21st.dev) : les mots s’allument au fil du scroll. */
const props = withDefaults(defineProps<{ text: string, tag?: string, start?: string, end?: string }>(), { tag: 'p', start: 'top 80%', end: 'bottom 45%' })
const el = ref<HTMLElement>()
const words = computed(() => props.text.split(' '))
let trigger: any

onMounted(async () => {
  const { gsap } = await useGsap()
  if (!el.value) return
  const spans = el.value.querySelectorAll('[data-w]')
  if (prefersReducedMotion()) { gsap.set(spans, { opacity: 1 }); return }
  const tween = gsap.fromTo(spans, { opacity: 0.14 }, {
    opacity: 1, ease: 'none', stagger: 0.08,
    scrollTrigger: { trigger: el.value, start: props.start, end: props.end, scrub: 0.6 }
  })
  trigger = tween.scrollTrigger
})
onBeforeUnmount(() => trigger?.kill())
</script>

<template>
  <component :is="tag" ref="el" :aria-label="text">
    <span v-for="(w, i) in words" :key="i" data-w aria-hidden="true" class="inline-block opacity-100 [.js-ready_&]:opacity-[.14]">{{ w }}&nbsp;</span>
  </component>
</template>
