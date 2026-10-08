export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  const me = await $fetch<{ authenticated: boolean }>('/api/auth/me').catch(() => ({ authenticated: false }))
  if (to.path === '/admin/login') {
    if (me.authenticated) return navigateTo('/admin')
    return
  }
  if (!me.authenticated) return navigateTo(`/admin/login?next=${encodeURIComponent(to.fullPath)}`)
})
