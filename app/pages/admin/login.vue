<template>
  <div class="min-h-screen bg-[#120D09] text-[#F6F0E7] flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Ambient Gold Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B08D57]/15 via-transparent to-transparent pointer-events-none" />

    <div class="w-full max-w-md bg-[#1C130D] border border-[#B08D57]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <a href="/" class="inline-flex items-center gap-2 font-serif text-2xl tracking-[0.25em] text-[#F6F0E7] font-medium mb-3">
          <span class="text-[#C7A45D]">Α</span>
          <span>+</span>
          <span class="text-[#C7A45D]">β</span>
          <span>=</span>
          <span class="text-[#C7A45D]">Ω</span>
        </a>
        <h1 class="font-serif text-2xl text-[#F6F0E7] font-normal mb-1">
          Espace Administration
        </h1>
        <p class="text-xs text-[#D4C8BE]/60 tracking-widest uppercase">
          Maison d'Édition · Accès Réservé
        </p>
      </div>

      <!-- Login Form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="block text-xs uppercase tracking-wider text-[#C7A45D] font-medium mb-2">
            Adresse Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@uneformule.fr"
            class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-4 py-3 text-sm text-[#F6F0E7] focus:outline-none focus:border-[#C7A45D]"
          >
        </div>

        <div>
          <label class="block text-xs uppercase tracking-wider text-[#C7A45D] font-medium mb-2">
            Mot de Passe
          </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••••••"
            class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-4 py-3 text-sm text-[#F6F0E7] focus:outline-none focus:border-[#C7A45D]"
          >
        </div>

        <div v-if="errorMsg" class="text-xs text-red-400 bg-red-900/30 p-3 rounded-xl border border-red-800/40">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all duration-300 rounded-full py-3.5 shadow-lg disabled:opacity-50 mt-4 font-sans"
        >
          <span v-if="isLoading">Connexion en cours...</span>
          <span v-else>Accéder au Tableau de Bord</span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-[#B08D57]/15 text-center text-xs text-[#D4C8BE]/40">
        <a href="/" class="hover:text-[#C7A45D] transition-colors">← Retourner au site public</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('admin@uneformule.fr')
const password = ref('Formule2026!')
const isLoading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    const res = await $fetch<{ success: boolean }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    if (res.success) {
      router.push('/admin')
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Identifiants invalides.'
  } finally {
    isLoading.value = false
  }
}
</script>
