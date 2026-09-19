<template>
  <div class="relative bg-[#F8F4EE] min-h-screen text-[#3A2115] selection:bg-[#B08D57] selection:text-[#F8F4EE]">
    <!-- Fixed Luxury Navbar -->
    <NavigationNavbar />

    <!-- Main Page Content -->
    <main>
      <SectionsHero />
      <LazySectionsLeversStack />
      <LazySectionsFormulaOrigin />
      <LazySectionsFormulaEquation />
      <LazySectionsAuthorSection />
      <LazySectionsBookExcerpts />
      <LazySectionsFaqSection />
      <LazySectionsReaderFeedback />
      <LazySectionsCheckoutSection />
    </main>

    <!-- Luxury Editorial Footer -->
    <NavigationFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAnalytics } from '../composables/useAnalytics'

const { trackEvent, initScrollDepthTracking } = useAnalytics()

onMounted(() => {
  if (!import.meta.client) return
  gsap.registerPlugin(ScrollTrigger)

  trackEvent('hero_viewed')
  initScrollDepthTracking()

  nextTick(() => {
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)
  })
})
</script>