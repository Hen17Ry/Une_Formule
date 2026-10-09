<script setup lang="ts">
import { Minus, Plus, Lock, ShieldCheck, Truck, Smartphone, CreditCard } from '@lucide/vue'
import { BOOK, formatXof, xofToEur } from '~/data/book'

useSeo({ title: 'Commander le livre', description: `Commandez Une Formule de ${BOOK.author}. Paiement sécurisé par Mobile Money ou carte bancaire via KkiaPay.` })

const { data: shop, refresh } = await useShop()
const preorder = computed(() => shop.value?.saleMode === 'PREORDER')
const maxQty = computed(() => Math.max(1, Math.min(shop.value?.maxPerOrder ?? 10, shop.value?.stock ?? 999)))
const soldOut = computed(() => shop.value?.stock === 0)
const canBuy = computed(() => !!shop.value?.salesOpen && !!shop.value?.paymentReady && !soldOut.value)

const COUNTRIES = ['Bénin', 'Togo', 'Côte d’Ivoire', 'Sénégal', 'Niger', 'Burkina Faso', 'Mali', 'Cameroun', 'France', 'Autre']
const form = reactive({ quantity: 1, firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: 'Bénin', notes: '', website: '' })
const errors = reactive<Record<string, string>>({})
const step = ref<'form' | 'creating' | 'paying' | 'verifying'>('form')
const message = ref('')

const subtotal = computed(() => (shop.value?.priceXof ?? 0) * form.quantity)
const total = computed(() => subtotal.value + (shop.value?.shippingFeeXof ?? 0))

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.firstName.trim()) errors.firstName = 'Indiquez votre prénom.'
  if (!form.lastName.trim()) errors.lastName = 'Indiquez votre nom.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Adresse email invalide : la confirmation y sera envoyée.'
  if (form.phone.replace(/\D/g, '').length < 8) errors.phone = 'Numéro trop court : indiquez au moins 8 chiffres.'
  if (form.address.trim().length < 3) errors.address = 'Indiquez une adresse ou un point de repère.'
  if (form.city.trim().length < 2) errors.city = 'Indiquez votre ville.'
  return !Object.keys(errors).length
}

async function pay() {
  message.value = ''
  if (!validate()) {
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  step.value = 'creating'
  try {
    const order = await $fetch<{ reference: string, amount: number, customer: { name: string, email: string, phone: string }, kkiapay: { key: string, sandbox: boolean } }>('/api/orders', {
      method: 'POST',
      body: { ...form, quantity: Number(form.quantity) }
    })
    const kk = await import('kkiapay')
    step.value = 'paying'

    kk.removeKkiapayListener('success')
    kk.removeKkiapayListener('failed')
    kk.addKkiapayListener('success', async (res: { transactionId: string }) => {
      step.value = 'verifying'
      try {
        await $fetch(`/api/orders/${order.reference}/confirm`, { method: 'POST', body: { transactionId: res.transactionId } })
      } catch {}
      await navigateTo(`/commander/confirmation?ref=${order.reference}`)
    })
    kk.addKkiapayListener('failed', () => {
      step.value = 'form'
      message.value = 'Le paiement n’a pas abouti. Aucun montant n’a été débité ; vous pouvez réessayer.'
    })
    kk.addKkiapayCloseListener?.(() => { if (step.value === 'paying') step.value = 'form' })

    kk.openKkiapayWidget({
      amount: order.amount,
      key: order.kkiapay.key,
      sandbox: order.kkiapay.sandbox,
      position: 'center',
      theme: '#8A5530',
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone.replace(/[^\d]/g, ''),
      reason: `Une Formule × ${form.quantity}`,
      partnerId: order.reference,
      data: JSON.stringify({ reference: order.reference })
    })
  } catch (e: any) {
    step.value = 'form'
    message.value = e?.data?.statusMessage || 'La commande n’a pas pu être créée. Réessayez dans un instant.'
    refresh()
  }
}

const busyLabel = computed(() => ({ creating: 'Préparation…', paying: 'Paiement en cours…', verifying: 'Vérification…', form: '' })[step.value])
</script>

<template>
  <div class="relative overflow-x-clip pb-28 pt-36">
    <div aria-hidden="true" class="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(70%_100%_at_25%_0%,#f4e5d2,transparent)]" />
    <div class="container relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <!-- Le livre -->
      <aside class="lg:sticky lg:top-28 lg:self-start">
        <p class="label-gold">{{ preorder ? 'Précommande' : 'Commande' }}</p>
        <h1 class="mt-4 font-display text-display-md">Une Formule<span class="text-caramel">…</span></h1>
        <p class="mt-2 font-display text-2xl text-ink-soft">7 leviers pour construire la vie que vous désirez</p>
        <div class="my-6 flex justify-center lg:my-12">
          <BrandBook :width="250" :rotate="-20" class="max-lg:-my-14 max-lg:scale-[.68]" />
        </div>
        <ul class="space-y-3 font-sans text-[0.95rem] text-ink-soft">
          <li class="flex items-start gap-3"><Truck class="mt-0.5 h-5 w-5 shrink-0 text-caramel" aria-hidden="true" />{{ preorder ? shop?.preorderNote : shop?.deliveryNote }}</li>
          <li v-if="preorder" class="flex items-start gap-3"><Truck class="mt-0.5 h-5 w-5 shrink-0 text-caramel" aria-hidden="true" />{{ shop?.deliveryNote }}</li>
          <li class="flex items-start gap-3"><ShieldCheck class="mt-0.5 h-5 w-5 shrink-0 text-caramel" aria-hidden="true" />Paiement traité par KkiaPay : aucune donnée bancaire ne transite par ce site.</li>
        </ul>
      </aside>

      <!-- Formulaire -->
      <div>
        <div v-if="!shop?.salesOpen || soldOut" class="surface p-10 text-center">
          <p class="font-display text-display-sm">{{ soldOut ? 'Cette édition est épuisée.' : 'Les commandes sont momentanément fermées.' }}</p>
          <p class="mx-auto mt-3 max-w-md font-serif text-lg text-ink-soft">Revenez très bientôt. En attendant, vous pouvez lire les extraits.</p>
          <UiButton to="/extraits" variant="outline" class="mt-8">Lire les extraits</UiButton>
        </div>

        <form v-else class="space-y-6" novalidate @submit.prevent="pay">
          <div class="absolute -left-[9999px]" aria-hidden="true"><input v-model="form.website" tabindex="-1" autocomplete="off"></div>

          <fieldset class="surface p-7 md:p-9">
            <legend class="sr-only">Votre exemplaire</legend>
            <p class="label-gold">1 · Votre exemplaire</p>
            <div class="mt-6 flex flex-wrap items-center justify-between gap-6">
              <div>
                <p class="font-display text-[1.6rem] leading-tight">{{ shop?.edition }}</p>
                <p class="mt-1 font-sans text-sm text-ink-muted">
                  {{ formatXof(shop?.priceXof ?? 0) }} l’exemplaire · ≈ {{ xofToEur(shop?.priceXof ?? 0) }}
                  <template v-if="shop?.stock !== null && shop?.stock !== undefined && shop.stock <= 20"> · plus que {{ shop.stock }}</template>
                </p>
              </div>
              <div class="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1" role="group" aria-label="Quantité">
                <button type="button" class="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-paper-2 disabled:opacity-40" :disabled="form.quantity <= 1" aria-label="Retirer un exemplaire" @click="form.quantity--"><Minus class="h-4 w-4" aria-hidden="true" /></button>
                <output class="w-10 text-center font-display text-2xl tabular-nums" aria-live="polite">{{ form.quantity }}</output>
                <button type="button" class="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-paper-2 disabled:opacity-40" :disabled="form.quantity >= maxQty" aria-label="Ajouter un exemplaire" @click="form.quantity++"><Plus class="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </div>
          </fieldset>

          <fieldset class="surface grid gap-6 p-7 sm:grid-cols-2 md:p-9">
            <legend class="sr-only">Vos coordonnées</legend>
            <p class="label-gold sm:col-span-2">2 · Vos coordonnées</p>
            <UiField v-model="form.firstName" label="Prénom" autocomplete="given-name" required :error="errors.firstName" :max="80" />
            <UiField v-model="form.lastName" label="Nom" autocomplete="family-name" required :error="errors.lastName" :max="80" />
            <UiField v-model="form.email" label="Email" type="email" inputmode="email" autocomplete="email" required :error="errors.email" hint="Pour la confirmation de commande." :max="255" />
            <UiField v-model="form.phone" label="Téléphone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+229 01 00 00 00 00" :error="errors.phone" hint="Pour le livreur, et le paiement Mobile Money." :max="30" />
          </fieldset>

          <fieldset class="surface grid gap-6 p-7 sm:grid-cols-2 md:p-9">
            <legend class="sr-only">Livraison</legend>
            <p class="label-gold sm:col-span-2">3 · Livraison</p>
            <div class="sm:col-span-2"><UiField v-model="form.address" label="Adresse ou point de repère" autocomplete="street-address" required :error="errors.address" :max="400" /></div>
            <UiField v-model="form.city" label="Ville" autocomplete="address-level2" required :error="errors.city" :max="80" />
            <div>
              <label for="country" class="mb-2.5 block font-sans text-[0.98rem] font-[450] text-ink">Pays</label>
              <select id="country" v-model="form.country" autocomplete="country-name" class="h-14 w-full rounded-2xl border border-line bg-white/75 px-5 font-sans text-[1.02rem] text-ink focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15">
                <option v-for="c in COUNTRIES" :key="c">{{ c }}</option>
              </select>
            </div>
            <div class="sm:col-span-2"><UiField v-model="form.notes" label="Précisions pour la livraison" textarea :rows="2" optional :max="600" /></div>
          </fieldset>

          <div class="surface overflow-hidden">
            <dl class="space-y-3 p-7 font-sans text-[0.98rem] md:p-9">
              <div class="flex justify-between text-ink-soft"><dt>{{ form.quantity }} × {{ formatXof(shop?.priceXof ?? 0) }}</dt><dd class="tabular-nums">{{ formatXof(subtotal) }}</dd></div>
              <div class="flex justify-between text-ink-soft"><dt>Livraison</dt><dd>{{ shop?.shippingFeeXof ? formatXof(shop.shippingFeeXof) : 'Offerte' }}</dd></div>
              <div class="flex items-end justify-between border-t border-line pt-4"><dt class="font-medium text-ink">Total</dt><dd class="font-display text-[2.2rem] leading-none tabular-nums">{{ formatXof(total) }}</dd></div>
            </dl>
            <div class="border-t border-line bg-paper-2/60 p-7 md:p-9">
              <UiButton type="submit" size="lg" block :loading="step !== 'form'" :disabled="!canBuy" :icon-left="Lock">
                {{ step !== 'form' ? busyLabel : `Payer ${formatXof(total)}` }}
              </UiButton>
              <p v-if="!shop?.paymentReady" class="mt-4 text-center font-sans text-sm text-ink-muted">Le paiement en ligne sera activé très prochainement.</p>
              <p v-else-if="shop?.sandbox" class="mt-4 text-center font-sans text-xs uppercase tracking-[0.2em] text-gold-deep">Mode test KkiaPay : aucun débit réel</p>
              <div class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-[0.8rem] text-ink-muted">
                <span class="inline-flex items-center gap-1.5"><Smartphone class="h-4 w-4" aria-hidden="true" /> MTN MoMo · Moov Money · Celtiis</span>
                <span class="inline-flex items-center gap-1.5"><CreditCard class="h-4 w-4" aria-hidden="true" /> Visa · Mastercard</span>
              </div>
              <p v-if="message" class="mt-5 rounded-2xl border border-danger/30 bg-danger/5 px-5 py-4 font-sans text-sm text-danger" role="alert">{{ message }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
