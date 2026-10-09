export default defineApiHandler(async () => {
  const store = await useStore()
  return toPublicSettings(await store.getSettings())
})
