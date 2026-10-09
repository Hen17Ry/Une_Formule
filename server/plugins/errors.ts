/* Journalise le détail des erreurs serveur (visible dans les logs Vercel → Functions). */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error: any, ctx) => {
    if (error?.statusCode && error.statusCode < 500) return
    console.error('[erreur serveur]', ctx?.event?.method, ctx?.event?.path, '→', error?.cause?.code || error?.code || '', error?.cause?.message || error?.message)
  })
})
