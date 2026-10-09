/**
 * Code de configuration admin (ADMIN_SETUP_TOKEN), tolérant aux erreurs de copie courantes :
 * espaces, guillemets, ou « ADMIN_SETUP_TOKEN=… » collé dans la valeur.
 */
export function normalizeSetupToken(value: string): string {
  return String(value ?? '')
    .trim()
    .replace(/^ADMIN_SETUP_TOKEN\s*=\s*/i, '')
    .replace(/^(['"`])(.*)\1$/s, '$2')
    .replace(/\s+/g, '')
}

export function setupToken(): string {
  return normalizeSetupToken(readEnv('ADMIN_SETUP_TOKEN'))
}
