export default defineApiHandler(async (event) => {
  const session = await adminSession(event)
  await session.clear()
  return { ok: true }
})
