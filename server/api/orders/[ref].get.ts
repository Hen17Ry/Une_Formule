export default defineApiHandler(async (event) => {
  const ref = String(getRouterParam(event, 'ref') || '').toUpperCase()
  if (!/^UF-\d{6}-[A-F0-9]{6}$/.test(ref)) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable.' })
  const store = await useStore()
  const order = await store.getOrderByRef(ref)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable.' })
  return toPublicOrder(order)
})
