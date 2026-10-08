<script setup lang="ts" generic="T extends string">
/* Choix unique en pastilles avec indicateur glissant. */
const props = defineProps<{ modelValue: T | null, options: { value: T, label: string }[], name: string, invalid?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [T] }>()
const wrap = ref<HTMLElement>()
const indicator = reactive({ x: 0, w: 0, y: 0, h: 0, visible: false })

function place() {
  const idx = props.options.findIndex(o => o.value === props.modelValue)
  const label = wrap.value?.querySelectorAll('label')[idx] as HTMLElement | undefined
  if (!label) { indicator.visible = false; return }
  Object.assign(indicator, { x: label.offsetLeft, y: label.offsetTop, w: label.offsetWidth, h: label.offsetHeight, visible: true })
}
watch(() => props.modelValue, () => nextTick(place))
onMounted(() => { place(); window.addEventListener('resize', place) })
onBeforeUnmount(() => window.removeEventListener('resize', place))
</script>

<template>
  <div ref="wrap" role="radiogroup" class="relative inline-flex flex-wrap gap-1 rounded-[22px] border border-line bg-white/60 p-1.5" :class="invalid && 'border-danger/60'">
    <span
      aria-hidden="true"
      class="absolute rounded-full bg-copper shadow-[0_8px_20px_-10px_rgba(113,67,36,.8)] transition-all duration-500 ease-expo"
      :style="{ transform: `translate(${indicator.x - 6}px, ${indicator.y - 6}px)`, width: `${indicator.w}px`, height: `${indicator.h}px`, opacity: indicator.visible ? 1 : 0, left: '6px', top: '6px' }"
    />
    <label
      v-for="o in options"
      :key="o.value"
      class="relative z-10 inline-flex min-h-[44px] items-center rounded-full px-5 py-2 font-sans text-[0.95rem] transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper has-[:focus-visible]:ring-offset-2"
      :class="modelValue === o.value ? 'text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'"
    >
      <input class="sr-only" type="radio" :name="name" :value="o.value" :checked="modelValue === o.value" @change="emit('update:modelValue', o.value)">
      {{ o.label }}
    </label>
  </div>
</template>
