export default defineApiHandler(async (event) => {
  await requireAdmin(event)
  const store = await useStore()
  const orders = await store.listOrders()
  const cols = ['reference', 'status', 'saleMode', 'createdAt', 'paidAt', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'quantity', 'unitPrice', 'shippingFee', 'total', 'currency', 'transactionId', 'paymentMethod', 'notes', 'adminNote'] as const
  const esc = (v: unknown) => {
    const s = v instanceof Date ? v.toISOString() : String(v ?? '')
    return /[";\n,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [cols.join(';'), ...orders.map(o => cols.map(c => esc((o as any)[c])).join(';'))].join('\n')
  setResponseHeaders(event, {
    'content-type': 'text/csv; charset=utf-8',
    'content-disposition': `attachment; filename="commandes-une-formule-${new Date().toISOString().slice(0, 10)}.csv"`
  })
  return '﻿' + csv
})
