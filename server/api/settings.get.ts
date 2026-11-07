export default defineApiHandler(async () => {
  const store = await useStore()
  return store.getSettings()
})
