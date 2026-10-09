export default defineEventHandler(async (event) => {
  const me = await requireAdmin(event)
  const store = await useStore()
  const admins = await store.listAdmins()
  return admins.map(a => ({ id: a.id, email: a.email, createdAt: a.createdAt ?? null, me: a.email === me, needsReset: isLegacyHash(a.passwordHash) }))
})
