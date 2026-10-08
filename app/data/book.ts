/**
 * Contenu éditorial du livre — source unique, reprise des documents de l'auteur
 * (contenu_site_uneformule, résumé synthétique, extrait pour le web, couverture).
 */

export const BOOK = {
  title: 'Une Formule…',
  kicker: '7 leviers pour',
  subtitle: 'Construire la vie que vous désirez',
  formula: 'Α + β = Ω',
  author: 'Dieudonné Sossa Gossou',
  maxim: 'Vous êtes l’architecte, le matériau et le magicien de votre vie.',
  hook: 'Sept leviers pour construire la vie que vous désirez, appuyés sur la science plutôt que sur la seule inspiration.',
  backCover: 'Et si votre vie obéissait à une équation ? Une équation simple, que chacun porte en soi et que presque personne n’ose écrire.'
}

export interface Lever {
  n: number
  slug: string
  short: string
  title: string
  question: string
  quote: string
  role: string
  mechanism: string[]
  science: string
  references: string[]
  exercises: { n: number, title: string, text: string }[]
  practice: string
  echo?: string
  color: string
}

/** Sept leviers, sept couleurs : la lumière blanche décomposée par le prisme (cf. « La magie du titre »). */
export const LEVERS: Lever[] = [
  {
    n: 1,
    slug: 'escalader-le-temps',
    short: 'Escalader le temps',
    title: 'Comment escalader le temps ?',
    question: 'Pour quelle raison m’est-il déjà possible d’accéder à la sagesse d’une version de moi qui a réussi ?',
    quote: 'Se souvenir du futur n’est pas une métaphore. Pour le cerveau, c’est exactement le même geste que se souvenir du passé.',
    role: 'pose le geste central : se relier à une version de soi qui a déjà atteint ce qu’on vise, le Moi futur gagnant, non comme une possibilité lointaine, mais comme un souvenir déjà installé.',
    mechanism: [
      'Ce levier repose sur une technique simple et corporelle : descendre l’attention jusqu’à se relier directement à une version de soi qui a déjà atteint ce qu’on vise, le Moi futur gagnant.',
      'Il ne s’agit pas d’une visualisation vague, mais d’un protocole précis. Le geste central n’est pas d’imaginer un futur possible, mais de s’en souvenir, presque littéralement : un souvenir, même construit à l’avance, installe dans le corps une conviction qu’une simple projection ne produit jamais.'
    ],
    science: 'Ce geste s’appuie avant tout sur la simulation épisodique constructive : le cerveau utilise les mêmes circuits, notamment l’hippocampe, pour se souvenir du passé et pour imaginer le futur. Ce résultat a depuis été confirmé auprès de patients amnésiques, chez qui les deux facultés s’effondrent ensemble.',
    references: ['Schacter & Addis — Harvard, 2007', 'Tour de chute libre d’Eagleman — Baylor, 2007', 'Paradoxe des jumeaux — Langevin, 1911 (analogie)'],
    exercises: [
      { n: 1, title: 'Se souvenir de son Moi futur gagnant', text: 'Installe dans le corps la conviction d’une version de soi qui a déjà réussi.' },
      { n: 2, title: 'Repérer ses propres élasticités du temps', text: 'Apprend à retrouver cette sensation et à l’utiliser dans le quotidien le plus ordinaire.' }
    ],
    practice: 'Deux exercices, quelques minutes, et cette connexion devient concrète.',
    echo: 'Ce mécanisme rejoint ce que le Dr Joe Vitale, dans The Remembering Process, appelle un état unifié : deux démarches qui arrivent, indépendamment, au même geste.',
    color: '#B5523B'
  },
  {
    n: 2,
    slug: 'tourner-son-cerveau-dans-le-sens-du-succes',
    short: 'Tourner son cerveau dans le sens du succès',
    title: 'Tournez votre cerveau dans le sens du succès',
    question: 'Pourquoi mon cerveau peut-il apprendre à chercher ce qui me libère plutôt que ce qui me limite ?',
    quote: 'C’est ce langage-là, celui d’un désir qui renforce la survie plutôt qu’il ne la menace, que le cerveau reconnaît comme une commande à exécuter plutôt que comme un danger à écarter.',
    role: 'protège cette sensation des croyances limitantes que le cerveau installe sans qu’on s’en aperçoive, en montrant que la croyance en soi, la sienne et celle des autres, façonne réellement ce qui devient possible.',
    mechanism: [
      'Ce levier s’intéresse à l’organe qui rend la connexion au Moi futur gagnant possible, ou qui l’empêche : le cerveau lui-même, et la façon dont il décide, à chaque instant, ce qu’il croit possible.',
      'La croyance, la sienne et celle des autres, façonne réellement ce qui devient possible, parce que le cerveau part ensuite à la recherche de tout ce qui peut la confirmer.'
    ],
    science: 'Ce mécanisme s’appuie sur l’effet Pygmalion, où la croyance d’un enseignant suffit à transformer la réussite réelle d’un élève, sur l’exploit de Roger Bannister, sur l’état d’esprit de croissance, et sur des études cliniques où l’effet placebo modifie un genou opéré ou non.',
    references: ['Effet Pygmalion — Rosenthal', 'Roger Bannister — le mile en moins de 4 minutes, 1954', 'État d’esprit de croissance — Carol Dweck', 'Études cliniques sur l’effet placebo'],
    exercises: [
      { n: 3, title: 'Repérer ses zones de capacité et d’incapacité', text: 'Identifie où une croyance limitante freine, domaine par domaine.' },
      { n: 4, title: 'Le pari de vingt-quatre heures', text: 'Teste concrètement, en une journée, une action qui contredit cette croyance.' }
    ],
    practice: 'Ces exercices entraîneront votre cerveau à chercher, sans effort supplémentaire, des raisons plutôt que des excuses.',
    color: '#C7773A'
  },
  {
    n: 3,
    slug: 'la-loi-de-l-attraction',
    short: 'La loi de l’attraction',
    title: 'La loi de l’attraction : quand nos sentiments profonds nous induisent en erreur',
    question: 'Pourquoi le sentiment que je choisis aujourd’hui peut-il déjà attirer ce que je vis demain ?',
    quote: 'La vie est un grand marché où chacun vient acheter ce qu’il a lui-même apporté.',
    role: 'protège cette même sensation des sentiments dominants mal dirigés, en montrant que ce qu’on appelle loi de l’attraction n’est rien d’autre qu’un mécanisme cognitif observable, jamais une force extérieure à soi.',
    mechanism: [
      'Ce levier s’attaque à un mécanisme aussi têtu qu’un biais cognitif bien documenté, et tout aussi indifférent à ce qu’on en pense : la loi de l’attraction, qui n’agit jamais sur les faits, mais toujours sur le sentiment qu’on laisse dominer face à eux.',
      'Elle est ici reformulée comme un mécanisme psychologique observable, jamais comme une force magique extérieure à soi.'
    ],
    science: 'Le levier s’appuie sur le biais de confirmation, qui explique pourquoi un filtre mental cherche toujours ce qui confirme ce qu’il croit déjà, et sur la prophétie autoréalisatrice, où une croyance non exprimée change le comportement réel de la personne en face. La recherche sur l’empathie et la compassion vient compléter ce levier sur le terrain relationnel.',
    references: ['Biais de confirmation — Peter Wason', 'Prophétie autoréalisatrice', 'Recherche sur l’empathie et la compassion'],
    exercises: [
      { n: 5, title: 'Le relevé de sentiments', text: 'Repère le sentiment dominant avant de pouvoir le corriger.' },
      { n: 6, title: 'L’ancrage du sentiment recherché', text: 'Installe physiquement, dans le corps, le sentiment que l’on souhaite voir dominer à sa place.' }
    ],
    practice: 'L’objectif est de reprendre la main sur ce filtre, sans jamais y laisser trop de vous-même.',
    color: '#C29A3A'
  },
  {
    n: 4,
    slug: 'le-grand-moi-et-le-petit-moi',
    short: 'Le Grand Moi et le petit Moi',
    title: 'Le Grand Moi et le petit Moi : lequel gouverne votre vie ?',
    question: 'Comment se fait-il que je puisse agir avec confiance, même quand la peur est encore là ?',
    quote: 'Nous ne sommes ni notre petit Moi ni notre Grand Moi : ce ne sont que deux outils à notre disposition, et il nous revient de choisir lequel nous utilisons.',
    role: 'apprend à faire gouverner cette sensation face à la peur, en distinguant les deux voix intérieures, le petit Moi qui protège, le Grand Moi qui ose, et en redonnant à la personne l’arbitrage entre les deux.',
    mechanism: [
      'Ce levier distingue deux forces intérieures : le petit Moi, qui protège, et le Grand Moi, qui ose malgré la peur encore présente plutôt que d’attendre qu’elle disparaisse.',
      'Reconnaître laquelle des deux voix a pris le contrôle d’une décision permet de reprendre l’arbitrage entre les deux, plutôt que de le subir.'
    ],
    science: 'Ce levier s’appuie sur le syndrome de l’imposteur, qui montre que le petit Moi ne s’arrête pas devant le succès, sur l’autocompassion, qui distingue la fermeté de la dureté envers soi-même, et sur la croissance post-traumatique, qui documente comment une épreuve peut devenir un tournant plutôt qu’une simple perte.',
    references: ['Syndrome de l’imposteur — Pauline Clance', 'Autocompassion — Kristin Neff', 'Croissance post-traumatique — Calhoun & Tedeschi'],
    exercises: [
      { n: 7, title: 'L’ancrage du Grand Moi', text: 'Installe un état de confiance dans le corps.' },
      { n: 8, title: 'Le carton rouge de la semaine', text: 'Prouve par une action concrète que la peur n’empêche pas d’agir.' },
      { n: 9, title: 'La lettre à votre Moi futur', text: 'Couche sur le papier un engagement daté à tenir.' }
    ],
    practice: 'Sur le vif, ces exercices aident à reconnaître laquelle des deux voix a pris le micro.',
    color: '#6F8450'
  },
  {
    n: 5,
    slug: 'la-monnaie-la-plus-puissante-au-monde',
    short: 'La monnaie la plus puissante au monde',
    title: 'La monnaie la plus puissante au monde',
    question: 'Pourquoi ma richesse la plus puissante peut-elle déjà circuler, avant le premier euro gagné ?',
    quote: 'La valeur d’une chose ne se lit jamais sur la chose elle-même. Elle se lit dans le regard de celui qui la contemple, et ce regard peut toujours changer.',
    role: 'convertit cette même sensation en une monnaie intérieure, faite de sentiments positifs, capable de circuler en soi avant même de devenir de l’argent réel.',
    mechanism: [
      'Ce levier applique l’arbitrage entre petit Moi et Grand Moi à un terrain où presque tout le monde se sent jugé sans appel : l’argent.',
      'Il pose l’existence d’une monnaie intérieure, faite de sentiments positifs, activable à volonté, distincte de l’argent réel mais capable de s’y convertir.'
    ],
    science: 'Ce levier s’appuie sur la recherche sur les scripts financiers hérités, sur l’étude des gagnants de loterie qui retrouvent souvent leur niveau de richesse intérieure d’origine, sur le biais d’ancrage, et sur la charge mentale de la rareté, mesurée en laboratoire, qui montre que le manque occupe l’esprit autant que le compte en banque.',
    references: ['Scripts financiers — Brad Klontz', 'Gagnants de loterie', 'Biais d’ancrage — Jared Curhan', 'Charge mentale de la rareté — Anandi Mani'],
    exercises: [
      { n: 10, title: 'Réécrire son script financier', text: 'Identifie et corrige un programme hérité.' },
      { n: 11, title: 'La visite chez votre Moi déjà riche', text: 'Fait ressentir la richesse intérieure déjà présente.' },
      { n: 12, title: 'Le bilan hebdomadaire de la monnaie intérieure', text: 'En suit la production régulière.' }
    ],
    practice: 'Ces exercices vous serviront à identifier votre monnaie intérieure, à la rendre plus mesurable et à apprendre à l’activer volontairement.',
    color: '#4F7A86'
  },
  {
    n: 6,
    slug: 'le-grand-reve-aligne',
    short: 'Le grand rêve aligné',
    title: 'Le grand rêve aligné',
    question: 'Pourquoi le rêve qui me ressemble vraiment est-il déjà en moi, et non chez les autres ?',
    quote: 'La solution à un problème se trouve rarement là où il y a le plus de lumière. Elle se trouve là où le problème est réellement né.',
    role: 'aligne cette sensation avec les talents propres de la personne, pour qu’un rêve poursuivi lui appartienne vraiment, plutôt que d’être emprunté à la réussite de quelqu’un d’autre.',
    mechanism: [
      'Ce levier s’attaque au syndrome du lampadaire, ce réflexe qui pousse à chercher une solution ou un rêve là où d’autres l’ont déjà trouvé, plutôt qu’à l’intérieur de soi.',
      'Il pose une question différente de celle qu’on se pose d’habitude : non pas comment devenir capable, mais quel rêve utilise déjà les talents qu’on possède.'
    ],
    science: 'Ce levier s’appuie sur les travaux consacrés à l’évaluation du potentiel créatif, et sur l’effet de surjustification, qui montre qu’une récompense extérieure peut affaiblir un plaisir qui existait déjà, aux dépens d’une motivation plus durable.',
    references: ['Potentiel créatif — Justin Berg (Stanford, Michigan Ross)', 'Effet de surjustification — Deci & Ryan'],
    exercises: [
      { n: 13, title: 'L’inventaire des talents', text: 'Liste les talents naturels de la personne.' },
      { n: 14, title: 'Le diagnostic d’alignement', text: 'Vérifie si le rêve poursuivi les utilise réellement.' }
    ],
    practice: 'Ces exercices donnent enfin à ce rêve une forme suffisamment concrète pour tenir dans le temps.',
    color: '#5D6290'
  },
  {
    n: 7,
    slug: 'puiser-a-la-source-infinie',
    short: 'Puiser à la source infinie',
    title: 'Puisez à la source infinie',
    question: 'Pourquoi un simple souffle peut-il déjà me relier à une source sans fond ?',
    quote: 'Les organes du corps ne cherchent jamais de chemin détourné vers ce dont ils ont besoin. Ils puisent directement, sans se demander si la source est assez proche pour être vraie.',
    role: 'relie enfin cette sensation à une source d’énergie intérieure disponible à tout moment, par la respiration et la présence, pour qu’elle ne s’épuise jamais.',
    mechanism: [
      'Ce dernier levier répond à une question différente de celle qu’on se pose d’habitude : non pas où trouver l’énergie qui manque, mais pourquoi elle est déjà là, disponible sans détour.',
      'Une pratique de respiration et de présence relie directement à une source d’énergie intérieure, plutôt que de la chercher à l’extérieur, comme le lion de la fable qui chassait ce que l’herbe donnait déjà directement.'
    ],
    science: 'Ce levier s’appuie sur la recherche sur la respiration et la cohérence cardiaque, sur l’étude de la gratitude et de la longévité menée sur plusieurs décennies, et sur les travaux consacrés à l’émerveillement, qui montrent qu’il rend mesurablement plus généreux.',
    references: ['Cohérence cardiaque — Paul Lehrer', 'Gratitude et longévité — Danner, Snowdon & Friesen', 'Émerveillement — Dacher Keltner'],
    exercises: [
      { n: 15, title: 'Construire son protocole d’Attraction Active Augmentée', text: 'Met en pratique, avec le corps entier, l’ensemble de ce que le livre a construit.' },
      { n: 16, title: 'La revue complète du chemin parcouru', text: 'Referme le livre par un bilan sur les sept leviers pratiqués.' }
    ],
    practice: 'Cette source, quelques respirations suffisent à la vivre plutôt qu’à seulement la comprendre.',
    color: '#84597E'
  }
]

export const leverBySlug = (slug: string) => LEVERS.find(l => l.slug === slug)
export const leverByNumber = (n: number) => LEVERS.find(l => l.n === n)

export const FORMULA_TERMS = [
  {
    symbol: 'Α',
    name: 'Alpha',
    role: 'Le matériau',
    title: 'Vous, aujourd’hui',
    text: 'Vos ressources, vos échecs, vos talents encore en jachère, votre histoire entière : tout ce que vous apportez à l’équation sans avoir eu besoin de le demander à personne.'
  },
  {
    symbol: 'β',
    name: 'Bêta',
    role: 'Le magicien',
    title: 'Le mécanisme',
    text: 'Une seule et même dynamique, qui se donne à voir sous sept facettes, une par levier. β ne se révèle jamais en une seule fois : il se découvre facette après facette, à votre rythme.'
  },
  {
    symbol: 'Ω',
    name: 'Oméga',
    role: 'L’architecte',
    title: 'La version révélée',
    text: 'Pas un autre vous : la version de vous qui existait déjà en germe dans Α, révélée par l’activation de β. Rien n’est ajouté de l’extérieur.'
  }
]

export interface Excerpt {
  slug: string
  label: string
  title: string
  formula?: boolean
  paragraphs: string[]
  note?: string
}

export const EXCERPTS: Excerpt[] = [
  {
    slug: 'la-magie-du-titre',
    label: 'Extrait 1',
    title: 'La magie du titre',
    paragraphs: [
      'Avant de retenir le titre « Une Formule », ce livre a longtemps porté un autre nom possible : La Lumière.',
      'Les deux mots se sont disputé la couverture. Et si Formule l’a emporté, c’est qu’elle porte quelque chose que Lumière ne pouvait pas dire seule. Formule, c’est la question qui traverse chaque page de ce livre, posée ici sous trois formes. Connaissez-vous déjà cette chose que vous êtes la seule personne à pouvoir offrir au monde ? Cette capacité créative qui est déjà en vous, est-elle alignée sur vos talents, sur le fonctionnement de votre subconscient, pour se déployer d’elle-même et sans effort ? Avez-vous identifié, activé dans le bon sens, les forces et les ressources déjà à votre disposition ?',
      'Chercher la formule, c’est chercher la lumière qui éclaire ces questions. Une étincelle suffit parfois pour changer la trajectoire d’une vie entière.',
      'Les deux mots ne sont pas seulement proches par le sens. Formule et Lumière comptent chacun sept lettres. Et sept, ce n’est pas un hasard non plus ailleurs. La lumière blanche du soleil se décompose en sept couleurs quand elle traverse un prisme ou une goutte de pluie, du rouge au violet, chacune voyageant à sa propre longueur d’onde.',
      'Sept lettres, sept couleurs. Deux échos qui se répondent sans qu’on ait eu besoin de forcer quoi que ce soit pour les faire coïncider.',
      'Il y en a peut-être d’autres. Je ne les ai pas tous trouvés, et ce n’est pas grave. À vous de continuer à chercher, selon vos propres croyances, vos propres expériences. Sortez du livre si besoin, et revenez l’enrichir de ce que vous aurez trouvé. C’est exactement l’esprit dans lequel cette formule a été pensée : jamais figée, toujours à améliorer, la vôtre autant que la mienne.'
    ]
  },
  {
    slug: 'note-explicative-de-la-formule',
    label: 'Extrait 2',
    title: 'Note explicative de la formule',
    formula: true,
    paragraphs: [
      'Vous l’avez déjà vue sur la couverture : Α + β = Ω. Ce n’est pas un ornement mathématique choisi pour faire sérieux. C’est un raccourci volontaire des convictions qui portent ce livre, écrit par quelqu’un qui est, entre autres titres, mathématicien.',
      'Α, c’est vous, aujourd’hui, tel que vous êtes déjà : vos ressources, vos échecs, vos talents encore en jachère, votre histoire entière, tout ce que vous apportez à l’équation sans avoir eu besoin de le demander à personne.',
      'β, c’est le mécanisme. Pas un mécanisme abstrait : une seule et même dynamique, qui se donne à voir sous sept facettes, une par levier de ce livre, chacune éclairant une part différente du même geste. β ne se révèle jamais en une seule fois. Il se découvre facette après facette, à votre rythme, dans l’ordre qui vous convient.',
      'Ω, enfin, n’est pas en réalité un autre vous. C’est la version de vous qui existait déjà en germe dans Α, révélée par l’activation de β. Rien n’est ajouté de l’extérieur : l’équation ne fait que rendre visible ce qui était déjà là, en attente.',
      'Cette équation reprend, sous une autre forme, la phrase qui traverse tout ce livre : « vous êtes l’architecte, le matériau et le magicien de votre vie ». Le matériau, c’est Α, c’est vous. Le magicien, c’est vous aussi, dès que vous actionnez le mécanisme β. Et l’architecte, celui qui dessine les plans d’Ω avant même de commencer à construire, à travers l’exercice que ce livre appelle escalader le temps, c’est encore vous, depuis le début.',
      'Ce n’est qu’une façon de présenter la formule. Vous en trouverez peut-être une autre, la vôtre, en avançant dans ce livre.'
    ]
  },
  {
    slug: 'avant-propos',
    label: 'Extrait 3',
    title: 'Avant-propos',
    paragraphs: [
      'En 1993, j’étais en deuxième année de mathématiques à l’université d’Abomey-Calavi, au Bénin, quand je suis tombé gravement malade deux semaines avant la session d’examens qui devait décider de mon maintien à la faculté. La veille des épreuves, mon pronostic vital était engagé, au point que personne, dans le service où j’étais soigné, ne pariait sur ma survie jusqu’au lendemain. J’ai demandé au corps médical l’autorisation d’aller composer. On m’a répondu, avec une pointe de moquerie, que je ferais mieux de me concentrer sur ma guérison. Mais dans mon esprit, réussir cet examen n’était plus une question de moyenne à valider, c’était devenu, littéralement, une question de survie. À l’aube du jour J, j’ai trouvé la force de quitter mon lit d’hôpital pour aller composer. Sur environ trois cents candidats, sept ont été déclarés admis. J’en faisais partie.'
    ],
    note: 'La suite de l’avant-propos est réservée au livre.'
  }
]

export const AUTHOR = {
  name: 'Dieudonné Sossa Gossou',
  roles: ['Mathématicien', 'Économiste planificateur', 'Coach professionnel certifié'],
  bio: [
    'Sossa Dieudonné Gossou est mathématicien de formation, spécialisé en aide à la décision, économiste planificateur et coach professionnel certifié.',
    'Sa carrière commence en 1997 dans l’enseignement des mathématiques, avant de s’élargir, sur plus de vingt ans, à l’économie, à l’ingénierie de la formation, au conseil en politiques publiques, puis au coaching certifié à Genève. Depuis 2007, il accompagne comme consultant indépendant des ministères, des institutions internationales et des organisations de la société civile, à travers le cabinet qu’il dirige.',
    'Cette double expérience, la rigueur du mathématicien et le terrain de l’accompagnement humain, est au cœur d’Une Formule : un livre de développement personnel qui s’appuie sur des références scientifiques nommées plutôt que sur la seule inspiration.',
    'Une Formule est son second ouvrage de développement personnel. Il vit et travaille au Bénin.'
  ],
  timeline: [
    { year: '1993', title: 'Sept admis sur trois cents', text: 'Étudiant en mathématiques à l’université d’Abomey-Calavi, il quitte son lit d’hôpital à l’aube pour composer. Il fait partie des sept admis.' },
    { year: '1997', title: 'Enseigner les mathématiques', text: 'Début de carrière dans l’enseignement des mathématiques.' },
    { year: '+20 ans', title: 'Élargir le champ', text: 'Économie, ingénierie de la formation, conseil en politiques publiques, puis coaching certifié à Genève.' },
    { year: '2007', title: 'Consultant indépendant', text: 'Il accompagne ministères, institutions internationales et organisations de la société civile, à travers le cabinet qu’il dirige.' },
    { year: 'Aujourd’hui', title: 'Une Formule', text: 'Son second ouvrage de développement personnel, écrit au Bénin, où il vit et travaille.' }
  ]
}

export interface FaqGroup { title: string, items: { q: string, a: string }[] }

export const FAQ: FaqGroup[] = [
  {
    title: 'Sur le livre en général',
    items: [
      { q: 'Qu’est-ce qu’Une Formule ?', a: 'Un livre de développement personnel organisé en sept leviers, chacun appuyé sur des références scientifiques nommées et datées, plutôt que sur la seule inspiration. La formule Α + β = Ω en résume l’idée centrale : vous, plus le mécanisme activé un levier à la fois, égale la version de vous déjà en germe.' },
      { q: 'À qui s’adresse ce livre ?', a: 'À toute personne qui veut avancer concrètement plutôt que seulement se sentir inspirée. Chaque levier se termine par des exercices pratiques, pensés pour être faits, pas seulement lus.' },
      { q: 'Le livre s’appuie-t-il vraiment sur des données scientifiques ?', a: 'Oui. Chaque référence scientifique nommée dans le livre (chercheur, étude, date) a été vérifiée avant publication. Une section Sources en fin d’ouvrage répertorie les références utilisées.' },
      { q: 'Faut-il lire les sept leviers dans l’ordre ?', a: 'Non. Chaque levier peut s’activer indépendamment des six autres, à son propre rythme.' },
      { q: 'Comment donner un retour sur le livre ?', a: 'Depuis le menu Retours des lecteurs, en choisissant le levier concerné ou l’entrée générale.' }
    ]
  },
  {
    title: 'Sur le titre et la promesse du livre',
    items: [
      { q: 'Pourquoi le livre s’appelle-t-il Une Formule ?', a: 'Le titre a longtemps hésité avec un autre nom, La Lumière. Les deux mots partagent plus qu’on ne le croit, à commencer par un chiffre qui traverse tout le livre. L’histoire complète se trouve dans l’extrait La magie du titre, mais en résumé : Formule l’a emporté parce qu’il porte une question, pas seulement une image, celle de savoir si ce que vous portez déjà en vous est activé dans le bon sens.' },
      { q: 'Que signifie la formule Α + β = Ω ?', a: 'Ce n’est pas un ornement mathématique choisi pour faire sérieux. Α, c’est vous aujourd’hui, avec vos ressources et votre histoire. β, c’est le mécanisme du livre, activé un levier à la fois. Ω n’est pas un autre vous : c’est la version de vous qui existait déjà en germe dans Α, révélée par l’activation de β. L’extrait Note explicative de la formule développe cette idée en détail.' }
    ]
  },
  {
    title: 'Sur ce qui distingue ce livre du reste du genre',
    items: [
      { q: 'Le livre parle-t-il de la loi de l’attraction ?', a: 'Oui, mais pas comme on l’attend. Le livre reformule la loi de l’attraction comme un mécanisme psychologique observable, biais de confirmation, prophétie autoréalisatrice, plutôt que comme une force magique extérieure à soi. C’est l’un des sept leviers du livre, et l’un des points qui distinguent le plus nettement cet ouvrage dans son genre.' },
      { q: 'Peut-on lire ce livre en étant sceptique du développement personnel ?', a: 'C’est même exactement le lecteur que ce livre cherche à atteindre. Chaque levier s’appuie sur des références scientifiques nommées et vérifiées avant publication, chercheur, étude, date, plutôt que sur la seule inspiration. Une section Sources en fin d’ouvrage permet de vérifier chaque référence par soi-même.' },
      { q: 'Le livre promet-il des résultats rapides ?', a: 'Non, et c’est volontaire. Le livre ne promet ni richesse instantanée ni transformation en une nuit. Ce qu’il propose, ce sont des mécanismes réels, expliqués avec leurs limites, et des exercices concrets à pratiquer, pas seulement à lire. Le dernier exercice invite même à revenir sur ses réponses plusieurs mois plus tard, pour mesurer un chemin réel plutôt qu’un simple sursaut de motivation.' }
    ]
  },
  {
    title: 'Sur des concepts précis',
    items: [
      { q: 'Qu’est-ce que escalader le temps ?', a: 'C’est le nom donné au premier levier du livre, et sans doute son idée la plus centrale. Il s’agit d’une technique pour se relier à une version de vous qui a déjà atteint ce que vous visez, pas en l’imaginant vaguement, mais en vous en souvenant, presque littéralement. L’extrait de l’avant-propos et celui du Levier 1 donnent un premier aperçu du mécanisme.' },
      { q: 'Faut-il déjà savoir ce qu’on veut dans la vie pour commencer ce livre ?', a: 'Non. Un des sept leviers du livre est précisément conçu pour vous aider à l’identifier, à partir de vos propres talents plutôt qu’en imitant ce qui a réussi à d’autres. Vous pouvez commencer ce livre sans réponse toute faite.' }
    ]
  },
  {
    title: 'Sur la lecture elle-même',
    items: [
      { q: 'Faut-il lire les sept leviers d’une traite ?', a: 'Non, et ce n’est même pas recommandé. Chaque levier peut s’activer indépendamment des six autres, à votre propre rythme. Vous pouvez avancer d’un coup, ou laisser un levier infuser avant de passer au suivant. Les deux façons de lire fonctionnent.' }
    ]
  }
]

/* ───────────── Formulaires de retours (gabarits du document de contenu) ───────────── */

export type Consent = 'ANONYMOUS' | 'FIRST_NAME' | 'NO'
export type Practiced = 'FULL' | 'PARTIAL' | 'NOT_YET'

export const CONSENT_OPTIONS: { value: Consent, label: string }[] = [
  { value: 'ANONYMOUS', label: 'Oui, anonymement' },
  { value: 'FIRST_NAME', label: 'Oui, avec mon prénom' },
  { value: 'NO', label: 'Non' }
]

export const PRACTICED_OPTIONS: { value: Practiced, label: string }[] = [
  { value: 'FULL', label: 'Oui, entièrement' },
  { value: 'PARTIAL', label: 'Oui, en partie' },
  { value: 'NOT_YET', label: 'Pas encore' }
]

export interface TextQuestion { key: string, label: string, hint?: string }

export const LEVER_TEXT_QUESTIONS: TextQuestion[] = [
  { key: 'marked', label: 'Qu’est-ce qui vous a le plus marqué dans ce levier ?' },
  { key: 'change', label: 'Avez-vous remarqué un changement concret depuis que vous pratiquez ce levier ?' }
]
export const LEVER_DIFFICULT_QUESTION: TextQuestion = {
  key: 'difficult', label: 'Un passage vous a-t-il semblé difficile à comprendre ou à appliquer ?'
}

export const GENERAL_TEXT_QUESTIONS: TextQuestion[] = [
  { key: 'favorite', label: 'Quel est votre levier préféré, et pourquoi ?' },
  { key: 'changed', label: 'Qu’est-ce que ce livre a changé, concrètement, dans votre vie ?' },
  { key: 'recommend', label: 'Recommanderiez-vous ce livre ? À qui ?' },
  { key: 'striking', label: 'Y a-t-il un passage, une idée ou une histoire qui vous a particulièrement marqué ?' },
  { key: 'deeper', label: 'Qu’aimeriez-vous voir approfondi dans une prochaine édition ?' }
]

export const ANSWER_LABELS: Record<string, string> = Object.fromEntries([
  ...LEVER_TEXT_QUESTIONS, LEVER_DIFFICULT_QUESTION, ...GENERAL_TEXT_QUESTIONS
].map(q => [q.key, q.label]))

export const RATING_LABELS = ['Pas utile', 'Peu utile', 'Utile', 'Très utile', 'Essentiel']

export const formatXof = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n).replace(/ | /g, ' ') + ' FCFA'

/** Le franc CFA est arrimé à l’euro : 1 € = 655,957 FCFA. */
export const xofToEur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n / 655.957)
