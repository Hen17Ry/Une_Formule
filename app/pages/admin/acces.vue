<script setup lang="ts">
import { KeyRound, UserPlus, Trash2, ShieldAlert } from '@lucide/vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { push } = useToasts()

interface Admin { id: number, email: string, createdAt: string | null, me: boolean, needsReset: boolean }
const admins = ref<Admin[]>([])
const loading = ref(true)
const pw = reactive({ current: '', next: '', confirm: '' })
const pwSaving = ref(false)
const add = reactive({ email: '', password: '' })
const adding = ref(false)

async function load() {
  loading.value = true
  try { admins.value = await adminFetch<Admin[]>('/api/admin/admins') } finally { loading.value = false }
}
onMounted(load)

async function changePassword() {
  if (pw.next !== pw.confirm) return push('Les deux nouveaux mots de passe ne correspondent pas.', 'error')
  pwSaving.value = true
  try {
    await adminFetch('/api/admin/password', { method: 'POST', body: { current: pw.current, next: pw.next } })
    Object.assign(pw, { current: '', next: '', confirm: '' })
    push('Mot de passe modifié.')
  } catch (e: any) { push(e?.data?.statusMessage || 'Modification impossible.', 'error') }
  finally { pwSaving.value = false }
}

async function addAdmin() {
  adding.value = true
  try {
    await adminFetch('/api/admin/admins', { method: 'POST', body: { ...add } })
    push(`Accès créé pour ${add.email}.`)
    Object.assign(add, { email: '', password: '' })
    load()
  } catch (e: any) { push(e?.data?.statusMessage || 'Création impossible.', 'error') }
  finally { adding.value = false }
}

async function remove(a: Admin) {
  if (!confirm(`Retirer l’accès de ${a.email} ?`)) return
  try {
    await adminFetch(`/api/admin/admins/${a.id}`, { method: 'DELETE' })
    push('Accès retiré.')
    load()
  } catch (e: any) { push(e?.data?.statusMessage || 'Suppression impossible.', 'error') }
}

const inputCls = 'h-12 w-full rounded-2xl border border-line bg-paper/60 px-4 text-[0.98rem] focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15'
</script>

<template>
  <div>
    <header>
      <p class="label">Sécurité</p>
      <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Accès administrateurs</h1>
      <p class="mt-2 max-w-2xl text-sm text-ink-muted">Les comptes sont enregistrés dans la base de données, avec des mots de passe chiffrés. Chaque administrateur se connecte avec son propre email.</p>
    </header>

    <div class="mt-10 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="pw-title">
        <h2 id="pw-title" class="flex items-center gap-2 font-display text-2xl"><KeyRound class="h-5 w-5 text-caramel" aria-hidden="true" /> Mon mot de passe</h2>
        <form class="mt-6 space-y-4" @submit.prevent="changePassword">
          <label class="block"><span class="mb-2 block text-sm font-medium">Mot de passe actuel</span><input v-model="pw.current" type="password" autocomplete="current-password" required :class="inputCls"></label>
          <label class="block"><span class="mb-2 block text-sm font-medium">Nouveau mot de passe</span><input v-model="pw.next" type="password" autocomplete="new-password" minlength="10" required :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">10 caractères minimum.</span></label>
          <label class="block"><span class="mb-2 block text-sm font-medium">Confirmer</span><input v-model="pw.confirm" type="password" autocomplete="new-password" minlength="10" required :class="inputCls"></label>
          <UiButton type="submit" :loading="pwSaving" :magnetic="false">Modifier</UiButton>
        </form>
      </section>

      <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="admins-title">
        <h2 id="admins-title" class="font-display text-2xl">Administrateurs</h2>
        <div v-if="loading" class="mt-6 space-y-2"><div v-for="i in 2" :key="i" class="h-14 animate-pulse rounded-2xl bg-paper-2/70" /></div>
        <ul v-else class="mt-6 divide-y divide-line rounded-2xl border border-line">
          <li v-for="a in admins" :key="a.id" class="flex items-center gap-3 px-4 py-3.5">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[#FFFDF9] [background:var(--cover-soft)]" aria-hidden="true">{{ a.email.charAt(0).toUpperCase() }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-ink">{{ a.email }} <span v-if="a.me" class="font-normal text-ink-muted">(vous)</span></p>
              <p v-if="a.needsReset" class="mt-0.5 flex items-center gap-1 text-xs text-gold-deep"><ShieldAlert class="h-3.5 w-3.5" aria-hidden="true" /> Ancien mot de passe : sera sécurisé à sa prochaine connexion</p>
              <p v-else class="mt-0.5 text-xs text-ink-muted">Depuis le {{ fmtDate(a.createdAt, false) }}</p>
            </div>
            <button v-if="!a.me && admins.length > 1" type="button" class="grid h-10 w-10 place-items-center rounded-full text-danger hover:bg-danger/5" :aria-label="`Retirer l’accès de ${a.email}`" @click="remove(a)"><Trash2 class="h-4 w-4" aria-hidden="true" /></button>
          </li>
        </ul>

        <form class="mt-8 rounded-2xl bg-paper-2/60 p-5" @submit.prevent="addAdmin">
          <p class="flex items-center gap-2 text-sm font-medium"><UserPlus class="h-4 w-4 text-caramel" aria-hidden="true" /> Ajouter un administrateur</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <label class="block"><span class="sr-only">Email</span><input v-model="add.email" type="email" placeholder="email@exemple.com" autocomplete="off" required :class="inputCls"></label>
            <label class="block"><span class="sr-only">Mot de passe provisoire</span><input v-model="add.password" type="password" placeholder="Mot de passe provisoire" autocomplete="new-password" minlength="10" required :class="inputCls"></label>
          </div>
          <p class="mt-2 text-xs text-ink-muted">Transmettez-lui ce mot de passe ; il pourra le changer depuis cette page.</p>
          <UiButton type="submit" size="sm" variant="outline" class="mt-4" :loading="adding" :magnetic="false">Créer l’accès</UiButton>
        </form>
      </section>
    </div>
  </div>
</template>
