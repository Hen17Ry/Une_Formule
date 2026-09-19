<template>
  <div
    class="relative z-10 h-full w-full flex flex-col justify-end lg:justify-center items-center pointer-events-none overflow-hidden"
    :style="contentStyle"
  >
    <!-- Soft ambient dark gradient at bottom on mobile for text contrast -->
    <div class="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-t from-[#120D09] via-[#120D09]/80 to-transparent lg:hidden pointer-events-none z-0" />

    <div class="container mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-12 lg:pb-0 z-10">
      <!-- Left Column (Spacer for 3D Book on Desktop) -->
      <div class="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />

      <!-- Right Column (Shifted to ~60% width on desktop, bottom floating editorial on mobile) -->
      <div class="col-span-1 lg:col-span-7 xl:col-span-6 text-center lg:text-left pointer-events-auto flex flex-col items-center lg:items-start max-w-lg lg:max-w-xl mx-auto lg:mx-0 w-full">
        <div class="w-full flex flex-col items-center lg:items-start">
          <!-- Tag -->
          <span class="inline-block uppercase tracking-[0.4em] text-[#C7A45D] font-semibold mb-2.5 sm:mb-3 lg:mb-4 text-[clamp(0.65rem,0.9vw,0.875rem)] drop-shadow-md">
            Édition Limitée
          </span>

          <!-- Main Title -->
          <h1 class="font-serif text-[#F6F0E7] tracking-[-0.04em] leading-[0.95] mb-3 sm:mb-4 lg:mb-6 font-normal drop-shadow-2xl text-[clamp(2.5rem,7vw,7.5rem)]">
            Une Formule
          </h1>

          <!-- Subtitle -->
          <p class="text-[#D4C8BE] font-light leading-relaxed max-w-xs sm:max-w-md lg:max-w-lg mb-4 sm:mb-6 lg:mb-8 text-[clamp(0.95rem,1.5vw,1.35rem)] drop-shadow-md">
            Sept leviers pour construire la vie que vous désirez.
          </p>

          <!-- Elegant Divider Line -->
          <div class="w-16 sm:w-20 lg:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C7A45D]/60 to-transparent lg:from-[#C7A45D]/70 lg:via-[#C7A45D]/30 lg:to-transparent mb-4 sm:mb-6 lg:mb-8" />

          <!-- Formula Text -->
          <div class="inline-flex items-center justify-center lg:justify-start">
            <span class="text-[#C7A45D] font-serif tracking-[0.25em] font-medium text-[clamp(1.2rem,2.4vw,2.25rem)] drop-shadow-md">
              Α + β = Ω
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFrameSequence } from './useFrameSequence'

const { scrollProgress } = useFrameSequence()

// Scroll-linked text fade animation (progress 0.0 -> 0.35)
const contentStyle = computed(() => {
  const p = scrollProgress.value
  const factor = Math.min(1, Math.max(0, p / 0.35))

  const opacity = 1 - factor
  const translateY = -40 * factor
  const scale = 1 - 0.04 * factor
  const isMobile = import.meta.client && window.innerWidth < 768
  const blurValue = isMobile ? 0 : 8 * factor

  return {
    opacity: opacity,
    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
    filter: blurValue > 0 ? `blur(${blurValue}px)` : 'none',
    pointerEvents: factor >= 1 ? ('none' as const) : ('auto' as const),
    willChange: 'opacity, transform'
  }
})
</script>
