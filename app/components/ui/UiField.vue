<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | number
  label: string
  type?: string
  textarea?: boolean
  rows?: number
  optional?: boolean
  required?: boolean
  hint?: string
  error?: string
  max?: number
  autocomplete?: string
  placeholder?: string
  inputmode?: 'text' | 'tel' | 'email' | 'numeric'
}>(), { type: 'text', rows: 4 })
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const id = useId()
const length = computed(() => String(props.modelValue ?? '').length)

const fieldClass = 'w-full rounded-2xl border bg-white/75 px-5 py-4 font-sans text-[1.02rem] text-ink placeholder:text-ink/35 transition-[border-color,box-shadow,background-color] duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-caramel/15'
</script>

<template>
  <div>
    <label :for="id" class="mb-2.5 flex items-baseline justify-between gap-4 font-sans text-[0.98rem] font-[450] leading-snug text-ink">
      <span>{{ label }}<span v-if="required" class="text-copper" aria-hidden="true"> *</span></span>
      <span v-if="optional" class="shrink-0 text-xs font-normal uppercase tracking-[0.18em] text-ink-muted">Facultatif</span>
    </label>
    <textarea
      v-if="textarea"
      :id="id"
      :value="modelValue"
      :rows="rows"
      :maxlength="max"
      :required="required"
      :placeholder="placeholder"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error || hint ? `${id}-d` : undefined"
      :class="[fieldClass, 'min-h-[8rem] resize-y leading-relaxed', error ? 'border-danger/70' : 'border-line hover:border-line-strong focus:border-caramel']"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      :maxlength="max"
      :required="required"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :inputmode="inputmode"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error || hint ? `${id}-d` : undefined"
      :class="[fieldClass, 'h-14', error ? 'border-danger/70' : 'border-line hover:border-line-strong focus:border-caramel']"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <div class="mt-2 flex justify-between gap-4 font-sans text-[0.85rem]">
      <p :id="`${id}-d`" :class="error ? 'text-danger' : 'text-ink-muted'" :role="error ? 'alert' : undefined">{{ error || hint }}</p>
      <p v-if="max && textarea && length > max * 0.6" class="shrink-0 tabular-nums text-ink-muted">{{ length }} / {{ max }}</p>
    </div>
  </div>
</template>
