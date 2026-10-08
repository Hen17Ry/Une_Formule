<script setup lang="ts">
import { Star } from '@lucide/vue'

const props = withDefaults(defineProps<{ modelValue: number, labels?: string[], name?: string, invalid?: boolean }>(), { name: 'rating' })
const emit = defineEmits<{ 'update:modelValue': [number] }>()
const hover = ref(0)
const shown = computed(() => hover.value || props.modelValue)
</script>

<template>
  <div>
    <div role="radiogroup" class="flex items-center gap-1.5" :aria-invalid="invalid || undefined" @pointerleave="hover = 0">
      <label
        v-for="n in 5"
        :key="n"
        class="group relative grid h-12 w-12 place-items-center rounded-full transition-transform duration-300 ease-expo hover:scale-110 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper"
        @pointerenter="hover = n"
      >
        <input class="sr-only" type="radio" :name="name" :value="n" :checked="modelValue === n" @change="emit('update:modelValue', n)">
        <span class="sr-only">{{ n }} sur 5{{ labels?.[n - 1] ? ` — ${labels[n - 1]}` : '' }}</span>
        <Star
          aria-hidden="true"
          :stroke-width="1.4"
          class="h-8 w-8 transition-all duration-300"
          :class="n <= shown ? 'fill-gold text-gold-deep scale-100' : 'fill-transparent text-ink/25'"
        />
      </label>
    </div>
    <p class="mt-2 h-5 font-sans text-sm text-ink-muted" aria-live="polite">
      <template v-if="shown">{{ labels?.[shown - 1] }}</template>
    </p>
  </div>
</template>
