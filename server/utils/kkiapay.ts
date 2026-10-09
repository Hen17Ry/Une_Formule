/* Paiement KkiaPay : configuration + vérification côté serveur d’une transaction
   (même appel que @kkiapay-org/nodejs-sdk). */

export interface KkiapayTransaction {
  transactionId: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'INSUFFICIENT_FUND' | string
  amount: number
  fees?: number
  source?: string
  source_common_name?: string
  partnerId?: string
  state?: unknown
  reason?: string
  performedAt?: string
  client?: { fullname?: string, phone?: string, email?: string }
}

/**
 * Variables (toutes côté serveur, type « Secret » sur Vercel) :
 *   KKIAPAY_PUBLIC_KEY, KKIAPAY_PRIVATE_KEY, KKIAPAY_SECRET_KEY,
 *   KKIAPAY_SANDBOX (true par défaut), KKIAPAY_WEBHOOK_SECRET.
 * La clé publique n’est transmise au navigateur qu’au moment d’ouvrir le paiement.
 */
export function kkiapayConfig() {
  const publicKey = readEnv('KKIAPAY_PUBLIC_KEY', 'PUBLIC_KKIAPAY_PUBLIC_KEY', 'NUXT_PUBLIC_KKIAPAY_PUBLIC_KEY')
  const privateKey = readEnv('KKIAPAY_PRIVATE_KEY', 'NUXT_KKIAPAY_PRIVATE_KEY')
  const secretKey = readEnv('KKIAPAY_SECRET_KEY', 'NUXT_KKIAPAY_SECRET_KEY')
  const sandbox = readEnv('KKIAPAY_SANDBOX', 'PUBLIC_KKIAPAY_SANDBOX', 'NUXT_PUBLIC_KKIAPAY_SANDBOX').toLowerCase() !== 'false'
  const webhookSecret = readEnv('KKIAPAY_WEBHOOK_SECRET', 'NUXT_KKIAPAY_WEBHOOK_SECRET')
  return { publicKey, privateKey, secretKey, sandbox, webhookSecret, ready: !!(publicKey && privateKey && secretKey) }
}

export async function verifyKkiapayTransaction(transactionId: string): Promise<KkiapayTransaction> {
  const { publicKey, privateKey, secretKey, sandbox, ready } = kkiapayConfig()
  if (!ready) throw createError({ statusCode: 503, statusMessage: 'Paiement non configuré.' })

  const baseURL = sandbox ? 'https://api-sandbox.kkiapay.me' : 'https://api.kkiapay.me'
  try {
    return await $fetch<KkiapayTransaction>('/api/v1/transactions/status', {
      baseURL,
      method: 'POST',
      body: { transactionId },
      headers: {
        'x-api-key': publicKey,
        'x-private-key': privateKey,
        'x-secret-key': secretKey,
        'accept': 'application/json'
      },
      timeout: 15000,
      retry: 1
    })
  } catch (err: any) {
    const reason = err?.data?.reason || err?.data?.message || 'Transaction introuvable'
    throw createError({ statusCode: 402, statusMessage: `Vérification KkiaPay impossible : ${reason}` })
  }
}
