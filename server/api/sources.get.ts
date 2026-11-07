/* Rubrique « À propos des sources » : liste publique. */
export default defineApiHandler(async () => {
  return { sources: await getSources() }
})
