export default defineNuxtRouteMiddleware(async (to) => {
  // Protect all /admin routes except /admin/login
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    try {
      const auth = await useRequestFetch()<{ authenticated: boolean }>('/api/auth/me')
      if (!auth || !auth.authenticated) {
        return navigateTo('/admin/login')
      }
    } catch {
      return navigateTo('/admin/login')
    }
  }

  // Redirect authenticated admin away from /admin/login to /admin
  if (to.path === '/admin/login') {
    try {
      const auth = await useRequestFetch()<{ authenticated: boolean }>('/api/auth/me')
      if (auth && auth.authenticated) {
        return navigateTo('/admin')
      }
    } catch {
      // Allow loading login page on error
    }
  }
})
