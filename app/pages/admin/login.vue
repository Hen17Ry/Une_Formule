<script setup lang="ts">
import { Lock } from '@lucide/vue'
definePageMeta({ layout: 'bare', middleware: 'admin' })
useHead({ title: 'Connexion — Administration Une Formule', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    const next = String(route.query.next || '/admin')
    await navigateTo(next.startsWith('/admin') ? next : '/admin')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Connexion impossible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-16">
    <BrandRings class="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-50" />
    <div class="relative w-full max-w-md">
      <div class="text-center">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full font-display text-3xl text-[#FFFDF9] shadow-book [background:var(--cover-gradient)]">Ω</span>
        <h1 class="mt-6 font-display text-4xl">Administration</h1>
        <p class="mt-2 font-sans text-sm text-ink-muted">Avis des lecteurs, commandes et réglages.</p>
      </div>
      <form class="surface mt-10 space-y-6 p-8" @submit.prevent="submit">
        <UiField v-model="email" label="Email" type="email" autocomplete="username" required />
        <UiField v-model="password" label="Mot de passe" type="password" autocomplete="current-password" required />
        <p v-if="error" class="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 font-sans text-sm text-danger" role="alert">{{ error }}</p>
        <UiButton type="submit" block size="lg" :loading="loading" :icon-left="Lock" :magnetic="false">Se connecter</UiButton>
      </form>
      <p class="mt-6 text-center"><NuxtLink to="/" class="font-sans text-sm text-ink-muted hover:text-ink">← Retour au site</NuxtLink></p>
    </div>
  </div>
</template>
