import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler((event) => {
  const session = getCookie(event, 'formula_admin_session')
  if (session === 'admin_authenticated_token_2026') {
    return {
      authenticated: true,
      user: {
        email: 'admin@uneformule.fr',
        role: 'ADMIN'
      }
    }
  }

  return {
    authenticated: false,
    user: null
  }
})
