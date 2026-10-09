export default defineApiHandler(() => ({ enabled: setupToken().length >= 16 }))
