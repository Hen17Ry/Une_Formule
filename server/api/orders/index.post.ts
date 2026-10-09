import { z } from 'zod'

const schema = z.object({
  firstName: z.string().trim().min(1, 'Indiquez votre prénom.').max(80),
  lastName: z.string().trim().min(1, 'Indiquez votre nom.').max(80),
  email: z.string().trim().email('Adresse email invalide.'),
  phone: z.string().trim().min(8, 'Numéro de téléphone invalide.').max(30).regex(/^[+\d\s().-]+$/, 'Numéro de téléphone invalide.'),
  address: z.string().trim().min(3, 'Indiquez une adresse de livraison.').max(400),
  city: z.string().trim().min(2, 'Indiquez votre ville.').max(80),
  country: z.string().trim().min(2).max(60).default('Bénin'),
  notes: z.string().max(600).optional().default(''),
  quantity: z.number().int().min(1).max(50),
  website: z.string().optional()
})

export default defineApiHandler(async (event) => {
  await rateLimit(event, 'order', 20, 15 * 60)

  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Formulaire invalide.' })
  const body = parsed.data
  if (body.website) throw createError({ statusCode: 400, statusMessage: 'Formulaire invalide.' })

  const store = await useStore()
  const settings = await store.getSettings()
  const kk = kkiapayConfig()

  if (!settings.salesOpen) throw createError({ statusCode: 409, statusMessage: 'Les commandes sont momentanément fermées.' })
  if (!kk.ready) throw createError({ statusCode: 503, statusMessage: 'Le paiement en ligne n’est pas encore activé.' })
  if (body.quantity > settings.maxPerOrder) throw createError({ statusCode: 400, statusMessage: `Maximum ${settings.maxPerOrder} exemplaires par commande.` })
  if (settings.stock !== null && body.quantity > settings.stock) {
    throw createError({ statusCode: 409, statusMessage: settings.stock > 0 ? `Il ne reste que ${settings.stock} exemplaire(s).` : 'Stock épuisé.' })
  }

  const unitPrice = settings.priceXof
  const total = unitPrice * body.quantity + settings.shippingFeeXof

  const order = await store.createOrder({
    reference: newOrderReference(),
    saleMode: settings.saleMode,
    firstName: clean(body.firstName, 80),
    lastName: clean(body.lastName, 80),
    email: clean(body.email, 255).toLowerCase(),
    phone: clean(body.phone, 30),
    address: clean(body.address, 400),
    city: clean(body.city, 80),
    country: clean(body.country, 60),
    notes: clean(body.notes, 600) || null,
    quantity: body.quantity,
    unitPrice,
    shippingFee: settings.shippingFeeXof,
    total,
    currency: 'XOF'
  })
  await store.logEvent({ entity: 'order', entityId: order.id, action: 'created', actor: order.email })

  return {
    reference: order.reference,
    amount: order.total,
    customer: { name: `${order.firstName} ${order.lastName}`, email: order.email, phone: order.phone },
    kkiapay: { key: kk.publicKey, sandbox: kk.sandbox }
  }
})
