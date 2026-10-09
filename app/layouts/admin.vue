<script setup lang="ts">
import { LayoutDashboard, MessageSquareQuote, Package, Settings, LogOut, ExternalLink, Menu, X, KeyRound } from '@lucide/vue'

const route = useRoute()
const open = ref(false)
const { toasts } = useToasts()
const { data: me } = useFetch<{ email: string | null }>('/api/auth/me', { server: false })
const { data: overview, refresh } = useFetch<any>('/api/admin/overview', { server: false, key: 'admin-overview' })
provide('refreshOverview', refresh)

const nav = computed(() => [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { to: '/admin/avis', label: 'Avis des lecteurs', icon: MessageSquareQuote, badge: overview.value?.reviews?.pending },
  { to: '/admin/commandes', label: 'Commandes', icon: Package, badge: overview.value?.orders?.toShip },
  { to: '/admin/reglages', label: 'Réglages', icon: Settings },
  { to: '/admin/acces', label: 'Accès', icon: KeyRound }
])
const isActive = (to: string, exact?: boolean) => exact ? route.path === to : route.path.startsWith(to)
watch(() => route.fullPath, () => { open.value = false; refresh() })

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
useHead({ title: 'Administration — Une Formule', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>

<template>
  <div class="min-h-dvh bg-paper-2/50 font-sans">
    <!-- Barre latérale -->
    <aside class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-paper transition-transform duration-500 ease-expo lg:translate-x-0" :class="open ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex h-20 items-center gap-3 px-6">
        <span class="grid h-10 w-10 place-items-center rounded-full font-display text-xl text-[#FFFDF9] [background:var(--cover-gradient)]">Ω</span>
        <div>
          <p class="font-display text-lg font-semibold uppercase leading-none tracking-[0.12em]">Une Formule</p>
          <p class="mt-1 text-xs text-ink-muted">Administration</p>
        </div>
      </div>
      <nav class="flex-1 space-y-1 px-3 py-4" aria-label="Administration">
        <NuxtLink
          v-for="n in nav"
          :key="n.to"
          :to="n.to"
          class="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 text-[0.95rem] transition-colors"
          :class="isActive(n.to, n.exact) ? 'bg-copper text-[#FFFDF9] shadow-soft' : 'text-ink-soft hover:bg-paper-2 hover:text-ink'"
        >
          <component :is="n.icon" class="h-5 w-5" aria-hidden="true" />
          <span class="flex-1">{{ n.label }}</span>
          <span v-if="n.badge" class="grid h-6 min-w-6 place-items-center rounded-full px-2 text-xs font-medium" :class="isActive(n.to, n.exact) ? 'bg-white/20' : 'bg-caramel text-[#FFFDF9]'">{{ n.badge }}</span>
        </NuxtLink>
      </nav>
      <div class="space-y-1 border-t border-line p-3">
        <a href="/" target="_blank" class="flex min-h-[44px] items-center gap-3 rounded-2xl px-4 text-sm text-ink-soft hover:bg-paper-2"><ExternalLink class="h-4 w-4" aria-hidden="true" /> Voir le site</a>
        <button type="button" class="flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 text-sm text-ink-soft hover:bg-paper-2" @click="logout"><LogOut class="h-4 w-4" aria-hidden="true" /> Se déconnecter</button>
        <p v-if="me?.email" class="truncate px-4 pt-2 text-xs text-ink-muted">{{ me.email }}</p>
      </div>
    </aside>
    <div v-if="open" class="fixed inset-0 z-30 bg-ink/20 backdrop-blur-sm lg:hidden" aria-hidden="true" @click="open = false" />

    <div class="lg:pl-72">
      <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-paper/85 px-5 backdrop-blur-xl lg:hidden">
        <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-line" :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'" @click="open = !open">
          <X v-if="open" class="h-5 w-5" aria-hidden="true" /><Menu v-else class="h-5 w-5" aria-hidden="true" />
        </button>
        <p class="font-display text-lg font-semibold uppercase tracking-[0.12em]">Admin</p>
        <span class="w-11" />
      </header>
      <main class="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <div v-if="overview && (overview.storage === 'file' || !overview.paymentReady)" class="mb-8 space-y-2">
          <p v-if="overview.storage === 'file'" class="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3 text-sm text-ink-soft"><strong>Base de données non connectée :</strong> les données sont stockées dans un fichier local. En production, définissez <code>DATABASE_URL</code> (PostgreSQL).</p>
          <p v-if="!overview.paymentReady" class="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3 text-sm text-ink-soft"><strong>Paiement non configuré :</strong> ajoutez les clés KkiaPay (voir Réglages) pour ouvrir les commandes en ligne.</p>
        </div>
        <slot />
      </main>
    </div>

    <div class="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2" aria-live="polite">
      <TransitionGroup enter-active-class="transition duration-500 ease-expo" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition duration-300" leave-to-class="opacity-0">
        <p v-for="t in toasts" :key="t.id" class="pointer-events-auto rounded-2xl px-5 py-3 text-sm shadow-lift" :class="t.tone === 'ok' ? 'border border-line border-l-4 border-l-ok bg-white text-ink' : 'border border-danger/30 border-l-4 border-l-danger bg-white text-danger'">{{ t.text }}</p>
      </TransitionGroup>
    </div>
  </div>
</template>
