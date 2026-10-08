import type { Order } from '#shared/types'

/**
 * Valide le paiement d’une commande après vérification serveur auprès de KkiaPay.
 * Idempotent : une commande déjà payée avec la même transaction est renvoyée telle quelle.
 */
export async function settleOrder(reference: string, transactionId: string, source: 'client' | 'webhook'): Promise<Order> {
  const store = await useStore()
  const order = await store.getOrderByRef(reference)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable.' })

  if (PAID_STATUSES.includes(order.status as any)) {
    if (order.transactionId === transactionId) return order
    throw createError({ statusCode: 409, statusMessage: 'Cette commande est déjà réglée.' })
  }

  const reused = await store.getOrderByTransaction(transactionId)
  if (reused && reused.id !== order.id) throw createError({ statusCode: 409, statusMessage: 'Transaction déjà utilisée.' })

  const tx = await verifyKkiapayTransaction(transactionId)

  if (tx.status !== 'SUCCESS') {
    await store.updateOrder(order.id, { status: 'FAILED', transactionId })
    await store.logEvent({ entity: 'order', entityId: order.id, action: `payment_${String(tx.status).toLowerCase()}`, actor: source })
    throw createError({ statusCode: 402, statusMessage: 'Le paiement n’a pas abouti.' })
  }
  if (Number(tx.amount) < order.total) {
    await store.logEvent({ entity: 'order', entityId: order.id, action: 'payment_amount_mismatch', actor: source })
    throw createError({ statusCode: 402, statusMessage: 'Montant payé insuffisant.' })
  }

  const paid = await store.updateOrder(order.id, {
    status: 'PAID',
    transactionId,
    paymentMethod: tx.source_common_name || tx.source || null,
    paidAt: new Date().toISOString()
  })

  const settings = await store.getSettings()
  if (settings.stock !== null) {
    await store.saveSettings({ ...settings, stock: Math.max(0, settings.stock - order.quantity) })
  }
  await store.logEvent({ entity: 'order', entityId: order.id, action: 'paid', actor: source })

  return paid!
}
