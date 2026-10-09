<script setup lang="ts">
const props = withDefaults(defineProps<{ value: number, decimals?: number, duration?: number, grouping?: boolean }>(), { decimals: 0, duration: 1.6, grouping: true })
const el = ref<HTMLElement>()
const fmt = (n: number) => n.toLocaleString('fr-FR', { useGrouping: props.grouping, minimumFractionDigits: props.decimals, maximumFractionDigits: props.decimals })
const display = ref(fmt(props.value))
let tween: any

async function run(to: number) {
  const { gsap } = await useGsap()
  if (prefersReducedMotion()) { display.value = fmt(to); return }
  const obj = { v: 0 }
  tween?.kill()
  tween = gsap.to(obj, {
    v: to, duration: props.duration, ease: 'expo.out',
    onUpdate: () => { display.value = fmt(obj.v) },
    scrollTrigger: { trigger: el.value, start: 'top 92%', once: true }
  })
}
onMounted(() => run(props.value))
watch(() => props.value, v => run(v))
onBeforeUnmount(() => { tween?.scrollTrigger?.kill(); tween?.kill() })
</script>

<template>
  <span ref="el" class="tabular-nums">{{ display }}</span>
</template>
