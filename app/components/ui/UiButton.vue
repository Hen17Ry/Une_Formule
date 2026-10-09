<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  variant?: 'primary' | 'outline' | 'ghost' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  icon?: Component
  iconLeft?: Component
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  magnetic?: boolean
  block?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', magnetic: true })

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => props.to ? NuxtLink : props.href ? 'a' : 'button')
const inner = ref<HTMLElement>()
const root = ref<HTMLElement>()

function onMove(e: PointerEvent) {
  if (!props.magnetic || e.pointerType !== 'mouse' || props.disabled) return
  const el = (root.value as any)?.$el ?? root.value
  if (!el || prefersReducedMotion()) return
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left - r.width / 2) * 0.22
  const y = (e.clientY - r.top - r.height / 2) * 0.3
  el.style.transform = `translate(${x}px, ${y}px)`
  if (inner.value) inner.value.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`
}
function onLeave() {
  const el = (root.value as any)?.$el ?? root.value
  if (el) el.style.transform = ''
  if (inner.value) inner.value.style.transform = ''
}

const classes = computed(() => [
  'group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-sans font-medium tracking-[0.02em]',
  'transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-expo will-change-transform',
  'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  props.block && 'w-full',
  {
    sm: 'h-10 px-5 text-[0.86rem]',
    md: 'h-12 px-7 text-[0.95rem]',
    lg: 'h-14 px-9 text-base'
  }[props.size],
  {
    primary: 'text-[#FFFDF9] shadow-[0_10px_30px_-12px_rgba(113,67,36,.65)] hover:shadow-[0_18px_40px_-14px_rgba(113,67,36,.7)] [background:linear-gradient(160deg,#9a6440_0%,#8a5530_45%,#714324_100%)]',
    outline: 'border border-ink/20 bg-white/40 text-ink backdrop-blur hover:border-copper hover:bg-white/80',
    ghost: 'text-ink hover:bg-ink/5',
    soft: 'bg-caramel-pale/60 text-umber hover:bg-caramel-pale'
  }[props.variant]
])
</script>

<template>
  <component
    :is="tag"
    ref="root"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    :aria-disabled="disabled || loading || undefined"
    :aria-busy="loading || undefined"
    :class="classes"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <span v-if="variant === 'primary'" aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-sheen" />
    <span ref="inner" class="relative inline-flex items-center gap-2.5 transition-transform duration-500 ease-expo">
      <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".3" stroke-width="2.5" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
      <component :is="iconLeft" v-else-if="iconLeft" class="h-[1.05em] w-[1.05em]" aria-hidden="true" />
      <slot />
      <component :is="icon" v-if="icon" class="h-[1.05em] w-[1.05em] transition-transform duration-500 ease-expo group-hover:translate-x-1" aria-hidden="true" />
    </span>
  </component>
</template>
