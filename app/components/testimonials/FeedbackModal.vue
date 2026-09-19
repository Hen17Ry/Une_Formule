<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/75 backdrop-blur-md overflow-y-auto"
        @click.self="close"
      >
        <div
          class="bg-[#F8F4ED] text-[#3A2115] w-full max-w-2xl rounded-3xl p-6 sm:p-8 md:p-10 relative border border-[#B08D57]/30 shadow-2xl my-auto"
        >
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-5 right-5 text-[#3A2115]/60 hover:text-[#B08D57] transition-colors p-2 rounded-full border border-[#B08D57]/20"
            aria-label="Fermer"
            @click="close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Success Screen -->
          <div v-if="isSubmitted" class="text-center py-10">
            <div class="w-16 h-16 bg-[#B08D57]/15 text-[#B08D57] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif">
              ✓
            </div>
            <span class="inline-block uppercase tracking-[0.3em] text-[#B08D57] text-xs font-semibold mb-2">
              Transmission Reçue
            </span>
            <h3 class="font-serif text-2xl md:text-3xl text-[#3A2115] mb-4">
              Merci pour votre transmission.
            </h3>
            <p class="text-[#5A4234] font-light text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Votre témoignage sera examiné attentivement par notre équipe avant toute publication.
            </p>
            <button
              type="button"
              class="text-xs uppercase tracking-[0.2em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-colors rounded-full px-8 py-3 shadow-md"
              @click="close"
            >
              Fermer la fenêtre
            </button>
          </div>

          <!-- Main Form Screen -->
          <div v-else>
            <!-- Header -->
            <div class="mb-6 border-b border-[#B08D57]/20 pb-4">
              <span class="uppercase tracking-[0.3em] text-[#B08D57] text-xs font-semibold block mb-1">
                Espace Lecteur
              </span>
              <h3 class="font-serif text-2xl md:text-3xl text-[#3A2115] font-normal">
                Partager votre expérience
              </h3>
            </div>

            <!-- Form -->
            <form class="space-y-5" @submit.prevent="submitForm">
              <!-- Rating (1-5) -->
              <div>
                <label class="block text-xs uppercase tracking-wider text-[#B08D57] font-semibold mb-2">
                  Note globale de l'ouvrage (1 à 5 étoiles) *
                </label>
                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    v-for="star in 5"
                    :key="star"
                    class="text-2xl transition-transform hover:scale-125 focus:outline-none"
                    :class="star <= form.rating ? 'text-[#B08D57]' : 'text-[#D4C8BE]'"
                    @click="form.rating = star"
                  >
                    ★
                  </button>
                  <span class="text-xs text-[#5A4234] font-serif ml-3">{{ form.rating }} / 5</span>
                </div>
              </div>

              <!-- Content -->
              <div>
                <label class="block text-xs uppercase tracking-wider text-[#B08D57] font-semibold mb-2">
                  Votre Témoignage *
                </label>
                <textarea
                  v-model="form.content"
                  rows="4"
                  required
                  placeholder="Partagez l'impact du livre sur votre parcours ou votre quotidien..."
                  class="w-full bg-[#FFFDF9] border border-[#B08D57]/30 rounded-xl p-3.5 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <!-- Quote Authorization -->
              <div>
                <label class="block text-xs uppercase tracking-wider text-[#B08D57] font-semibold mb-2">
                  Autorisation de publication
                </label>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    v-for="opt in [
                      { label: 'Avec prénom', val: 'FIRST_NAME' },
                      { label: 'Anonymement', val: 'ANONYMOUS' },
                      { label: 'Non (privé)', val: 'NO' }
                    ]"
                    :key="opt.val"
                    class="py-2.5 px-2 border rounded-xl transition-all text-center"
                    :class="form.allow_publication === opt.val ? 'border-[#B08D57] bg-[#B08D57]/15 text-[#3A2115] font-semibold' : 'border-[#B08D57]/20 text-[#5A4234] hover:border-[#B08D57]/40'"
                    @click="form.allow_publication = opt.val"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <!-- First Name & Email -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs uppercase tracking-wider text-[#B08D57] font-semibold mb-1">
                    Prénom *
                  </label>
                  <input
                    v-model="form.first_name"
                    type="text"
                    required
                    placeholder="Ex: Éléonore"
                    class="w-full bg-[#FFFDF9] border border-[#B08D57]/30 rounded-xl px-4 py-2 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57]"
                  >
                </div>

                <div>
                  <label class="block text-xs uppercase tracking-wider text-[#B08D57] font-semibold mb-1">
                    Email (optionnel, jamais publié)
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Ex: email@domaine.fr"
                    class="w-full bg-[#FFFDF9] border border-[#B08D57]/30 rounded-xl px-4 py-2 text-sm text-[#3A2115] focus:outline-none focus:border-[#B08D57]"
                  >
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="text-xs text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-200">
                {{ errorMessage }}
              </div>

              <!-- Actions -->
              <div class="pt-4 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  class="text-xs uppercase tracking-widest text-[#5A4234] hover:text-[#3A2115] font-medium"
                  @click="close"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="text-xs uppercase tracking-[0.2em] font-medium text-[#F8F4ED] bg-[#B08D57] hover:bg-[#3A2115] transition-all rounded-full px-7 py-3 shadow-md disabled:opacity-50"
                >
                  <span v-if="isLoading">Envoi en cours...</span>
                  <span v-else>Transmettre le retour</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAnalytics } from '../../composables/useAnalytics'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submitted'): void
}>()

const { trackEvent } = useAnalytics()

const isLoading = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const form = reactive({
  content: '',
  rating: 5,
  allow_publication: 'FIRST_NAME',
  first_name: '',
  email: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    isSubmitted.value = false
    errorMessage.value = ''
    trackEvent('feedback_form_opened')
  }
})

const close = () => {
  emit('close')
}

const submitForm = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    trackEvent('feedback_form_started')

    const res = await $fetch<{ success: boolean; message: string }>('/api/testimonials', {
      method: 'POST',
      body: {
        first_name: form.first_name,
        email: form.email,
        content: form.content,
        rating: form.rating,
        allow_publication: form.allow_publication
      }
    })

    if (res.success) {
      isSubmitted.value = true
      trackEvent('feedback_form_submitted', { rating: form.rating })
      emit('submitted')
    }
  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || 'Une erreur est survenue lors de l\'envoi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
