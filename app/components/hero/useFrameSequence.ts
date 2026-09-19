import { ref, computed } from 'vue'

const TOTAL_FRAMES = 300
const currentFrame = ref(1)
const scrollProgress = ref(0)
const imageCache = new Array<HTMLImageElement | ImageBitmap | null>(TOTAL_FRAMES + 1).fill(null)
const loadingPromises = new Map<number, Promise<HTMLImageElement | ImageBitmap | null>>()

export function useFrameSequence() {
  const totalFrames = TOTAL_FRAMES

  const framePath = computed(() => {
    const number = currentFrame.value.toString().padStart(4, '0')
    return `/hero/frames/frame_${number}.webp`
  })

  function getFramePath(frameIndex: number): string {
    const number = Math.max(1, Math.min(totalFrames, frameIndex))
      .toString()
      .padStart(4, '0')
    return `/hero/frames/frame_${number}.webp`
  }

  function setFrame(progress: number) {
    const normalizedProgress = Math.max(0, Math.min(1, progress))
    scrollProgress.value = normalizedProgress
    const frame = Math.floor(normalizedProgress * (totalFrames - 1)) + 1
    const clampedFrame = Math.max(1, Math.min(totalFrames, frame))
    if (currentFrame.value !== clampedFrame) {
      currentFrame.value = clampedFrame
      preloadAdjacentFrames(clampedFrame)
    }
  }

  function preloadFrame(index: number): Promise<HTMLImageElement | ImageBitmap | null> {
    if (!import.meta.client || index < 1 || index > totalFrames) {
      return Promise.resolve(null)
    }

    if (imageCache[index]) {
      return Promise.resolve(imageCache[index])
    }

    if (loadingPromises.has(index)) {
      return loadingPromises.get(index)!
    }

    const promise = new Promise<HTMLImageElement | ImageBitmap | null>((resolve) => {
      const img = new Image()
      img.onload = async () => {
        try {
          if ('createImageBitmap' in window) {
            const bitmap = await createImageBitmap(img)
            imageCache[index] = bitmap
            resolve(bitmap)
          } else {
            imageCache[index] = img
            resolve(img)
          }
        } catch {
          imageCache[index] = img
          resolve(img)
        } finally {
          loadingPromises.delete(index)
        }
      }
      img.onerror = () => {
        loadingPromises.delete(index)
        resolve(null)
      }
      img.src = getFramePath(index)
    })

    loadingPromises.set(index, promise)
    return promise
  }

  function preloadAdjacentFrames(currentIndex: number, range: number = 12) {
    if (!import.meta.client) return
    for (let i = 1; i <= range; i++) {
      const forward = currentIndex + i
      const backward = currentIndex - i
      if (forward <= totalFrames && !imageCache[forward]) preloadFrame(forward)
      if (backward >= 1 && !imageCache[backward]) preloadFrame(backward)
    }
  }

  function preloadInitialBatch(batchSize: number = 30) {
    if (!import.meta.client) return
    // Preload critical initial frames immediately
    for (let i = 1; i <= Math.min(batchSize, totalFrames); i++) {
      preloadFrame(i)
    }

    // Schedule background preloading of remaining frames
    const scheduleNextChunk = (start: number) => {
      if (start > totalFrames) return
      const chunkSize = 20
      const end = Math.min(start + chunkSize, totalFrames + 1)
      for (let i = start; i < end; i++) {
        if (!imageCache[i]) preloadFrame(i)
      }

      if (end <= totalFrames) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => scheduleNextChunk(end))
        } else {
          setTimeout(() => scheduleNextChunk(end), 100)
        }
      }
    }

    setTimeout(() => scheduleNextChunk(batchSize + 1), 300)
  }

  return {
    currentFrame,
    scrollProgress,
    framePath,
    setFrame,
    totalFrames,
    getFramePath,
    preloadFrame,
    preloadInitialBatch,
    imageCache
  }
}