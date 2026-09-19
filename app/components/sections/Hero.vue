<template>
  <section
    ref="heroRef"
    class="relative h-[500vh] w-full bg-[#120D09]"
  >
    <div class="sticky top-0 h-screen w-full overflow-hidden">
      <!-- 3D Frame Canvas with subtle exit depth zoom -->
      <div
        class="absolute inset-0 w-full h-full"
        :style="canvasZoomStyle"
      >
        <HeroCanvas />
      </div>

      <!-- Hero Text Overlay -->
      <HeroContent />

      <!-- Immersive Transition Layer ("Ouverture du livre" - progress 0.85 -> 1.0) -->
      <div
        class="absolute inset-0 z-30 pointer-events-none bg-[#F8F4ED] flex flex-col items-center justify-center transition-opacity"
        :style="transitionOverlayStyle"
      >
        <!-- Warm Paper Glow -->
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B08D57]/20 via-[#F8F4ED]/90 to-[#F8F4ED]" />

        <!-- Narrative Transition Hint -->
        <div
          class="relative z-10 text-center px-6 transition-all duration-300"
          :style="transitionTextStyle"
        >
          <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] text-xs md:text-sm font-semibold mb-3">
            Chapitre 0
          </span>
          <h2 class="font-serif text-3xl md:text-5xl text-[#3A2115] font-normal tracking-tight">
            Ouverture du livre
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HeroCanvas from '../hero/HeroCanvas.vue'
import HeroContent from '../hero/HeroContent.vue'
import { useScrollAnimation } from '../hero/useScrollAnimation'
import { useFrameSequence } from '../hero/useFrameSequence'

const heroRef = ref<HTMLElement | null>(null)
useScrollAnimation(heroRef)

const { scrollProgress } = useFrameSequence()

// Subtle zoom depth effect on canvas in final frames of scroll (0.85 -> 1.0)
const canvasZoomStyle = computed(() => {
  const p = scrollProgress.value
  if (p < 0.85) return { transform: 'scale(1)' }
  const factor = Math.min(1, (p - 0.85) / 0.15)
  return {
    transform: `scale(${1 + 0.05 * factor})`,
    transformOrigin: 'center center',
    willChange: 'transform'
  }
})

// Paper texture fade-in transition (0.85 -> 1.0)
const transitionOverlayStyle = computed(() => {
  const p = scrollProgress.value
  if (p < 0.85) {
    return {
      opacity: 0,
      pointerEvents: 'none' as const
    }
  }

  const factor = Math.min(1, (p - 0.85) / 0.15)
  return {
    opacity: factor,
    pointerEvents: factor >= 0.9 ? ('auto' as const) : ('none' as const),
    willChange: 'opacity'
  }
})

// Text entrance during final transition (0.88 -> 1.0)
const transitionTextStyle = computed(() => {
  const p = scrollProgress.value
  if (p < 0.88) {
    return {
      opacity: 0,
      transform: 'translateY(20px)'
    }
  }

  const factor = Math.min(1, (p - 0.88) / 0.12)
  return {
    opacity: factor,
    transform: `translateY(${(1 - factor) * 20}px)`
  }
})
</script>