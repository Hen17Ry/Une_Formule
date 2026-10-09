export default defineApiHandler(() => ({ enabled: readEnv('ADMIN_SETUP_TOKEN').length >= 16 }))
