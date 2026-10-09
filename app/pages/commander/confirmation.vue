<script setup lang="ts">
import { Check, Clock, X } from '@lucide/vue'
import { formatXof } from '~/data/book'

useSeo({ title: 'Confirmation de commande', description: 'Merci pour votre commande du livre Une Formule.' })
useHead({ meta: [{ name: 'robots', content: 'noindex' }] })

const ref_ = String(useRoute().query.ref || '')
interface PublicOrder { reference: string, status: string, saleMode: string, firstName: string, email: string, quantity: number, total: number, paidAt: string | null }
const { data: order, error, refresh } = await useFetch<PublicOrder>(`/api/orders/${encodeURIComponent(ref_)}`, { key: `order-${ref_}` })

const paid = computed(() => ['PAID', 'SHIPPED', 'DELIVERED'].includes(order.value?.status ?? ''))
const failed = computed(() => ['FAILED', 'CANCELLED'].includes(order.value?.status ?? ''))

let timer: ReturnType<typeof setInterval> | undefined
let tries = 0
onMounted(() => {
  timer = setInterval(async () => {
    if (paid.value || failed.value || ++tries > 20) return clearInterval(timer)
    await refresh()
  }, 4000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="relative grid min-h-[90vh] place-items-center overflow-hidden px-5 pb-20 pt-36">
    <BrandRings class="pointer-events-none absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" />
    <div class="surface relative w-full max-w-xl px-8 py-14 text-center md:px-14">
      <template v-if="error || !order">
        <p class="font-display text-display-sm">Commande introuvable.</p>
        <p class="mt-3 font-serif text-lg text-ink-soft">Vérifiez le lien reçu, ou contactez-nous avec votre référence.</p>
        <UiButton to="/" variant="outline" class="mt-8">Retour à l’accueil</UiButton>
      </template>
      <template v-else>
        <div class="mx-auto grid h-20 w-20 place-items-center rounded-full text-[#FFFDF9]" :class="failed ? 'bg-danger' : paid ? '[background:var(--cover-soft)]' : 'bg-gold'">
          <Check v-if="paid" class="h-9 w-9" aria-hidden="true" />
          <X v-else-if="failed" class="h-9 w-9" aria-hidden="true" />
          <Clock v-else class="h-9 w-9 animate-pulse" aria-hidden="true" />
        </div>
        <h1 class="mt-8 font-display text-display-sm" role="status">
          <template v-if="paid">Merci {{ order.firstName }}, c’est confirmé.</template>
          <template v-else-if="failed">Le paiement n’a pas abouti.</template>
          <template v-else>Paiement en cours de vérification…</template>
        </h1>
        <p class="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ink-soft">
          <template v-if="paid && order.saleMode === 'PREORDER'">Votre précommande est enregistrée. Votre exemplaire vous sera expédié dès la sortie officielle du livre.</template>
          <template v-else-if="paid">Votre commande est en préparation. Nous vous contacterons pour la livraison.</template>
          <template v-else-if="failed">Aucun montant n’a été débité. Vous pouvez relancer la commande.</template>
          <template v-else>Cela prend généralement quelques secondes. Cette page se met à jour toute seule.</template>
        </p>
        <dl class="mx-auto mt-10 max-w-sm space-y-3 rounded-[22px] bg-paper-2/70 p-6 text-left font-sans text-[0.95rem]">
          <div class="flex justify-between"><dt class="text-ink-muted">Référence</dt><dd class="font-medium tracking-wide">{{ order.reference }}</dd></div>
          <div class="flex justify-between"><dt class="text-ink-muted">Exemplaires</dt><dd>{{ order.quantity }}</dd></div>
          <div class="flex justify-between"><dt class="text-ink-muted">Total</dt><dd>{{ formatXof(order.total) }}</dd></div>
          <div class="flex justify-between"><dt class="text-ink-muted">Email</dt><dd>{{ order.email }}</dd></div>
        </dl>
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <UiButton v-if="failed" to="/commander">Réessayer</UiButton>
          <UiButton to="/extraits" variant="outline">Lire les extraits en attendant</UiButton>
        </div>
      </template>
    </div>
  </div>
</template>
