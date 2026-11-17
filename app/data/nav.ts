import { EXCERPTS } from '~/data/book'

/* Navigation du site : partagée par la barre du haut (ordinateur) et la barre d’onglets (mobile). */
export interface NavChild { to: string, label: string, hint: string }
export interface NavLink { to: string, label: string, also?: string[], children?: NavChild[] }

const HINTS: Record<string, string> = {
  'la-magie-du-titre': 'Formule ou Lumière ?',
  'note-explicative-de-la-formule': 'Α + β = Ω, terme à terme',
  'avant-propos': 'D’où vient ce livre'
}

/* Cinq entrées ; « Le livre » ouvre un sous-menu. */
export const NAV_LINKS: NavLink[] = [
  {
    to: '/les-7-leviers',
    label: 'Le livre',
    also: ['/le-livre'],
    children: [
      { to: '/les-7-leviers', label: 'Les leviers', hint: 'Sept leviers, seize exercices' },
      ...EXCERPTS.map(e => ({ to: e.path, label: e.menu, hint: HINTS[e.slug] ?? '' }))
    ]
  },
  { to: '/extraits', label: 'Extraits' },
  { to: '/auteur', label: 'L’auteur' },
  { to: '/faq', label: 'Questions' },
  { to: '/retours', label: 'Retours', also: ['/avis'] }
]

export const isNavActive = (path: string, l: { to: string, also?: string[] }) =>
  [l.to, ...(l.also ?? [])].some(to => path === to || path.startsWith(to + '/'))
