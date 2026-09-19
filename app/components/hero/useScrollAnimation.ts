import { onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameSequence } from './useFrameSequence'

export function useScrollAnimation(targetRef: Ref<HTMLElement | null>) {
  const { setFrame } = useFrameSequence()
  let triggerInstance: ScrollTrigger | null = null

  onMounted(() => {
    if (!import.meta.client || !targetRef.value) return

    gsap.registerPlugin(ScrollTrigger)

    const element = targetRef.value

    triggerInstance = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (self) => {
        setFrame(self.progress)
      }
    })
  })

  onUnmounted(() => {
    if (triggerInstance) {
      triggerInstance.kill()
      triggerInstance = null
    }
  })

  return {
    getTrigger: () => triggerInstance
  }
}
