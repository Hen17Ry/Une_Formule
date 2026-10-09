export default defineEventHandler(async (event) => {
  const me = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const store = await useStore()
  const admins = await store.listAdmins()
  const target = admins.find(a => a.id === id)
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Administrateur introuvable.' })
  if (target.email === me) throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas supprimer votre propre compte.' })
  if (admins.length <= 1) throw createError({ statusCode: 400, statusMessage: 'Il doit rester au moins un administrateur.' })
  await store.deleteAdmin(id)
  await store.logEvent({ entity: 'auth', entityId: id, action: 'admin_deleted', actor: me })
  return { ok: true }
})
