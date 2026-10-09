import crypto from 'node:crypto'

/* Webhook KkiaPay (filet de sécurité si le navigateur se ferme avant la confirmation).
   URL à déclarer dans le tableau de bord KkiaPay : https://<domaine>/api/payments/kkiapay/webhook */
export default defineApiHandler(async (event) => {
  const expected = kkiapayConfig().webhookSecret
  const received = getHeader(event, 'x-kkiapay-secret') || ''
  if (!expected || received.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))) {
    throw createError({ statusCode: 401, statusMessage: 'Signature invalide.' })
  }

  const body = await readBody<Record<string, any>>(event)
  const transactionId = String(body?.transactionId || '')
  if (!transactionId || body?.event !== 'transaction.success') return { received: true }

  // La référence de commande est transmise au widget dans `partnerId` / `data`.
  let ref = String(body?.partnerId || '')
  if (!/^UF-/.test(ref)) {
    const data = typeof body?.stateData === 'string' ? safeJson(body.stateData) : body?.stateData
    ref = String(data?.reference || '')
  }
  if (!/^UF-/.test(ref)) return { received: true, ignored: 'référence absente' }

  try {
    await settleOrder(ref.toUpperCase(), transactionId, 'webhook')
  } catch (err: any) {
    console.warn('[kkiapay] webhook :', err?.statusMessage || err?.message)
  }
  return { received: true }
})

function safeJson(s: string) { try { return JSON.parse(s) } catch { return null } }
