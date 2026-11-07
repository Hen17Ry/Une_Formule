<script setup lang="ts">
import { Save, Copy, CheckCircle2, AlertTriangle, Plus, Trash2, ExternalLink } from '@lucide/vue'
import type { PublicSettings, SaleMode } from '#shared/types'
import { formatXof, xofToEur } from '~/data/book'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { push } = useToasts()
const refreshOverview = inject<() => void>('refreshOverview', () => {})

const s = ref<PublicSettings | null>(null)
const unlimited = ref(true)
const saving = ref(false)
const webhookUrl = computed(() => import.meta.client ? `${location.origin}/api/payments/kkiapay/webhook` : '')

onMounted(async () => {
  s.value = await adminFetch<PublicSettings>('/api/admin/settings')
  unlimited.value = s.value.stock === null
})

async function save() {
  if (!s.value) return
  saving.value = true
  try {
    const { paymentReady: _a, sandbox: _b, ...body } = s.value
    s.value = await adminFetch<PublicSettings>('/api/admin/settings', {
      method: 'PUT',
      body: { ...body, stock: unlimited.value ? null : Number(s.value.stock ?? 0), compareAtXof: body.compareAtXof ? Number(body.compareAtXof) : null, priceXof: Number(body.priceXof), shippingFeeXof: Number(body.shippingFeeXof), maxPerOrder: Number(body.maxPerOrder) }
    })
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
const modes: { value: SaleMode, label: string }[] = [{ value: 'PREORDER', label: 'Précommande' }, { value: 'AVAILABLE', label: 'Disponible' }]
const copy = async () => { await navigator.clipboard.writeText(webhookUrl.value); push('URL copiée.') }
const inputCls = 'h-12 w-full rounded-2xl border border-line bg-paper/60 px-4 text-[0.98rem] focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15'
</script>

<template>
  <div>
    <header>
      <p class="label">Boutique</p>
      <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Réglages</h1>
    </header>

    <div v-if="!s" class="mt-10 h-96 animate-pulse rounded-[24px] bg-white/70" />
    <form v-else class="mt-10 grid gap-6 xl:grid-cols-[1.4fr_1fr]" @submit.prevent="save">
      <div class="space-y-6">
        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
          <h2 class="font-display text-2xl">Où trouver le livre</h2>
          <p class="mt-2 text-sm text-ink-muted">Un bouton par plateforme sur l’accueil. Sans lien, la section affiche « Bientôt disponible ».</p>
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
          <h2 class="font-display text-2xl">Vente directe</h2>
          <p class="mt-2 text-sm text-ink-muted">Page /commander séparée (Mobile Money, carte via KkiaPay), accessible depuis « Où trouver le livre ».</p>
          <div class="mt-6">
            <p class="mb-2.5 text-sm font-medium">Mode de vente</p>
            <UiSegmented v-model="s.saleMode" :options="modes" name="saleMode" />
            <p class="mt-2 text-xs text-ink-muted">En précommande, les acheteurs sont prévenus que l’expédition se fait à la sortie du livre.</p>
          </div>
          <label class="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-paper-2/60 p-4">
            <span><span class="block text-sm font-medium">Vente directe ouverte</span><span class="text-xs text-ink-muted">Désactivée : la page /commander est fermée et le bouton disparaît de l’accueil.</span></span>
            <input v-model="s.salesOpen" type="checkbox" class="peer sr-only">
            <span class="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-copper peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-copper" aria-hidden="true" />
          </label>
        </section>

        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
          <h2 class="font-display text-2xl">Prix et livraison</h2>
          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <label class="block"><span class="mb-2 block text-sm font-medium">Prix (FCFA)</span><input v-model.number="s.priceXof" type="number" min="100" step="100" required :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">≈ {{ xofToEur(s.priceXof || 0) }} · KkiaPay encaisse en FCFA</span></label>
            <label class="block"><span class="mb-2 block text-sm font-medium">Prix barré (facultatif)</span><input v-model.number="s.compareAtXof" type="number" min="0" step="100" :class="inputCls"></label>
            <label class="block"><span class="mb-2 block text-sm font-medium">Frais de livraison (FCFA)</span><input v-model.number="s.shippingFeeXof" type="number" min="0" step="100" :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">0 = livraison offerte</span></label>
            <label class="block"><span class="mb-2 block text-sm font-medium">Maximum par commande</span><input v-model.number="s.maxPerOrder" type="number" min="1" max="50" :class="inputCls"></label>
            <div class="sm:col-span-2">
              <label class="flex items-center gap-3 text-sm"><input v-model="unlimited" type="checkbox" class="h-4 w-4 accent-[#8A5530]"> Stock illimité</label>
              <label v-if="!unlimited" class="mt-3 block"><span class="mb-2 block text-sm font-medium">Exemplaires restants</span><input v-model.number="s.stock" type="number" min="0" :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">Décrémenté automatiquement à chaque paiement confirmé.</span></label>
            </div>
          </div>
        </section>

        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
          <h2 class="font-display text-2xl">Textes affichés</h2>
          <div class="mt-6 space-y-5">
            <label class="block"><span class="mb-2 block text-sm font-medium">Nom de l’édition</span><input v-model="s.edition" maxlength="80" :class="inputCls"></label>
            <label class="block"><span class="mb-2 block text-sm font-medium">Note de livraison</span><textarea v-model="s.deliveryNote" rows="2" maxlength="400" class="w-full rounded-2xl border border-line bg-paper/60 px-4 py-3 text-[0.98rem] focus:border-caramel focus:outline-none" /></label>
            <label class="block"><span class="mb-2 block text-sm font-medium">Note de précommande</span><textarea v-model="s.preorderNote" rows="2" maxlength="400" class="w-full rounded-2xl border border-line bg-paper/60 px-4 py-3 text-[0.98rem] focus:border-caramel focus:outline-none" /></label>
          </div>
        </section>

        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
          <h2 class="font-display text-2xl">Mentions légales</h2>
          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <label class="block"><span class="mb-2 block text-sm font-medium">Email de contact</span><input v-model="s.contactEmail" type="email" maxlength="120" placeholder="contact@uneformule.com" :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">Affiché dans les mentions légales et le pied de page.</span></label>
            <label class="block"><span class="mb-2 block text-sm font-medium">ISBN</span><input v-model="s.isbn" maxlength="30" placeholder="978-…" :class="inputCls"><span class="mt-1.5 block text-xs text-ink-muted">Masqué tant qu’il est vide.</span></label>
          </div>
        </section>

        <div class="flex justify-end"><UiButton type="submit" size="lg" :loading="saving" :icon-left="Save" :magnetic="false">Enregistrer</UiButton></div>
      </div>

      <aside class="space-y-6">
        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
          <h2 class="font-display text-2xl">Aperçu</h2>
          <p class="mt-4 font-display text-4xl">{{ formatXof(s.priceXof || 0) }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ s.saleMode === 'PREORDER' ? 'Précommande ouverte' : 'Disponible' }} · {{ s.shippingFeeXof ? `livraison ${formatXof(s.shippingFeeXof)}` : 'livraison offerte' }}</p>
        </section>
        <section class="rounded-[24px] border border-line bg-white p-6 shadow-soft md:p-8">
          <h2 class="font-display text-2xl">Paiement KkiaPay</h2>
          <p class="mt-4 flex items-center gap-2 text-sm" :class="s.paymentReady ? 'text-ok' : 'text-gold-deep'">
            <CheckCircle2 v-if="s.paymentReady" class="h-5 w-5" aria-hidden="true" /><AlertTriangle v-else class="h-5 w-5" aria-hidden="true" />
            {{ s.paymentReady ? (s.sandbox ? 'Configuré — mode test (sandbox)' : 'Configuré — mode production') : 'Clés manquantes' }}
          </p>
          <p class="mt-4 text-sm leading-relaxed text-ink-soft">Les clés se règlent dans les variables d’environnement du serveur (jamais ici) :</p>
          <ul class="mt-3 space-y-1 font-mono text-xs text-ink-soft">
            <li>KKIAPAY_PUBLIC_KEY</li>
            <li>KKIAPAY_PRIVATE_KEY</li>
            <li>KKIAPAY_SECRET_KEY</li>
            <li>KKIAPAY_SANDBOX=false (paiements réels)</li>
            <li>KKIAPAY_WEBHOOK_SECRET</li>
          </ul>
          <p class="mt-5 text-sm font-medium">URL du webhook à déclarer chez KkiaPay</p>
          <div class="mt-2 flex items-center gap-2 rounded-2xl bg-paper-2/70 p-2 pl-4">
            <code class="min-w-0 flex-1 truncate text-xs">{{ webhookUrl }}</code>
            <button type="button" class="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white" aria-label="Copier l’URL" @click="copy"><Copy class="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </section>
      </aside>
    </form>
  </div>
</template>
