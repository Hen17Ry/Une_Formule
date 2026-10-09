import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'

/**
 * Transforme une erreur inattendue (base de données, réseau…) en réponse 500 lisible,
 * au lieu du « Server Error » générique, et la journalise pour les logs Vercel.
 */
export function toHttpError(err: any) {
  if (err?.statusCode && !err.unhandled && err.statusMessage && err.statusMessage !== 'Server Error') return err
  const cause = err?.cause ?? err
  const code = cause?.code || err?.code || cause?.name || 'ERREUR'
  const detail = String(cause?.message || err?.message || 'erreur inconnue').split('\n')[0]!.slice(0, 160)
  console.error('[api]', code, detail, err?.stack?.split('\n').slice(0, 4).join(' | '))
  return createError({ statusCode: 500, statusMessage: `Erreur serveur (${code}) : ${detail}` })
}

export function defineApiHandler<T>(fn: (event: H3Event<EventHandlerRequest>) => Promise<T> | T): EventHandler<EventHandlerRequest, Promise<T>> {
  return defineEventHandler(async (event) => {
    try {
      return await fn(event)
    } catch (err) {
      throw toHttpError(err)
    }
  })
}
