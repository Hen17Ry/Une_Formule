<script setup lang="ts">
import { Search, Check, EyeOff, RotateCcw, Trash2, Star, Mail, Sparkles, X, Lock } from '@lucide/vue'
import type { Review } from '#shared/types'
import { LEVERS, ANSWER_LABELS, PRACTICED_OPTIONS, CONSENT_OPTIONS } from '~/data/book'

definePageMeta({ layout: 'admin', middleware: 'admin' })
type AdminReview = Review & { suggestedQuote: string | null, publishable: boolean }

const route = useRoute()
const router = useRouter()
const { push } = useToasts()
const refreshOverview = inject<() => void>('refreshOverview', () => {})

const status = ref<string>(String(route.query.status || 'PENDING'))
const lever = ref<string>(String(route.query.lever || ''))
const q = ref('')
const items = ref<AdminReview[]>([])
const loading = ref(true)
const selectedId = ref<number | null>(route.query.id ? Number(route.query.id) : null)
const quote = ref('')
const saving = ref(false)

const tabs = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'APPROVED', label: 'Visibles' },
  { value: 'REJECTED', label: 'Masqués' },
  { value: '', label: 'Tous' }
]

async function load() {
  loading.value = true
  try {
    items.value = await adminFetch<AdminReview[]>('/api/admin/reviews', { query: { status: status.value || undefined, lever: lever.value || undefined, q: q.value || undefined } })
    if (selectedId.value && !items.value.some(i => i.id === selectedId.value)) {
      // l’avis demandé n’est pas dans ce filtre : on élargit
      if (status.value) { status.value = ''; return }
    }
  } finally { loading.value = false }
}
let t: ReturnType<typeof setTimeout> | undefined
watch([status, lever], () => { router.replace({ query: { ...route.query, status: status.value || undefined, lever: lever.value || undefined } }); load() })
watch(q, () => { clearTimeout(t); t = setTimeout(load, 300) })
onMounted(load)

const selected = computed(() => items.value.find(i => i.id === selectedId.value) ?? null)
watch(selected, (r) => { quote.value = r?.publicQuote ?? r?.suggestedQuote ?? '' }, { immediate: true })

function pick(id: number) {
  selectedId.value = id
  router.replace({ query: { ...route.query, id } })
}
function close() {
  selectedId.value = null
  const { id: _, ...rest } = route.query
  router.replace({ query: rest })
}

async function update(patch: Record<string, unknown>, okMsg: string) {
  if (!selected.value) return
  saving.value = true
  try {
    const updated = await adminFetch<AdminReview>(`/api/admin/reviews/${selected.value.id}`, { method: 'PATCH', body: patch })
    const idx = items.value.findIndex(i => i.id === updated.id)
    if (idx >= 0) items.value[idx] = updated
    push(okMsg)
    refreshOverview()
  } catch (e: any) {
    push(e?.data?.statusMessage || 'Action impossible.', 'error')
  } finally { saving.value = false }
}

const approve = () => update({ status: 'APPROVED', publicQuote: quote.value.trim() || null }, 'Avis visible sur le site.')
const hide = () => update({ status: 'REJECTED' }, 'Avis masqué.')
const reset = () => update({ status: 'PENDING' }, 'Avis remis en attente.')
const saveQuote = () => update({ publicQuote: quote.value.trim() || null }, 'Extrait public enregistré.')
const toggleFeatured = () => update({ featured: !selected.value?.featured }, selected.value?.featured ? 'Avis retiré de la une.' : 'Avis mis en avant.')

async function remove() {
  if (!selected.value || !confirm('Supprimer définitivement cet avis ? Cette action est irréversible.')) return
  try {
    await adminFetch(`/api/admin/reviews/${selected.value.id}`, { method: 'DELETE' })
    items.value = items.value.filter(i => i.id !== selected.value!.id)
    close()
    push('Avis supprimé.')
    refreshOverview()
  } catch (e: any) { push(e?.data?.statusMessage || 'Suppression impossible.', 'error') }
}

const leverName = (r: Review) => r.kind === 'GENERAL' ? 'Retour général' : `Levier ${r.lever} · ${LEVERS[(r.lever ?? 1) - 1]?.short}`
const leverColor = (r: Review) => r.kind === 'GENERAL' ? '#A36B43' : LEVERS[(r.lever ?? 1) - 1]?.color
const preview = (r: Review) => Object.values(r.answers).find(Boolean) || '(aucun texte, note seule)'
const practicedLabel = (v: string | null) => PRACTICED_OPTIONS.find(o => o.value === v)?.label ?? '—'
const consentLabel = (v: string) => CONSENT_OPTIONS.find(o => o.value === v)?.label ?? v
</script>

<template>
  <div>
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label">Modération</p>
        <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Avis des lecteurs</h1>
      </div>
    </header>

    <div class="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap gap-1 rounded-full border border-line bg-white p-1" role="tablist" aria-label="Statut">
        <button v-for="tab in tabs" :key="tab.value" type="button" role="tab" :aria-selected="status === tab.value" class="min-h-[40px] rounded-full px-4 text-sm transition-colors" :class="status === tab.value ? 'bg-copper text-[#FFFDF9]' : 'text-ink-soft hover:text-ink'" @click="status = tab.value">{{ tab.label }}</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <select v-model="lever" aria-label="Filtrer par levier" class="h-11 rounded-full border border-line bg-white px-4 text-sm focus:border-caramel focus:outline-none">
          <option value="">Tous les leviers</option>
          <option value="general">Retour général</option>
          <option v-for="l in LEVERS" :key="l.n" :value="String(l.n)">Levier {{ l.n }} · {{ l.short }}</option>
        </select>
        <label class="relative">
          <span class="sr-only">Rechercher</span>
          <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input v-model="q" type="search" placeholder="Rechercher…" class="h-11 w-56 rounded-full border border-line bg-white pl-10 pr-4 text-sm focus:border-caramel focus:outline-none">
        </label>
      </div>
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <!-- Liste -->
      <div class="rounded-[24px] border border-line bg-white shadow-soft">
        <div v-if="loading" class="space-y-3 p-5"><div v-for="i in 5" :key="i" class="h-20 animate-pulse rounded-2xl bg-paper-2/70" /></div>
        <ul v-else-if="items.length" class="divide-y divide-line">
          <li v-for="r in items" :key="r.id">
            <button type="button" class="flex w-full gap-4 px-5 py-4 text-left transition-colors hover:bg-paper-2/50" :class="selectedId === r.id && 'bg-paper-2/80'" @click="pick(r.id)">
              <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: leverColor(r) }" aria-hidden="true" />
              <span class="min-w-0 flex-1">
                <span class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <span>{{ leverName(r) }}</span>
                  <span class="inline-flex items-center gap-0.5">{{ r.rating }}<Star class="h-3 w-3 fill-gold text-gold-deep" aria-hidden="true" /></span>
                  <span>{{ fmtDate(r.createdAt) }}</span>
                </span>
                <span class="mt-1 line-clamp-2 block font-serif text-[1.02rem] text-ink">{{ preview(r) }}</span>
                <span class="mt-2 flex flex-wrap gap-2">
                  <span class="rounded-full px-2.5 py-0.5 text-[0.72rem]" :class="REVIEW_STATUS[r.status]?.cls">{{ REVIEW_STATUS[r.status]?.label }}</span>
                  <span v-if="r.consent === 'NO'" class="inline-flex items-center gap-1 rounded-full bg-ink/[.05] px-2.5 py-0.5 text-[0.72rem] text-ink-muted"><Lock class="h-3 w-3" aria-hidden="true" /> Privé</span>
                  <span v-if="r.featured" class="inline-flex items-center gap-1 rounded-full bg-caramel/15 px-2.5 py-0.5 text-[0.72rem] text-umber"><Sparkles class="h-3 w-3" aria-hidden="true" /> À la une</span>
                </span>
              </span>
            </button>
          </li>
        </ul>
        <p v-else class="px-6 py-16 text-center text-sm text-ink-muted">Aucun avis pour ce filtre.</p>
      </div>

      <!-- Détail -->
      <div v-if="selected" class="fixed inset-0 z-40 overflow-y-auto bg-paper p-5 xl:static xl:z-auto xl:overflow-visible xl:bg-transparent xl:p-0">
        <article class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8 xl:sticky xl:top-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="flex items-center gap-2 text-sm text-ink-muted"><span class="h-2.5 w-2.5 rounded-full" :style="{ background: leverColor(selected) }" aria-hidden="true" />{{ leverName(selected) }}</p>
              <h2 class="mt-2 font-display text-[2rem] leading-tight">{{ selected.firstName || 'Lecteur anonyme' }}</h2>
              <p class="mt-1 text-xs text-ink-muted">Reçu le {{ fmtDate(selected.createdAt) }}<template v-if="selected.moderatedBy"> · modéré par {{ selected.moderatedBy }}</template></p>
            </div>
            <button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line hover:bg-paper-2" aria-label="Fermer" @click="close"><X class="h-4 w-4" aria-hidden="true" /></button>
          </div>

          <dl class="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div class="rounded-2xl bg-paper-2/60 p-3"><dt class="text-xs text-ink-muted">Note</dt><dd class="mt-1 flex items-center gap-1 font-medium">{{ selected.rating }}/5 <Star class="h-3.5 w-3.5 fill-gold text-gold-deep" aria-hidden="true" /></dd></div>
            <div class="rounded-2xl bg-paper-2/60 p-3"><dt class="text-xs text-ink-muted">Statut</dt><dd class="mt-1 font-medium">{{ REVIEW_STATUS[selected.status]?.label }}</dd></div>
            <div class="rounded-2xl bg-paper-2/60 p-3"><dt class="text-xs text-ink-muted">Citation</dt><dd class="mt-1 font-medium">{{ consentLabel(selected.consent) }}</dd></div>
            <div v-if="selected.kind === 'LEVER'" class="rounded-2xl bg-paper-2/60 p-3"><dt class="text-xs text-ink-muted">Exercices</dt><dd class="mt-1 font-medium">{{ practicedLabel(selected.practiced) }}</dd></div>
          </dl>
          <p v-if="selected.email" class="mt-4 text-sm"><a :href="`mailto:${selected.email}`" class="inline-flex items-center gap-2 text-copper hover:underline"><Mail class="h-4 w-4" aria-hidden="true" />{{ selected.email }}</a> <span class="text-xs text-ink-muted">(jamais publié)</span></p>

          <section class="mt-8 space-y-5" aria-label="Réponses">
            <div v-for="(v, k) in selected.answers" :key="k" class="group">
              <p class="text-xs uppercase tracking-[0.16em] text-ink-muted">{{ ANSWER_LABELS[k] || k }}</p>
              <p class="mt-1.5 whitespace-pre-line font-serif text-[1.06rem] leading-relaxed text-ink">{{ v }}</p>
              <button v-if="selected.consent !== 'NO' && k !== 'difficult' && k !== 'deeper'" type="button" class="mt-1.5 text-xs text-copper opacity-70 hover:underline group-hover:opacity-100" @click="quote = v">Utiliser comme extrait public</button>
            </div>
            <p v-if="!Object.keys(selected.answers).length" class="text-sm italic text-ink-muted">Le lecteur a seulement laissé une note.</p>
          </section>

          <section v-if="selected.consent !== 'NO'" class="mt-8 rounded-[20px] border border-line p-5" aria-labelledby="quote-label">
            <label id="quote-label" for="public-quote" class="text-sm font-medium text-ink">Extrait affiché sur le site</label>
            <p class="mt-1 text-xs text-ink-muted">Signé « {{ selected.consent === 'FIRST_NAME' && selected.firstName ? selected.firstName : 'Lecteur anonyme' }} ». Vous pouvez raccourcir le texte, sans en changer le sens.</p>
            <textarea id="public-quote" v-model="quote" rows="4" maxlength="1200" class="mt-3 w-full rounded-2xl border border-line bg-paper/60 px-4 py-3 font-serif text-[1.02rem] leading-relaxed focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15" />
            <div class="mt-2 flex items-center justify-between">
              <button type="button" class="text-xs text-copper hover:underline disabled:opacity-40" :disabled="saving" @click="saveQuote">Enregistrer l’extrait</button>
              <span class="text-xs tabular-nums text-ink-muted">{{ quote.length }}/1200</span>
            </div>
          </section>
          <p v-else class="mt-8 flex items-start gap-2 rounded-[20px] bg-paper-2/70 p-5 text-sm text-ink-soft"><Lock class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Ce lecteur a refusé que son témoignage soit cité : il reste privé et ne peut pas être publié.</p>

          <div class="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
            <UiButton v-if="selected.status !== 'APPROVED' && selected.consent !== 'NO'" size="sm" :icon-left="Check" :loading="saving" :magnetic="false" @click="approve">Rendre visible</UiButton>
            <UiButton v-if="selected.status !== 'REJECTED'" size="sm" variant="outline" :icon-left="EyeOff" :magnetic="false" @click="hide">Masquer</UiButton>
            <UiButton v-if="selected.status !== 'PENDING'" size="sm" variant="ghost" :icon-left="RotateCcw" :magnetic="false" @click="reset">Remettre en attente</UiButton>
            <UiButton v-if="selected.status === 'APPROVED'" size="sm" variant="soft" :icon-left="Sparkles" :magnetic="false" @click="toggleFeatured">{{ selected.featured ? 'Retirer de la une' : 'Mettre en avant' }}</UiButton>
            <button type="button" class="ml-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm text-danger hover:bg-danger/5" @click="remove"><Trash2 class="h-4 w-4" aria-hidden="true" /> Supprimer</button>
          </div>
        </article>
      </div>
      <div v-else class="hidden place-items-center rounded-[24px] border border-dashed border-line-strong bg-white/40 p-10 text-center text-sm text-ink-muted xl:grid">
        Sélectionnez un avis pour le lire en entier et décider de sa publication.
      </div>
    </div>
  </div>
</template>
