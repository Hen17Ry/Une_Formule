export default defineApiHandler(async (event) => {
  await requireAdmin(event)
  return { sources: await getSources() }
})
