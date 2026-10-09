#!/usr/bin/env node
/**
 * Crée un compte administrateur dans la base, ou change son mot de passe s’il existe.
 *
 *   pnpm admin:create vous@exemple.com "un-mot-de-passe-solide"
 *
 * Utilise DATABASE_URL (lu dans l’environnement ou dans le fichier .env).
 * Sans DATABASE_URL, écrit dans le stockage local de développement (.data/une-formule.json).
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import readline from 'node:readline/promises'

const root = process.cwd()

// Lecture minimale du .env (sans dépendance)
const envFile = path.join(root, '.env')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

let [email, password] = process.argv.slice(2)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
if (!email) email = await rl.question('Email de l’administrateur : ')
if (!password) password = await rl.question('Mot de passe (10 caractères minimum) : ')
rl.close()

email = String(email || '').trim().toLowerCase()
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { console.error('✗ Email invalide.'); process.exit(1) }
if (!password || password.length < 10) { console.error('✗ Le mot de passe doit contenir au moins 10 caractères.'); process.exit(1) }

const scrypt = promisify(crypto.scrypt)
const salt = crypto.randomBytes(16)
const hash = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 })
const passwordHash = `scrypt$16384$8$1$${salt.toString('base64')}$${hash.toString('base64')}`

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (url) {
  const { default: pg } = await import('pg')
  const ssl = /sslmode=require|neon\.tech|supabase|vercel-storage|render\.com/.test(url)
  const pool = new pg.Pool({ connectionString: url, ssl: ssl ? { rejectUnauthorized: false } : undefined })
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN', created_at TIMESTAMPTZ NOT NULL DEFAULT now())`)
  const res = await pool.query(
    `INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, 'ADMIN')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING (xmax = 0) AS created`, [email, passwordHash])
  await pool.end()
  console.log(res.rows[0]?.created ? `✓ Administrateur créé : ${email}` : `✓ Mot de passe mis à jour : ${email}`)
} else {
  const file = path.join(root, '.data', 'une-formule.json')
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { adminUsers: [], reviews: [], orders: [], settings: {}, events: [] }
  data.adminUsers ??= []
  const existing = data.adminUsers.find(u => u.email === email)
  if (existing) existing.passwordHash = passwordHash
  else data.adminUsers.push({ id: data.adminUsers.reduce((m, u) => Math.max(m, u.id), 0) + 1, email, passwordHash, role: 'ADMIN', createdAt: new Date().toISOString() })
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  console.log(`✓ ${existing ? 'Mot de passe mis à jour' : 'Administrateur créé'} (stockage local) : ${email}`)
}
