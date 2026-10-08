import crypto from 'node:crypto'
import { promisify } from 'node:util'
import type { H3Event } from 'h3'
import type { Store } from './store'

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, keylen: number, opts: crypto.ScryptOptions) => Promise<Buffer>
const N = 16384, R = 8, P = 1, KEYLEN = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16)
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`
}

/** Seuls les mots de passe hachés avec scrypt sont acceptés (l’ancien hachage SHA-256 public est refusé). */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, saltB64, hashB64] = parts
  const expected = Buffer.from(hashB64!, 'base64')
  const actual = await scrypt(password, Buffer.from(saltB64!, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p) })
  return crypto.timingSafeEqual(actual, expected)
}

/** Crée ou met à jour le compte admin défini par NUXT_ADMIN_EMAIL / NUXT_ADMIN_PASSWORD. */
export async function ensureAdminFromEnv(store: Store) {
  const email = (process.env.NUXT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.NUXT_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || ''
  if (!email || !password) {
    console.warn('[auth] NUXT_ADMIN_EMAIL / NUXT_ADMIN_PASSWORD non définis : aucun compte admin créé.')
    return
  }
  if (password.length < 10) {
    console.error('[auth] NUXT_ADMIN_PASSWORD doit contenir au moins 10 caractères.')
    return
  }
  const existing = await store.getAdminByEmail(email)
  if (existing && await verifyPassword(password, existing.passwordHash)) return
  await store.upsertAdmin(email, await hashPassword(password))
  console.info(`[auth] Compte admin prêt : ${email}`)
}

let devSecret: string | null = null

function sessionPassword(): string {
  const configured = process.env.NUXT_SESSION_PASSWORD || ''
  if (configured.length >= 32) return configured
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_SESSION_PASSWORD manquant (32 caractères minimum).' })
  }
  devSecret ??= crypto.randomBytes(32).toString('hex')
  return devSecret
}

interface AdminSession { email?: string, at?: number }

export function adminSession(event: H3Event) {
  return useSession<AdminSession>(event, {
    name: 'uf_admin',
    password: sessionPassword(),
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    }
  })
}

export async function requireAdmin(event: H3Event): Promise<string> {
  const session = await adminSession(event)
  const email = session.data.email
  if (!email) throw createError({ statusCode: 401, statusMessage: 'Session expirée. Veuillez vous reconnecter.' })
  return email
}
