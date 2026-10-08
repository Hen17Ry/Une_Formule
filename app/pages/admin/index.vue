<script setup lang="ts">
import { ArrowRight, Star, Check, EyeOff } from '@lucide/vue'
import { LEVERS, formatXof } from '~/data/book'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { data, refresh } = useFetch<any>('/api/admin/overview', { server: false, key: 'admin-overview' })
const { push } = useToasts()

const leverRows = computed(() => (data.value?.reviews.byLever ?? []).map((r: any) => ({
  ...r,
  label: r.key === 'general' ? 'Général' : `L${r.key} · ${LEVERS[Number(r.key) - 1]?.short}`,
  color: r.key === 'general' ? '#A36B43' : LEVERS[Number(r.key) - 1]?.color
})))
const maxCount = computed(() => Math.max(1, ...leverRows.value.map((r: any) => r.count)))

async function quick(id: number, status: 'APPROVED' | 'REJECTED') {
  try {
    await adminFetch(`/api/admin/reviews/${id}`, { method: 'PATCH', body: { status } })
    push(status === 'APPROVED' ? 'Avis rendu visible.' : 'Avis masqué.')
    refresh()
  } catch (e: any) { push(e?.data?.statusMessage || 'Action impossible.', 'error') }
}

const EVENT_LABELS: Record<string, string> = {
  'review:created': 'Nouvel avis reçu', 'review:approved': 'Avis rendu visible', 'review:hidden': 'Avis masqué', 'review:reset': 'Avis remis en attente', 'review:edited': 'Avis modifié', 'review:deleted': 'Avis supprimé',
  'order:created': 'Commande créée', 'order:paid': 'Paiement confirmé', 'order:status_shipped': 'Commande expédiée', 'order:status_delivered': 'Commande livrée', 'order:status_cancelled': 'Commande annulée', 'order:note': 'Note ajoutée',
  'settings:updated': 'Réglages mis à jour', 'auth:login': 'Connexion admin'
}
const eventLabel = (e: any) => EVENT_LABELS[`${e.entity}:${e.action}`] || `${e.entity} · ${e.action}`
</script>

<template>
  <div>
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label">Tableau de bord</p>
        <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Bonjour.</h1>
      </div>
      <p v-if="data" class="text-sm text-ink-muted">Mode de vente : <strong class="text-ink">{{ data.settings.saleMode === 'PREORDER' ? 'Précommande' : 'Disponible' }}</strong> · {{ formatXof(data.settings.priceXof) }}</p>
    </header>

    <div v-if="!data" class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="i in 4" :key="i" class="h-32 animate-pulse rounded-[24px] bg-white/70" />
    </div>
    <template v-else>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink to="/admin/avis?status=PENDING" class="group rounded-[24px] border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
          <p class="label">Avis en attente</p>
          <p class="mt-3 font-display text-5xl">{{ data.reviews.pending }}</p>
          <p class="mt-2 flex items-center gap-1 text-sm text-ink-muted">À modérer <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></p>
        </NuxtLink>
        <div class="rounded-[24px] border border-line bg-white p-6 shadow-soft">
          <p class="label">Note moyenne</p>
          <p class="mt-3 flex items-baseline gap-2 font-display text-5xl">{{ data.reviews.average ? String(data.reviews.average).replace('.', ',') : '—' }}<Star class="h-6 w-6 fill-gold text-gold-deep" :stroke-width="1.4" aria-hidden="true" /></p>
          <p class="mt-2 text-sm text-ink-muted">{{ data.reviews.total }} avis · {{ data.reviews.approved }} visibles</p>
        </div>
        <NuxtLink to="/admin/commandes?status=PAID" class="group rounded-[24px] border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
          <p class="label">Commandes payées</p>
          <p class="mt-3 font-display text-5xl">{{ data.orders.paid }}</p>
          <p class="mt-2 flex items-center gap-1 text-sm text-ink-muted">{{ data.orders.toShip }} à expédier <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></p>
        </NuxtLink>
        <div class="rounded-[24px] p-6 text-[#FFFDF9] shadow-soft [background:var(--cover-soft)]">
          <p class="font-sans text-[0.72rem] font-medium uppercase tracking-label text-white/85">Chiffre d’affaires</p>
          <p class="mt-3 font-display text-[2.4rem] leading-tight">{{ formatXof(data.orders.revenue) }}</p>
          <p class="mt-2 text-sm text-white/90">{{ data.orders.copies }} exemplaire{{ data.orders.copies > 1 ? 's' : '' }} vendu{{ data.orders.copies > 1 ? 's' : '' }}</p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="pending-title">
          <div class="flex items-center justify-between">
            <h2 id="pending-title" class="font-display text-2xl">À modérer</h2>
            <NuxtLink to="/admin/avis" class="text-sm text-copper hover:underline">Tout voir</NuxtLink>
          </div>
          <ul v-if="data.reviews.latestPending.length" class="mt-5 divide-y divide-line">
            <li v-for="r in data.reviews.latestPending" :key="r.id" class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <NuxtLink :to="`/admin/avis?id=${r.id}`" class="min-w-0 flex-1">
                <p class="text-xs text-ink-muted">{{ r.kind === 'GENERAL' ? 'Retour général' : `Levier ${r.lever}` }} · {{ fmtDate(r.createdAt) }} · {{ r.rating }}/5</p>
                <p class="mt-1 line-clamp-2 font-serif text-[1.02rem] text-ink">{{ Object.values(r.answers)[0] || '(sans commentaire)' }}</p>
              </NuxtLink>
              <div class="flex shrink-0 gap-2">
                <button v-if="r.consent !== 'NO'" type="button" class="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ok/10 px-4 text-sm text-ok hover:bg-ok/20" @click="quick(r.id, 'APPROVED')"><Check class="h-4 w-4" aria-hidden="true" /> Visible</button>
                <button type="button" class="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink/[.05] px-4 text-sm text-ink-soft hover:bg-ink/10" @click="quick(r.id, 'REJECTED')"><EyeOff class="h-4 w-4" aria-hidden="true" /> Masquer</button>
              </div>
            </li>
          </ul>
          <p v-else class="mt-6 rounded-2xl bg-paper-2/60 px-5 py-8 text-center text-sm text-ink-muted">Aucun avis en attente.</p>
        </section>

        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="levers-title">
          <h2 id="levers-title" class="font-display text-2xl">Retours par levier</h2>
          <ul class="mt-5 space-y-3">
            <li v-for="r in leverRows" :key="r.key" class="grid grid-cols-[9rem_1fr_3.5rem] items-center gap-3 text-sm">
              <span class="truncate text-ink-soft" :title="r.label">{{ r.label }}</span>
              <span class="h-2.5 overflow-hidden rounded-full bg-paper-2"><span class="block h-full rounded-full transition-all duration-700" :style="{ width: `${(r.count / maxCount) * 100}%`, background: r.color }" /></span>
              <span class="text-right tabular-nums text-ink">{{ r.count }}<span v-if="r.average" class="text-ink-muted"> · {{ String(r.average).replace('.', ',') }}</span></span>
            </li>
          </ul>
          <p class="mt-4 text-xs text-ink-muted">Nombre de retours · note moyenne</p>
        </section>
      </div>

      <div class="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="orders-title">
          <div class="flex items-center justify-between">
            <h2 id="orders-title" class="font-display text-2xl">Dernières commandes</h2>
            <NuxtLink to="/admin/commandes" class="text-sm text-copper hover:underline">Tout voir</NuxtLink>
          </div>
          <ul v-if="data.orders.latest.length" class="mt-5 divide-y divide-line">
            <li v-for="o in data.orders.latest" :key="o.id">
              <NuxtLink :to="`/admin/commandes?id=${o.id}`" class="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p class="font-medium text-ink">{{ o.firstName }} {{ o.lastName }} <span class="font-normal text-ink-muted">· {{ o.city }}</span></p>
                  <p class="text-xs text-ink-muted">{{ o.reference }} · {{ fmtDate(o.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="tabular-nums">{{ formatXof(o.total) }}</span>
                  <span class="rounded-full px-3 py-1 text-xs" :class="ORDER_STATUS[o.status]?.cls">{{ ORDER_STATUS[o.status]?.label }}</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="mt-6 rounded-2xl bg-paper-2/60 px-5 py-8 text-center text-sm text-ink-muted">Aucune commande pour l’instant.</p>
        </section>

        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="activity-title">
          <h2 id="activity-title" class="font-display text-2xl">Activité</h2>
          <ol v-if="data.events.length" class="mt-5 space-y-4">
            <li v-for="e in data.events.slice(0, 10)" :key="e.id" class="flex gap-3 text-sm">
              <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-caramel" aria-hidden="true" />
              <div>
                <p class="text-ink">{{ eventLabel(e) }}<span v-if="e.entityId" class="text-ink-muted"> #{{ e.entityId }}</span></p>
                <p class="text-xs text-ink-muted">{{ fmtDate(e.createdAt) }} · {{ e.actor }}</p>
              </div>
            </li>
          </ol>
          <p v-else class="mt-6 text-sm text-ink-muted">Rien pour l’instant.</p>
        </section>
      </div>
    </template>
  </div>
</template>
