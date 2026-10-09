export default defineEventHandler(async (event) => {
  try {
    const email = await requireAdmin(event)
    return { authenticated: true, email }
  } catch {
    return { authenticated: false, email: null }
  }
})
