<template>
  <section
    id="faq"
    ref="sectionRef"
    class="relative w-full bg-[#F8F4EE] text-[#3A2115] py-16 sm:py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex flex-col justify-center overflow-hidden"
  >
    <div class="container mx-auto max-w-4xl relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <span class="faq-tag inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-3">
          Éclairages & Réponses
        </span>
        <h2 class="faq-title font-serif text-3xl sm:text-4xl md:text-5xl text-[#3A2115] font-normal tracking-tight leading-tight mb-4">
          Questions Essentielles
        </h2>
        <div class="faq-line w-20 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent mx-auto mb-4" />
        <p class="faq-sub text-[#5A4234] text-sm md:text-base font-light">
          Tout ce que vous devez savoir avant d'entamer la lecture d'Une Formule.
        </p>
      </div>

      <!-- FAQ Luxury Accordion List -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in faqs"
          :key="index"
          class="faq-item bg-[#FFFDF9] border border-[#B08D57]/25 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(58,33,21,0.06)] transition-all duration-300"
        >
          <button
            type="button"
            class="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 font-serif text-lg sm:text-xl text-[#3A2115] hover:text-[#B08D57] transition-colors"
            @click="toggleFaq(index)"
          >
            <span class="font-normal">{{ item.question }}</span>
            <span class="w-8 h-8 rounded-full border border-[#B08D57]/30 flex items-center justify-center shrink-0 text-[#B08D57] font-sans font-light text-xl transition-transform duration-300" :class="{ 'rotate-45': activeFaq === index }">
              +
            </span>
          </button>

          <Transition name="faq-slide">
            <div
              v-if="activeFaq === index"
              class="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-[#B08D57]/15 text-[#5A4234] text-sm sm:text-base font-light leading-relaxed space-y-3"
            >
              <p>{{ item.answer }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const activeFaq = ref<number | null>(0)

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

let ctx: gsap.Context | null = null

const faqs = [
  {
    question: 'Qu\'est-ce qu\'Une Formule ?',
    answer: 'Une Formule est un traité de stratégie et d\'architecture personnelle. Il condense 15 années d\'observations et de mentorat en sept leviers universels et un protocole d\'action structuré en équation : Α + β = Ω.'
  },
  {
    question: 'À qui s\'adresse ce livre ?',
    answer: 'Cet ouvrage s\'adresse aux entrepreneurs, dirigeants, créateurs et bâtisseurs exigeants qui recherchent une méthode rigoureuse pour éliminer le bruit ambiant, structurer leur vision et démultiplier leur impact sans sacrifier leur équilibre intérieur.'
  },
  {
    question: 'Le livre repose-t-il sur des données scientifiques ?',
    answer: 'Absolument. Chaque levier croise des données neuroscientifiques sur la prise de décision, de la psychologie comportementale, de la théorie des systèmes et des principes d\'efficience stratégique validés par la pratique.'
  },
  {
    question: 'Faut-il lire les sept leviers dans l\'ordre ?',
    answer: 'La structure du livre est conçue de manière séquentielle et cumulative. Cependant, une fois la première lecture effectuée, chaque chapitre peut être consulté indépendamment comme un manuel de référence stratégique.'
  },
  {
    question: 'Pourquoi ce titre ?',
    answer: 'Le titre « Une Formule » incarne l\'ambition de l\'ouvrage : réduire la complexité extrême de la trajectoire humaine à une équation claire, réutilisable et universelle, libre de tout bavardage superficiel.'
  }
]

onMounted(() => {
  if (!import.meta.client || !sectionRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    gsap.fromTo(['.faq-tag', '.faq-title', '.faq-line', '.faq-sub'],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 85%',
          once: true
        }
      }
    )

    gsap.fromTo('.faq-item',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          once: true
        }
      }
    )
  }, sectionRef.value)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>

<style scoped>
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
