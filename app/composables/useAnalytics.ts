import { ref } from 'vue'

export function useAnalytics() {
  const trackedDepths = ref<Set<number>>(new Set())

  const trackEvent = async (eventName: string, metadata?: Record<string, any>) => {
    if (!import.meta.client) return

    try {
      await $fetch('/api/analytics/event', {
        method: 'POST',
        body: {
          event_name: eventName,
          page: window.location.pathname,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
          }
        }
      })
    } catch (err) {
      console.debug('[Analytics] Event tracking:', eventName, err)
    }
  }

  const initScrollDepthTracking = () => {
    if (!import.meta.client) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const progress = Math.round((window.scrollY / scrollHeight) * 100)
      const thresholds = [25, 50, 75, 100]

      thresholds.forEach((depth) => {
        if (progress >= depth && !trackedDepths.value.has(depth)) {
          trackedDepths.value.add(depth)
          trackEvent('scroll_depth', { depth })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  const trackSectionViews = () => {
    if (!import.meta.client) return

    const sections = document.querySelectorAll('section[id]')
    if (!sections || sections.length === 0) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id')
          if (sectionId) {
            trackEvent('section_viewed', { section: sectionId })
          }
        }
      })
    }, { threshold: 0.4 })

    sections.forEach((s) => observer.observe(s))
  }

  return {
    trackEvent,
    initScrollDepthTracking,
    trackSectionViews
  }
}
