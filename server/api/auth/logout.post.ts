import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'formula_admin_session', { path: '/' })
  return { success: true }
})
