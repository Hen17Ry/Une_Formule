<template>
  <div
    class="relative w-full overflow-hidden select-none"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Carousel Track -->
    <div
      class="flex transition-transform duration-700 ease-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(t, idx) in testimonials"
        :key="t.id || idx"
        class="w-full flex-shrink-0 px-4 md:px-8"
      >
        <div class="bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(58,33,21,0.08)] max-w-3xl mx-auto relative overflow-hidden group">
          <!-- Background Editorial Watermark -->
          <span class="absolute -bottom-6 -right-6 font-serif text-8xl text-[#B08D57]/10 pointer-events-none">
            Ω
          </span>

          <!-- Rating Stars & Badge -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#B08D57]/15">
            <span class="text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold bg-[#B08D57]/10 px-3.5 py-1 rounded-full">
              Témoignage Lecteur
            </span>
            <div class="flex text-[#B08D57] text-sm tracking-widest">
              <span v-for="star in t.rating" :key="star">★</span>
            </div>
          </div>

          <!-- Quote Content -->
          <blockquote class="font-serif text-[#3A2115] text-lg sm:text-xl md:text-2xl leading-relaxed italic mb-8 font-normal">
            « {{ t.content }} »
          </blockquote>

          <!-- Author & Date -->
          <div class="pt-4 border-t border-[#B08D57]/15 flex items-center justify-between text-xs md:text-sm text-[#5A4234]">
            <span class="font-medium text-[#3A2115] tracking-wider uppercase font-sans">
              {{ t.publication_name || t.first_name }}
            </span>
            <span class="font-serif italic text-[#B08D57]">
              {{ formatDate(t.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Controls Bar -->
    <div class="flex items-center justify-between max-w-3xl mx-auto mt-8 px-4">
      <!-- Play / Pause Toggle Button -->
      <button
        type="button"
        class="text-xs uppercase tracking-[0.2em] text-[#B08D57] hover:text-[#3A2115] transition-colors flex items-center gap-2 font-medium bg-[#FFFDF9] px-4 py-2 rounded-full border border-[#B08D57]/30"
        @click="toggleAutoplay"
      >
        <span v-if="isPlaying">⏸ Pause</span>
        <span v-else>▶ Lecture</span>
      </button>

      <!-- Pagination Indicators -->
      <div class="flex items-center space-x-2">
        <button
          v-for="(_, idx) in testimonials"
          :key="idx"
          type="button"
          class="h-2 rounded-full transition-all duration-300"
          :class="idx === currentIndex ? 'w-8 bg-[#B08D57]' : 'w-2 bg-[#B08D57]/30 hover:bg-[#B08D57]/60'"
          :aria-label="`Aller à la diapositive ${idx + 1}`"
          @click="goTo(idx)"
        />
      </div>

      <!-- Manual Navigation Prev / Next -->
      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="w-10 h-10 rounded-full border border-[#B08D57]/30 bg-[#FFFDF9] text-[#B08D57] hover:text-[#3A2115] hover:border-[#B08D57] transition-all flex items-center justify-center text-sm disabled:opacity-30"
          :disabled="testimonials.length <= 1"
          aria-label="Précédent"
          @click="prev"
        >
          ←
        </button>
        <button
          type="button"
          class="w-10 h-10 rounded-full border border-[#B08D57]/30 bg-[#FFFDF9] text-[#B08D57] hover:text-[#3A2115] hover:border-[#B08D57] transition-all flex items-center justify-center text-sm disabled:opacity-30"
          :disabled="testimonials.length <= 1"
          aria-label="Suivant"
          @click="next"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  testimonials: Array<{
    id: number
    first_name: string
    publication_name?: string
    content: string
    rating: number
    created_at: string
  }>
}>()

const currentIndex = ref(0)
const isPlaying = ref(true)
let autoplayTimer: NodeJS.Timeout | null = null
let touchStartX = 0

const next = () => {
  if (props.testimonials.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.testimonials.length
}

const prev = () => {
  if (props.testimonials.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.testimonials.length) % props.testimonials.length
}

const goTo = (idx: number) => {
  currentIndex.value = idx
}

const startAutoplay = () => {
  if (autoplayTimer) clearInterval(autoplayTimer)
  autoplayTimer = setInterval(() => {
    if (isPlaying.value && props.testimonials.length > 1) {
      next()
    }
  }, 6000)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const pauseAutoplay = () => {
  stopAutoplay()
}

const resumeAutoplay = () => {
  if (isPlaying.value) startAutoplay()
}

const toggleAutoplay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

// Touch gestures for mobile swipe
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX
  const diffX = touchStartX - touchEndX
  if (Math.abs(diffX) > 40) {
    if (diffX > 0) next()
    else prev()
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>
