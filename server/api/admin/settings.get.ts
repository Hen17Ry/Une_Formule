export default defineApiHandler(async (event) => {
  await requireAdmin(event)
  const store = await useStore()
  return toPublicSettings(await store.getSettings())
})
