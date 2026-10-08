export default defineEventHandler(async (event) => {
  try {
    const session = await adminSession(event)
    return { authenticated: !!session.data.email, email: session.data.email ?? null }
  } catch {
    return { authenticated: false, email: null }
  }
})
