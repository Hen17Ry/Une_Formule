<template>
  <section
    id="retours"
    ref="sectionRef"
    class="relative w-full bg-[#F8F4EE] text-[#3A2115] py-16 sm:py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-[#B08D57]/20 flex flex-col justify-center overflow-hidden"
  >
    <div class="container mx-auto max-w-6xl relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <span class="fb-tag inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm mb-3">
          Transmettre Votre Expérience
        </span>
        <h2 class="fb-title font-serif text-3xl sm:text-4xl md:text-5xl text-[#3A2115] font-normal tracking-tight leading-tight mb-4">
          Retours des Lecteurs
        </h2>
        <div class="fb-line w-20 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent mx-auto mb-4" />
        <p class="fb-sub text-[#5A4234] text-sm md:text-base font-light">
          Partagez l'impact d'Une Formule sur votre parcours. Choisissez votre mode de transmission.
        </p>
      </div>

      <!-- 2 Pathways Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
        <!-- Path 1 Card: Levier Spécifique -->
        <div
          class="fb-path bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 sm:p-10 shadow-[0_15px_35px_rgba(58,33,21,0.06)] hover:border-[#B08D57] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          @click="openModal('levier')"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold">Parcours 01</span>
              <div class="w-8 h-8 rounded-full border border-[#B08D57]/30 flex items-center justify-center text-[#B08D57] group-hover:bg-[#B08D57] group-hover:text-[#F8F4EE] transition-all">
                →
              </div>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl text-[#3A2115] font-normal mb-3">
              Retour sur un Levier Spécifique
            </h3>
            <p class="text-[#5A4234] text-sm md:text-base font-light leading-relaxed mb-6">
              Partagez votre analyse sur l'un des 7 leviers du livre (Escalader le temps, Le grand rêve aligné, La source infinie...).
            </p>
          </div>
          <button
            type="button"
            class="w-full text-center font-serif text-sm uppercase tracking-[0.2em] text-[#B08D57] border border-[#B08D57]/40 py-3 rounded-full group-hover:bg-[#B08D57] group-hover:text-[#F8F4EE] transition-all font-medium"
          >
            Sélectionner un Levier
          </button>
        </div>

        <!-- Path 2 Card: Retour Général -->
        <div
          class="fb-path bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 sm:p-10 shadow-[0_15px_35px_rgba(58,33,21,0.06)] hover:border-[#B08D57] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          @click="openModal('general')"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold">Parcours 02</span>
              <div class="w-8 h-8 rounded-full border border-[#B08D57]/30 flex items-center justify-center text-[#B08D57] group-hover:bg-[#B08D57] group-hover:text-[#F8F4EE] transition-all">
                →
              </div>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl text-[#3A2115] font-normal mb-3">
              Témoignage Général
            </h3>
            <p class="text-[#5A4234] text-sm md:text-base font-light leading-relaxed mb-6">
              Transmettez votre appréciation globale sur l'ouvrage, son écriture et son apport dans votre vision stratégique.
            </p>
          </div>
          <button
            type="button"
            class="w-full text-center font-serif text-sm uppercase tracking-[0.2em] text-[#B08D57] border border-[#B08D57]/40 py-3 rounded-full group-hover:bg-[#B08D57] group-hover:text-[#F8F4EE] transition-all font-medium"
          >
            Donner un Avis Général
          </button>
        </div>
      </div>

      <!-- Feedback Form Modal -->
      <Transition name="modal-fade">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 bg-[#3A2115]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            class="relative w-full max-w-2xl bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.25)] max-h-[90vh] overflow-y-auto"
          >
            <!-- Close Modal Button -->
            <button
              type="button"
              class="absolute top-6 right-6 text-[#5A4234] hover:text-[#B08D57] text-xs uppercase tracking-[0.2em] p-2 border border-[#B08D57]/20 rounded-full"
              @click="closeModal"
            >
              ✕
            </button>

            <!-- Modal Header -->
            <div class="mb-8">
              <span class="text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold">
                {{ feedbackType === 'levier' ? 'Levier Spécifique' : 'Avis Général' }}
              </span>
              <h3 class="font-serif text-2xl sm:text-3xl text-[#3A2115] font-normal mt-1">
                Formulaire de Transmission
              </h3>
            </div>

            <!-- Form Success Message -->
            <div v-if="isSubmitted" class="text-center py-10 space-y-4">
              <span class="font-serif text-4xl text-[#B08D57] block">Α + β = Ω</span>
              <h4 class="font-serif text-2xl text-[#3A2115]">Merci pour votre transmission</h4>
              <p class="text-[#5A4234] text-sm font-light">
                Votre témoignage a bien été transmis à l'auteur.
              </p>
              <button
                type="button"
                class="mt-6 font-serif text-xs uppercase tracking-[0.2em] text-[#F8F4EE] bg-[#B08D57] hover:bg-[#3A2115] px-6 py-2.5 rounded-full transition-colors font-medium"
                @click="closeModal"
              >
                Fermer
              </button>
            </div>

            <!-- Form Body -->
            <form v-else class="space-y-6" @submit.prevent="submitForm">
              <!-- Levier Selector if type is 'levier' -->
              <div v-if="feedbackType === 'levier'" class="space-y-2">
                <label class="block text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">
                  Choisissez le Levier Concerné
                </label>
                <select
                  v-model="form.selectedLevier"
                  required
                  class="w-full bg-[#F8F4EE] border border-[#B08D57]/30 rounded-xl p-3 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57]"
                >
                  <option value="" disabled>Sélectionner un levier...</option>
                  <option v-for="l in leversList" :key="l" :value="l">{{ l }}</option>
                </select>
              </div>

              <!-- Rating 1 to 5 Stars -->
              <div class="space-y-2">
                <label class="block text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">
                  Appréciation Globale (1 à 5)
                </label>
                <div class="flex items-center gap-2">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="text-2xl transition-transform hover:scale-125 focus:outline-none"
                    :class="star <= form.rating ? 'text-[#B08D57]' : 'text-[#B08D57]/30'"
                    @click="form.rating = star"
                  >
                    ★
                  </button>
                </div>
              </div>

              <!-- Open-ended Reflection Textarea -->
              <div class="space-y-2">
                <label class="block text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">
                  Votre Témoignage & Réflexion
                </label>
                <textarea
                  v-model="form.message"
                  required
                  rows="4"
                  placeholder="Quel impact cet enseignement a-t-il eu sur votre quotidien ?"
                  class="w-full bg-[#F8F4EE] border border-[#B08D57]/30 rounded-xl p-3.5 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57] placeholder:text-[#5A4234]/50"
                />
              </div>

              <!-- Consent Checkbox -->
              <div class="flex items-start gap-3 pt-2">
                <input
                  id="consent"
                  v-model="form.allowPublication"
                  type="checkbox"
                  class="mt-1 accent-[#B08D57] rounded"
                />
                <label for="consent" class="text-xs text-[#5A4234] leading-relaxed cursor-pointer">
                  J'autorise la publication de mon témoignage sur le site officiel Une Formule.
                </label>
              </div>

              <!-- Conditional First Name -->
              <div v-if="form.allowPublication" class="space-y-2 transition-all">
                <label class="block text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">
                  Prénom (Affiché avec le témoignage)
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="Votre prénom..."
                  class="w-full bg-[#F8F4EE] border border-[#B08D57]/30 rounded-xl p-3 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <!-- Optional Email -->
              <div class="space-y-2">
                <label class="block text-xs uppercase tracking-[0.2em] text-[#3A2115] font-semibold">
                  Adresse Email (Facultatif & Confidentiel)
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="nom@exemple.com"
                  class="w-full bg-[#F8F4EE] border border-[#B08D57]/30 rounded-xl p-3 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="text-xs text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-200">
                {{ errorMessage }}
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full font-serif text-sm uppercase tracking-[0.25em] text-[#F8F4EE] bg-[#B08D57] hover:bg-[#3A2115] py-3.5 rounded-full transition-all font-medium shadow-md disabled:opacity-50"
              >
                <span v-if="isLoading">Transmission en cours...</span>
                <span v-else>Transmettre mon Témoignage</span>
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const isModalOpen = ref(false)
const isSubmitted = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const feedbackType = ref<'levier' | 'general'>('general')

const leversList = [
  '01 · Escalader le temps',
  '02 · Tourner son cerveau dans le sens du succès',
  '03 · La loi de l\'attraction',
  '04 · Le Grand Moi et le petit Moi',
  '05 · La monnaie la plus puissante au monde',
  '06 · Le grand rêve aligné',
  '07 · Puiser à la source infinie'
]

const form = reactive({
  selectedLevier: '',
  rating: 5,
  message: '',
  allowPublication: false,
  firstName: '',
  email: ''
})

const openModal = (type: 'levier' | 'general') => {
  feedbackType.value = type
  isSubmitted.value = false
  errorMessage.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitForm = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const rawContent = feedbackType.value === 'levier' && form.selectedLevier
      ? `[${form.selectedLevier}] ${form.message}`
      : form.message

    const pubSetting = form.allowPublication
      ? (form.firstName.trim() ? 'FIRST_NAME' : 'ANONYMOUS')
      : 'NO'

    const fname = form.firstName.trim() || 'Anonyme'

    const res = await $fetch<{ success: boolean; message: string }>('/api/testimonials', {
      method: 'POST',
      body: {
        first_name: fname,
        firstName: fname,
        email: form.email,
        content: rawContent,
        message: rawContent,
        rating: form.rating,
        allow_publication: pubSetting,
        allowPublication: pubSetting
      }
    })

    if (res.success) {
      isSubmitted.value = true
    }
  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || 'Une erreur est survenue lors de la transmission.'
  } finally {
    isLoading.value = false
  }
}

let ctx: gsap.Context | null = null

onMounted(() => {
  if (!import.meta.client || !sectionRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    gsap.fromTo(['.fb-tag', '.fb-title', '.fb-line', '.fb-sub'],
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

    gsap.fromTo('.fb-path',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
