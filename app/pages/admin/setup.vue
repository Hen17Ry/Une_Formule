<script setup lang="ts">
import { KeyRound } from '@lucide/vue'
definePageMeta({ layout: 'bare' })
useHead({ title: 'Configurer l’accès — Administration Une Formule', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { data: status } = useFetch<{ enabled: boolean }>('/api/auth/setup', { server: false })
const form = reactive({ token: '', email: '', password: '', confirm: '' })
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function submit() {
  error.value = ''
  if (form.password !== form.confirm) { error.value = 'Les deux mots de passe ne correspondent pas.'; return }
  loading.value = true
  try {
    await $fetch('/api/auth/setup', { method: 'POST', body: { token: form.token, email: form.email, password: form.password } })
    done.value = true
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Opération impossible.'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-16">
    <BrandRings class="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-50" />
    <div class="relative w-full max-w-md">
      <div class="text-center">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full text-[#FFFDF9] shadow-book [background:var(--cover-gradient)]"><KeyRound class="h-7 w-7" aria-hidden="true" /></span>
        <h1 class="mt-6 font-display text-4xl">Configurer l’accès</h1>
        <p class="mt-2 font-sans text-sm text-ink-muted">Créer un compte administrateur ou réinitialiser son mot de passe.</p>
      </div>

      <div v-if="status && !status.enabled" class="surface mt-10 p-8 text-center font-sans text-sm text-ink-soft">
        Cette page est désactivée. Pour l’activer, ajoutez la variable <code class="rounded bg-paper-2 px-1.5 py-0.5">ADMIN_SETUP_TOKEN</code> sur Vercel puis redéployez.
      </div>

      <div v-else-if="done" class="surface mt-10 p-8 text-center" role="status">
        <p class="font-display text-2xl">C’est fait.</p>
        <p class="mt-2 font-sans text-sm text-ink-soft">Vous pouvez vous connecter. Pensez à supprimer <code class="rounded bg-paper-2 px-1.5 py-0.5">ADMIN_SETUP_TOKEN</code> sur Vercel.</p>
        <UiButton to="/admin/login" class="mt-6" :magnetic="false">Se connecter</UiButton>
      </div>

      <form v-else class="surface mt-10 space-y-5 p-8" @submit.prevent="submit">
        <UiField v-model="form.token" label="Code de configuration" autocomplete="off" raw required hint="La valeur de ADMIN_SETUP_TOKEN, copiée depuis Vercel." />
        <UiField v-model="form.email" label="Email de l’administrateur" type="email" autocomplete="username" required />
        <UiField v-model="form.password" label="Nouveau mot de passe" type="password" autocomplete="new-password" required hint="10 caractères minimum." />
        <UiField v-model="form.confirm" label="Confirmer le mot de passe" type="password" autocomplete="new-password" required />
        <p v-if="error" class="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 font-sans text-sm text-danger" role="alert">{{ error }}</p>
        <UiButton type="submit" block size="lg" :loading="loading" :magnetic="false">Enregistrer</UiButton>
      </form>
      <p class="mt-6 text-center"><NuxtLink to="/admin/login" class="font-sans text-sm text-ink-muted hover:text-ink">← Connexion</NuxtLink></p>
    </div>
  </div>
</template>
