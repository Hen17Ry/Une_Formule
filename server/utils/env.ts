/**
 * Variables d’environnement serveur. Plusieurs noms sont acceptés pour chaque valeur
 * (les noms courts en premier ; les anciens noms NUXT_* restent compatibles).
 */
export function readEnv(...names: string[]): string {
  for (const n of names) {
    const v = process.env[n]
    if (v && v.trim()) return v.trim()
  }
  return ''
}
