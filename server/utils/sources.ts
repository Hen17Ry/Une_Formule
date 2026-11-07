import type { SourceEntry } from '#shared/types'

/**
 * Liste initiale : les références citées sur le site, levier par levier.
 * Utilisée tant qu’aucune liste n’a été enregistrée depuis l’admin (clé « sources »).
 * Le statut reste « à préciser » : seul l’auteur peut dire s’il a consulté la publication.
 */
export const DEFAULT_SOURCES: SourceEntry[] = [
  // Levier 1 — Escalader le temps
  { id: 's01', lever: 1, name: 'Schacter & Addis — Harvard, 2007', reference: '', claim: 'Le cerveau utilise les mêmes circuits, notamment l’hippocampe, pour se souvenir du passé et pour imaginer le futur : la simulation épisodique constructive.', url: '', status: '' },
  { id: 's02', lever: 1, name: 'Tour de chute libre d’Eagleman — Baylor, 2007', reference: '', claim: 'Expérience citée dans le levier « Escalader le temps », sur la perception du temps.', url: '', status: '' },
  { id: 's03', lever: 1, name: 'Paradoxe des jumeaux — Langevin, 1911', reference: '', claim: 'Cité comme analogie.', url: '', status: '' },
  // Levier 2 — Tourner son cerveau dans le sens du succès
  { id: 's04', lever: 2, name: 'Effet Pygmalion — Rosenthal', reference: '', claim: 'La croyance d’un enseignant suffit à transformer la réussite réelle d’un élève.', url: '', status: '' },
  { id: 's05', lever: 2, name: 'Roger Bannister — le mile en moins de 4 minutes, 1954', reference: '', claim: 'L’exploit de Roger Bannister, premier à courir le mile en moins de 4 minutes.', url: '', status: '' },
  { id: 's06', lever: 2, name: 'État d’esprit de croissance — Carol Dweck', reference: '', claim: 'L’état d’esprit de croissance.', url: '', status: '' },
  { id: 's07', lever: 2, name: 'Études cliniques sur l’effet placebo', reference: '', claim: 'Des études cliniques où l’effet placebo modifie l’état d’un genou, opéré ou non.', url: '', status: '' },
  // Levier 3 — La loi de l’attraction
  { id: 's08', lever: 3, name: 'Biais de confirmation — Peter Wason', reference: '', claim: 'Un filtre mental cherche toujours ce qui confirme ce qu’il croit déjà.', url: '', status: '' },
  { id: 's09', lever: 3, name: 'Prophétie autoréalisatrice', reference: '', claim: 'Une croyance, même non exprimée, change le comportement réel de la personne en face.', url: '', status: '' },
  { id: 's10', lever: 3, name: 'Recherche sur l’empathie et la compassion', reference: '', claim: 'Complète ce levier sur le terrain relationnel.', url: '', status: '' },
  // Levier 4 — Le grand Moi et le petit Moi
  { id: 's11', lever: 4, name: 'Syndrome de l’imposteur — Pauline Clance', reference: '', claim: 'Le petit Moi ne s’arrête pas devant le succès.', url: '', status: '' },
  { id: 's12', lever: 4, name: 'Autocompassion — Kristin Neff', reference: '', claim: 'L’autocompassion distingue la fermeté de la dureté envers soi-même.', url: '', status: '' },
  { id: 's13', lever: 4, name: 'Croissance post-traumatique — Calhoun & Tedeschi', reference: '', claim: 'Une épreuve peut devenir un tournant plutôt qu’une simple perte.', url: '', status: '' },
  // Levier 5 — La monnaie la plus puissante au monde
  { id: 's14', lever: 5, name: 'Scripts financiers — Brad Klontz', reference: '', claim: 'Les scripts financiers hérités.', url: '', status: '' },
  { id: 's15', lever: 5, name: 'Gagnants de loterie', reference: '', claim: 'Les gagnants de loterie retrouvent souvent leur niveau de richesse intérieure d’origine.', url: '', status: '' },
  { id: 's16', lever: 5, name: 'Biais d’ancrage — Jared Curhan', reference: '', claim: 'Le biais d’ancrage.', url: '', status: '' },
  { id: 's17', lever: 5, name: 'Charge mentale de la rareté — Anandi Mani', reference: '', claim: 'Mesurée en laboratoire : le manque occupe l’esprit autant que le compte en banque.', url: '', status: '' },
  // Levier 6 — Le grand rêve aligné
  { id: 's18', lever: 6, name: 'Potentiel créatif — Justin Berg (Stanford, Michigan Ross)', reference: '', claim: 'L’évaluation du potentiel créatif.', url: '', status: '' },
  { id: 's19', lever: 6, name: 'Effet de surjustification — Deci & Ryan', reference: '', claim: 'Une récompense extérieure peut affaiblir un plaisir qui existait déjà, aux dépens d’une motivation plus durable.', url: '', status: '' },
  // Levier 7 — Puiser à la source infinie
  { id: 's20', lever: 7, name: 'Cohérence cardiaque — Paul Lehrer', reference: '', claim: 'La respiration et la cohérence cardiaque.', url: '', status: '' },
  { id: 's21', lever: 7, name: 'Gratitude et longévité — Danner, Snowdon & Friesen', reference: '', claim: 'L’étude de la gratitude et de la longévité, menée sur plusieurs décennies.', url: '', status: '' },
  { id: 's22', lever: 7, name: 'Émerveillement — Dacher Keltner', reference: '', claim: 'L’émerveillement rend mesurablement plus généreux.', url: '', status: '' }
]

export async function getSources(): Promise<SourceEntry[]> {
  const store = await useStore()
  return (await store.getKv<SourceEntry[]>('sources')) ?? DEFAULT_SOURCES
}
