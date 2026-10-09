import crypto from 'node:crypto'
import { promisify } from 'node:util'
import type { H3Event } from 'h3'

/* ───────────────────────────────────────────────────────────────
   Authentification admin : les comptes vivent dans la table
   admin_users de la base. Aucun identifiant n’est lu dans le .env.
   ─────────────────────────────────────────────────────────────── */

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, keylen: number, opts: crypto.ScryptOptions) => Promise<Buffer>
const N = 16384, R = 8, P = 1, KEYLEN = 64

/** Ancien hachage du site précédent (SHA-256 + sel fixe). */
const LEGACY_SALT = 'une_formule_salt_2026'
/** Mot de passe par défaut de l’ancien site, publié dans le dépôt : toujours refusé. */
const LEGACY_DEFAULT_PASSWORD = 'Formule2026!'

export const MIN_PASSWORD_LENGTH = 10

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16)
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`
}

export function isLegacyHash(stored: string) {
  return /^[a-f0-9]{64}$/i.test(stored)
}

/** Vérifie un mot de passe contre le hachage stocké en base (scrypt, ou ancien SHA-256). */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (isLegacyHash(stored)) {
    if (password === LEGACY_DEFAULT_PASSWORD) return false
    const legacy = crypto.createHash('sha256').update(password + LEGACY_SALT).digest()
    return crypto.timingSafeEqual(legacy, Buffer.from(stored, 'hex'))
  }
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, saltB64, hashB64] = parts
  const expected = Buffer.from(hashB64!, 'base64')
  const actual = await scrypt(password, Buffer.from(saltB64!, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p) })
  return crypto.timingSafeEqual(actual, expected)
}

/**
 * Secret de chiffrement des cookies de session.
 * SESSION_SECRET (32 caractères min.) s’il est défini ; sinon un secret aléatoire
 * généré une fois et conservé en base (table settings).
 */
let cachedSecret: string | null = null
async function sessionSecret(): Promise<string> {
  if (cachedSecret) return cachedSecret
  const configured = readEnv('SESSION_SECRET', 'NUXT_SESSION_PASSWORD')
  if (configured.length >= 32) return (cachedSecret = configured)
  const store = await useStore()
  cachedSecret = await store.ensureKv('session_secret', () => crypto.randomBytes(32).toString('hex'))
  return cachedSecret
}

interface AdminSession { email?: string, at?: number }

export async function adminSession(event: H3Event) {
  return useSession<AdminSession>(event, {
    name: 'uf_admin',
    password: await sessionSecret(),
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    }
  })
}

/** Exige une session admin valide ET un compte toujours présent en base. */
export async function requireAdmin(event: H3Event): Promise<string> {
  const session = await adminSession(event)
  const email = session.data.email
  if (!email) throw createError({ statusCode: 401, statusMessage: 'Session expirée. Veuillez vous reconnecter.' })
  const store = await useStore()
  if (!(await store.getAdminByEmail(email))) {
    await session.clear()
    throw createError({ statusCode: 401, statusMessage: 'Ce compte administrateur n’existe plus.' })
  }
  return email
}
