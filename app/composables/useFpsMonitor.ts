import { ref, onMounted, onUnmounted } from 'vue'

const fps = ref(60)
const frameTime = ref(16.6)
const isPerformanceGood = ref(true)

let frameCount = 0
let lastTime = 0
let animationFrameId: number | null = null

export function useFpsMonitor() {
  const startMonitoring = () => {
    if (!import.meta.client || animationFrameId !== null) return

    lastTime = performance.now()
    frameCount = 0

    const loop = (now: number) => {
      frameCount++
      const delta = now - lastTime

      if (delta >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / delta)
        fps.value = currentFps
        frameTime.value = Number((delta / frameCount).toFixed(2))
        isPerformanceGood.value = currentFps >= 55

        frameCount = 0
        lastTime = now
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)
  }

  const stopMonitoring = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    fps,
    frameTime,
    isPerformanceGood,
    startMonitoring,
    stopMonitoring
  }
}
