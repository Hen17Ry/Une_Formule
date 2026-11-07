<script setup lang="ts">
import { Save, Plus, Trash2, ExternalLink } from '@lucide/vue'
import type { SiteSettings } from '#shared/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { push } = useToasts()
const refreshOverview = inject<() => void>('refreshOverview', () => {})

const s = ref<SiteSettings | null>(null)
const saving = ref(false)

onMounted(async () => {
  s.value = await adminFetch<SiteSettings>('/api/admin/settings')
})

async function save() {
  if (!s.value) return
  saving.value = true
  try {
    s.value = await adminFetch<SiteSettings>('/api/admin/settings', { method: 'PUT', body: s.value })
    push('Réglages enregistrés.')
    refreshOverview()
  } catch (e: any) { push(e?.data?.statusMessage || 'Enregistrement impossible.', 'error') }
  finally { saving.value = false }
}

const SUGGESTED = ['TheBookEdition', 'Amazon', 'Fnac']
function addLink(label = '') {
  if (!s.value || s.value.platformLinks.length >= 8) return
  s.value.platformLinks.push({ label, url: '' })
}
const inputCls = 'h-12 w-full rounded-2xl border border-line bg-paper/60 px-4 text-[0.98rem] focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15'
</script>

<template>
  <div>
    <header>
      <p class="label">Site</p>
      <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Réglages</h1>
    </header>

    <div v-if="!s" class="mt-10 h-96 max-w-3xl animate-pulse rounded-[24px] bg-white/70" />
    <form v-else class="mt-10 max-w-3xl space-y-6" @submit.prevent="save">
      <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
        <h2 class="font-display text-2xl">Où trouver le livre</h2>
        <p class="mt-2 text-sm text-ink-muted">Un bouton par plateforme de vente sur l’accueil. Sans lien, la section affiche « Bientôt disponible ».</p>
        <ul class="mt-6 space-y-3">
          <li v-for="(l, i) in s.platformLinks" :key="i" class="grid gap-2 sm:grid-cols-[11rem_1fr_auto]">
            <input v-model="l.label" maxlength="40" placeholder="Plateforme" aria-label="Nom de la plateforme" required :class="inputCls">
            <input v-model="l.url" type="url" maxlength="500" placeholder="https://…" aria-label="Lien" required :class="inputCls">
            <div class="flex gap-1">
              <a v-if="l.url" :href="l.url" target="_blank" rel="noopener" class="grid h-12 w-12 place-items-center rounded-full text-ink-muted hover:bg-paper-2 hover:text-ink" aria-label="Ouvrir le lien"><ExternalLink class="h-4 w-4" aria-hidden="true" /></a>
              <button type="button" class="grid h-12 w-12 place-items-center rounded-full text-ink-muted hover:bg-danger/10 hover:text-danger" aria-label="Retirer cette plateforme" @click="s.platformLinks.splice(i, 1)"><Trash2 class="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </li>
        </ul>
        <div v-if="s.platformLinks.length < 8" class="mt-4 flex flex-wrap gap-2">
          <button type="button" class="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm hover:border-caramel" @click="addLink()"><Plus class="h-4 w-4" aria-hidden="true" />Ajouter</button>
          <button v-for="name in SUGGESTED.filter(n => !s!.platformLinks.some(l => l.label === n))" :key="name" type="button" class="inline-flex h-10 items-center rounded-full bg-paper-2/70 px-4 text-sm text-ink-soft hover:text-ink" @click="addLink(name)">+ {{ name }}</button>
        </div>
      </section>

      <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
        <h2 class="font-display text-2xl">Mentions légales</h2>
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          <label class="block"><span class="mb-2 block text-sm font-medium">Email de contact</span><input v-model="s.contactEmail" type="email" maxlength="120" placeholder="contact@uneformule.com" :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">Affiché dans les mentions légales et le pied de page.</span></label>
          <label class="block"><span class="mb-2 block text-sm font-medium">ISBN</span><input v-model="s.isbn" maxlength="30" placeholder="978-…" :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">Masqué tant qu’il est vide.</span></label>
        </div>
      </section>

      <div class="flex justify-end"><UiButton type="submit" :loading="saving" :icon-left="Save">Enregistrer</UiButton></div>
    </form>
  </div>
</template>
