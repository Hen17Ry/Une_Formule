<script setup lang="ts">
/* Accordéon animé (inspiré des accordéons shadcn/21st.dev), accessible au clavier. */
const props = withDefaults(defineProps<{ items: { q: string, a: string }[], defaultOpen?: number | null, idPrefix?: string }>(), { defaultOpen: null, idPrefix: 'acc' })
const open = ref<number | null>(props.defaultOpen)
const uid = useId()
const toggle = (i: number) => { open.value = open.value === i ? null : i }
</script>

<template>
  <div class="divide-y divide-line border-y border-line">
    <div v-for="(item, i) in items" :key="item.q" class="group">
      <h3 class="m-0">
        <button
          :id="`${uid}-h-${i}`"
          type="button"
          class="flex w-full items-start justify-between gap-6 py-6 text-left font-display text-[1.45rem] leading-snug text-ink transition-colors duration-300 hover:text-copper md:text-[1.6rem]"
          :aria-expanded="open === i"
          :aria-controls="`${uid}-p-${i}`"
          @click="toggle(i)"
        >
          <span>{{ item.q }}</span>
          <span class="relative mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:border-copper" :class="open === i && 'rotate-45 border-copper bg-copper text-paper'" aria-hidden="true">
            <span class="absolute h-px w-3 bg-current" />
            <span class="absolute h-3 w-px bg-current" />
          </span>
        </button>
      </h3>
      <div
        :id="`${uid}-p-${i}`"
        role="region"
        :aria-labelledby="`${uid}-h-${i}`"
        class="grid transition-[grid-template-rows,opacity] duration-700 ease-expo"
        :class="open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        :inert="open !== i || undefined"
      >
        <div class="overflow-hidden">
          <p class="max-w-3xl pb-7 pr-12 font-serif text-[1.12rem] leading-relaxed text-ink-soft">{{ item.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
