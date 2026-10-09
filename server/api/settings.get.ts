export default defineEventHandler(async () => {
  const store = await useStore()
  return toPublicSettings(await store.getSettings())
})
