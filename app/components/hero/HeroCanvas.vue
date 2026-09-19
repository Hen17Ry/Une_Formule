<template>
  <div class="absolute inset-0 z-0">
    <canvas
      ref="canvasRef"
      class="w-full h-full block"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useFrameSequence } from './useFrameSequence'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { currentFrame, imageCache, preloadFrame, preloadInitialBatch } = useFrameSequence()

let activeDrawIndex = 0
let rafId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

const renderFrame = (frameIndex: number) => {
  if (!import.meta.client || !canvasRef.value) return

  activeDrawIndex = frameIndex
  const canvas = canvasRef.value

  if (!ctx) {
    ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
  }
  if (!ctx) return

  let img = imageCache[frameIndex]
  if (!img) {
    preloadFrame(frameIndex).then((loadedImg) => {
      if (loadedImg && activeDrawIndex === frameIndex) {
        requestDraw(frameIndex)
      }
    })
    return
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const width = Math.floor(window.innerWidth * dpr)
  const height = Math.floor(window.innerHeight * dpr)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const imgWidth = (img as HTMLImageElement).width || (img as ImageBitmap).width
  const imgHeight = (img as HTMLImageElement).height || (img as ImageBitmap).height
  const imgRatio = imgWidth / imgHeight
  const canvasRatio = width / height

  let drawWidth = width
  let drawHeight = height
  let offsetX = 0
  let offsetY = 0

  if (canvasRatio > imgRatio) {
    drawHeight = width / imgRatio
    offsetY = (height - drawHeight) / 2
  } else {
    drawWidth = height * imgRatio

    if (window.innerWidth < 1024) {
      const focalXRatio = 0.28
      const targetScreenPivot = 0.48

      offsetX = -(drawWidth * focalXRatio - width * targetScreenPivot)
      offsetX = Math.min(0, Math.max(width - drawWidth, offsetX))
      offsetY = 0
    } else {
      offsetX = (width - drawWidth) / 2
      offsetY = 0
    }
  }

  ctx.fillStyle = '#120D09'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
}

const requestDraw = (frameIndex: number) => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    renderFrame(frameIndex)
    rafId = null
  })
}

const handleResize = () => {
  requestDraw(currentFrame.value)
}

onMounted(() => {
  preloadInitialBatch(30)
  requestDraw(currentFrame.value)
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize)
    if (rafId !== null) cancelAnimationFrame(rafId)
  }
})

watch(currentFrame, (newFrame) => {
  requestDraw(newFrame)
})
</script>