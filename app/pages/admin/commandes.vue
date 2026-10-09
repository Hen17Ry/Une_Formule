<script setup lang="ts">
import { Search, Download, X, Phone, Mail, MapPin } from '@lucide/vue'
import type { Order } from '#shared/types'
import { formatXof } from '~/data/book'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute()
const router = useRouter()
const { push } = useToasts()
const refreshOverview = inject<() => void>('refreshOverview', () => {})

const status = ref(String(route.query.status || ''))
const q = ref('')
const items = ref<Order[]>([])
const loading = ref(true)
const selectedId = ref<number | null>(route.query.id ? Number(route.query.id) : null)
const note = ref('')

const filters = [
  { value: '', label: 'Toutes' },
  { value: 'PAID', label: 'À expédier' },
  { value: 'SHIPPED', label: 'Expédiées' },
  { value: 'DELIVERED', label: 'Livrées' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'FAILED', label: 'Échecs' },
  { value: 'CANCELLED', label: 'Annulées' }
]
const NEXT: Record<string, { status: string, label: string }[]> = {
  PENDING: [{ status: 'PAID', label: 'Marquer payée (manuel)' }, { status: 'CANCELLED', label: 'Annuler' }],
  PAID: [{ status: 'SHIPPED', label: 'Marquer expédiée' }, { status: 'CANCELLED', label: 'Annuler' }],
  SHIPPED: [{ status: 'DELIVERED', label: 'Marquer livrée' }],
  DELIVERED: [],
  FAILED: [{ status: 'CANCELLED', label: 'Archiver (annuler)' }],
  CANCELLED: [{ status: 'PENDING', label: 'Rouvrir' }]
}

async function load() {
  loading.value = true
  try { items.value = await adminFetch<Order[]>('/api/admin/orders', { query: { status: status.value || undefined, q: q.value || undefined } }) }
  finally { loading.value = false }
}
let t: ReturnType<typeof setTimeout> | undefined
watch(status, () => { router.replace({ query: { ...route.query, status: status.value || undefined } }); load() })
watch(q, () => { clearTimeout(t); t = setTimeout(load, 300) })
onMounted(load)

const selected = computed(() => items.value.find(o => o.id === selectedId.value) ?? null)
watch(selected, o => { note.value = o?.adminNote ?? '' }, { immediate: true })

async function patch(body: Record<string, unknown>, msg: string) {
  if (!selected.value) return
  if (body.status === 'CANCELLED' && !confirm('Annuler cette commande ?')) return
  try {
    const updated = await adminFetch<Order>(`/api/admin/orders/${selected.value.id}`, { method: 'PATCH', body })
    const i = items.value.findIndex(o => o.id === updated.id)
    if (i >= 0) items.value[i] = updated
    push(msg)
    refreshOverview()
  } catch (e: any) { push(e?.data?.statusMessage || 'Action impossible.', 'error') }
}

const totals = computed(() => ({
  count: items.value.length,
  copies: items.value.filter(o => ['PAID', 'SHIPPED', 'DELIVERED'].includes(o.status)).reduce((s, o) => s + o.quantity, 0)
}))
</script>

<template>
  <div>
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label">Ventes</p>
        <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Commandes</h1>
      </div>
      <a href="/api/admin/orders/export" class="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-5 text-sm text-ink-soft hover:border-caramel hover:text-ink"><Download class="h-4 w-4" aria-hidden="true" /> Exporter (CSV)</a>
    </header>

    <div class="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap gap-1 rounded-[22px] border border-line bg-white p-1">
        <button v-for="f in filters" :key="f.value" type="button" class="min-h-[40px] rounded-full px-4 text-sm transition-colors" :class="status === f.value ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'" :aria-pressed="status === f.value" @click="status = f.value">{{ f.label }}</button>
      </div>
      <label class="relative">
        <span class="sr-only">Rechercher une commande</span>
        <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input v-model="q" type="search" placeholder="Référence, nom, téléphone…" class="h-11 w-72 rounded-full border border-line bg-white pl-10 pr-4 text-sm focus:border-caramel focus:outline-none">
      </label>
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div class="overflow-hidden rounded-[24px] border border-line bg-white shadow-soft">
        <div v-if="loading" class="space-y-3 p-5"><div v-for="i in 5" :key="i" class="h-14 animate-pulse rounded-2xl bg-paper-2/70" /></div>
        <div v-else-if="items.length" class="overflow-x-auto">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="border-b border-line bg-paper-2/50 text-xs uppercase tracking-[0.14em] text-ink-muted">
              <tr><th class="px-5 py-3 font-medium">Commande</th><th class="px-5 py-3 font-medium">Client</th><th class="px-5 py-3 font-medium">Qté</th><th class="px-5 py-3 font-medium">Total</th><th class="px-5 py-3 font-medium">Statut</th></tr>
            </thead>
            <tbody class="divide-y divide-line">
              <tr v-for="o in items" :key="o.id" class="cursor-pointer transition-colors hover:bg-paper-2/50" :class="selectedId === o.id && 'bg-paper-2/80'" tabindex="0" @click="selectedId = o.id" @keydown.enter="selectedId = o.id">
                <td class="px-5 py-4"><p class="font-medium tracking-wide">{{ o.reference }}</p><p class="text-xs text-ink-muted">{{ fmtDate(o.createdAt) }}</p></td>
                <td class="px-5 py-4"><p>{{ o.firstName }} {{ o.lastName }}</p><p class="text-xs text-ink-muted">{{ o.city }}, {{ o.country }}</p></td>
                <td class="px-5 py-4 tabular-nums">{{ o.quantity }}</td>
                <td class="px-5 py-4 tabular-nums">{{ formatXof(o.total) }}</td>
                <td class="px-5 py-4"><span class="whitespace-nowrap rounded-full px-3 py-1 text-xs" :class="ORDER_STATUS[o.status]?.cls">{{ ORDER_STATUS[o.status]?.label }}</span></td>
              </tr>
            </tbody>
          </table>
          <p class="border-t border-line px-5 py-3 text-xs text-ink-muted">{{ totals.count }} commande(s) · {{ totals.copies }} exemplaire(s) payé(s) dans cette vue</p>
        </div>
        <p v-else class="px-6 py-16 text-center text-sm text-ink-muted">Aucune commande pour ce filtre.</p>
      </div>

      <div v-if="selected" class="fixed inset-0 z-40 overflow-y-auto bg-paper p-5 xl:static xl:z-auto xl:bg-transparent xl:p-0">
        <article class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8 xl:sticky xl:top-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-ink-muted">{{ selected.saleMode === 'PREORDER' ? 'Précommande' : 'Commande' }} · {{ fmtDate(selected.createdAt) }}</p>
              <h2 class="mt-1 font-display text-[2rem] leading-tight tracking-wide">{{ selected.reference }}</h2>
              <span class="mt-2 inline-block rounded-full px-3 py-1 text-xs" :class="ORDER_STATUS[selected.status]?.cls">{{ ORDER_STATUS[selected.status]?.label }}</span>
            </div>
            <button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line hover:bg-paper-2" aria-label="Fermer" @click="selectedId = null"><X class="h-4 w-4" aria-hidden="true" /></button>
          </div>

          <section class="mt-6 space-y-2 rounded-[20px] bg-paper-2/60 p-5 text-sm">
            <p class="font-medium text-ink">{{ selected.firstName }} {{ selected.lastName }}</p>
            <p class="flex items-center gap-2"><Phone class="h-4 w-4 text-ink-muted" aria-hidden="true" /><a :href="`tel:${selected.phone}`" class="text-copper hover:underline">{{ selected.phone }}</a></p>
            <p class="flex items-center gap-2"><Mail class="h-4 w-4 text-ink-muted" aria-hidden="true" /><a :href="`mailto:${selected.email}`" class="text-copper hover:underline">{{ selected.email }}</a></p>
            <p class="flex items-start gap-2"><MapPin class="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />{{ selected.address }}, {{ selected.city }}, {{ selected.country }}</p>
            <p v-if="selected.notes" class="border-t border-line pt-2 italic text-ink-soft">« {{ selected.notes }} »</p>
          </section>

          <dl class="mt-5 space-y-2 text-sm">
            <div class="flex justify-between"><dt class="text-ink-muted">{{ selected.quantity }} × {{ formatXof(selected.unitPrice) }}</dt><dd>{{ formatXof(selected.unitPrice * selected.quantity) }}</dd></div>
            <div class="flex justify-between"><dt class="text-ink-muted">Livraison</dt><dd>{{ selected.shippingFee ? formatXof(selected.shippingFee) : 'Offerte' }}</dd></div>
            <div class="flex justify-between border-t border-line pt-2 text-base font-medium"><dt>Total</dt><dd>{{ formatXof(selected.total) }}</dd></div>
            <div v-if="selected.transactionId" class="flex justify-between pt-2"><dt class="text-ink-muted">Transaction KkiaPay</dt><dd class="font-mono text-xs">{{ selected.transactionId }}</dd></div>
            <div v-if="selected.paymentMethod" class="flex justify-between"><dt class="text-ink-muted">Moyen</dt><dd>{{ selected.paymentMethod }}</dd></div>
            <div v-if="selected.paidAt" class="flex justify-between"><dt class="text-ink-muted">Payée le</dt><dd>{{ fmtDate(selected.paidAt) }}</dd></div>
          </dl>

          <div class="mt-6">
            <label for="order-note" class="text-sm font-medium">Note interne</label>
            <textarea id="order-note" v-model="note" rows="3" maxlength="1000" class="mt-2 w-full rounded-2xl border border-line bg-paper/60 px-4 py-3 text-sm focus:border-caramel focus:outline-none" placeholder="N° de suivi, créneau de livraison…" />
            <button type="button" class="mt-1 text-xs text-copper hover:underline" @click="patch({ adminNote: note }, 'Note enregistrée.')">Enregistrer la note</button>
          </div>

          <div v-if="NEXT[selected.status]?.length" class="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
            <UiButton v-for="(n, i) in NEXT[selected.status]" :key="n.status" size="sm" :variant="i === 0 && n.status !== 'CANCELLED' ? 'primary' : 'outline'" :magnetic="false" @click="patch({ status: n.status }, 'Statut mis à jour.')">{{ n.label }}</UiButton>
          </div>
        </article>
      </div>
      <div v-else class="hidden place-items-center rounded-[24px] border border-dashed border-line-strong bg-white/40 p-10 text-center text-sm text-ink-muted xl:grid">
        Sélectionnez une commande pour voir l’adresse de livraison et mettre à jour son statut.
      </div>
    </div>
  </div>
</template>
