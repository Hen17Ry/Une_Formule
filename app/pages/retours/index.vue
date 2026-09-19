<template>
  <div class="relative bg-[#F8F4ED] min-h-screen text-[#3A2115] selection:bg-[#B08D57] selection:text-[#F8F4ED]">
    <!-- Navbar -->
    <NavigationNavbar />

    <!-- Header Section -->
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-6 sm:px-10 md:px-16 lg:px-24 border-b border-[#B08D57]/20">
      <div class="container mx-auto max-w-5xl text-center">
        <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-4">
          Galerie Éditoriale
        </span>
        <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2115] font-normal tracking-tight mb-6">
          Retours des Lecteurs
        </h1>
        <div class="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent mx-auto mb-6" />
        <p class="text-[#5A4234] text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed mb-10">
          Témoignages authentiques validés et transmis par les lecteurs d'Une Formule.
        </p>

        <!-- CTA Button to open Feedback Modal -->
        <button
          type="button"
          class="inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all duration-300 rounded-full px-8 py-3.5 shadow-lg group"
          @click="isModalOpen = true"
        >
          <span>Partager votre expérience</span>
          <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </section>

    <!-- Main Content Gallery & Interactive Carousel -->
    <section class="py-16 md:py-24 px-6 sm:px-10 md:px-16 lg:px-24">
      <div class="container mx-auto max-w-6xl">
        <!-- Loading State -->
        <div v-if="pending" class="text-center py-20 text-[#5A4234]">
          <span class="font-serif italic text-lg">Consultation des retours validés...</span>
        </div>

        <!-- Elegant Empty State (ZERO FAKE DATA) -->
        <div v-else-if="testimonials.length === 0" class="text-center py-20 bg-[#FFFDF9] rounded-3xl border border-[#B08D57]/20 max-w-xl mx-auto p-10 shadow-sm relative overflow-hidden">
          <div class="w-16 h-16 bg-[#B08D57]/10 text-[#B08D57] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-serif">
            Ω
          </div>
          <span class="inline-block uppercase tracking-[0.3em] text-[#B08D57] text-xs font-semibold mb-3">
            Espace Éditorial Vierge
          </span>
          <h3 class="font-serif text-2xl md:text-3xl text-[#3A2115] mb-4 font-normal">
            Votre expérience sera la première pierre de cette collection.
          </h3>
          <p class="text-sm text-[#5A4234] font-light mb-8 max-w-md mx-auto leading-relaxed">
            Vous avez parcouru Une Formule ? Soyez le premier lecteur à transmettre votre vision et vos résultats.
          </p>
          <button
            type="button"
            class="text-xs uppercase tracking-[0.2em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-8 py-3.5 shadow-md"
            @click="isModalOpen = true"
          >
            Écrire le premier témoignage
          </button>
        </div>

        <!-- Public Carousel Display for Approved Testimonials -->
        <div v-else>
          <TestimonialsPublicCarousel :testimonials="testimonials" />
        </div>
      </div>
    </section>

    <!-- Feedback Modal -->
    <TestimonialsFeedbackModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @submitted="onSubmitted"
    />

    <!-- Footer -->
    <NavigationFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalytics } from '../../composables/useAnalytics'

const isModalOpen = ref(false)
const { trackEvent } = useAnalytics()

const { data: responseData, pending, refresh } = await useFetch('/api/testimonials')

const testimonials = computed(() => responseData.value?.data || [])

const onSubmitted = () => {
  refresh()
}

onMounted(() => {
  trackEvent('page_view', { page: '/retours' })
})
</script>
