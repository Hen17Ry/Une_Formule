/* Vérification côté serveur d’une transaction KkiaPay (même appel que @kkiapay-org/nodejs-sdk). */

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

export function kkiapayConfig() {
  const config = useRuntimeConfig()
  const publicKey = config.public.kkiapay.publicKey as string
  const privateKey = config.kkiapay.privateKey as string
  const secretKey = config.kkiapay.secretKey as string
  const sandbox = String(config.public.kkiapay.sandbox) !== 'false'
  return { publicKey, privateKey, secretKey, sandbox, ready: !!(publicKey && privateKey && secretKey) }
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
