/**
 * Diagnostic de production : base de données, tables, Redis, KkiaPay.
 * Ne renvoie aucun secret ; ouvrir https://<domaine>/api/health en cas d’« Erreur serveur ».
 */
const EXPECTED: Record<string, string[]> = {
  admin_users: ['id', 'email', 'password_hash', 'role', 'created_at'],
  reviews: ['id', 'kind', 'lever', 'practiced', 'rating', 'consent', 'first_name', 'email', 'answers', 'public_quote', 'status', 'featured', 'moderated_by', 'moderated_at', 'created_at', 'updated_at'],
  orders: ['id', 'reference', 'status', 'sale_mode', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country', 'notes', 'quantity', 'unit_price', 'shipping_fee', 'total', 'currency', 'transaction_id', 'payment_method', 'paid_at', 'admin_note', 'created_at', 'updated_at'],
  settings: ['key', 'value', 'updated_at'],
  events: ['id', 'entity', 'entity_id', 'action', 'actor', 'created_at']
}

export default defineApiHandler(async (event) => {
  setResponseHeader(event, 'cache-control', 'no-store')
  const store = await useStore()
  const report: Record<string, any> = {
    storage: store.kind,
    database: store.kind === 'postgres' ? 'connectée' : 'NON connectée (stockage fichier temporaire)',
    kkiapay: (() => { const k = kkiapayConfig(); return { configured: k.ready, sandbox: k.sandbox } })(),
    redis: process.env.REDIS_URL || process.env.KV_URL ? 'défini' : 'non défini'
  }
  if (store.kind === 'file' && lastDbError) report.databaseError = lastDbError

  const pool = (store as any).pool as import('pg').Pool | undefined
  if (pool) {
    try {
      const { rows } = await pool.query(
        `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = ANY($1)`,
        [Object.keys(EXPECTED)]
      )
      const tables: Record<string, string> = {}
      for (const [table, cols] of Object.entries(EXPECTED)) {
        const have = rows.filter(r => r.table_name === table).map(r => r.column_name)
        if (!have.length) tables[table] = 'absente'
        else {
          const missing = cols.filter(c => !have.includes(c))
          tables[table] = missing.length ? `incompatible (colonnes manquantes : ${missing.join(', ')})` : 'ok'
        }
      }
      report.tables = tables
      const admins = await pool.query('SELECT COUNT(*)::int AS c FROM admin_users')
      report.adminAccounts = admins.rows[0]?.c ?? 0
    } catch (err: any) {
      report.tablesError = { code: err?.code, message: String(err?.message || '').slice(0, 200) }
    }
  }
  report.ok = store.kind === 'postgres' && !report.tablesError && Object.values(report.tables || {}).every(v => v === 'ok') && report.kkiapay.configured
  return report
})
