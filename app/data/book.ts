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
  /** Question de possibilité (« Sept questions avant de commencer »). */
  question: string
  /** Citation phare : l’accroche de la page de titre du levier. */
  quote: string
  /** Mécanisme, version allégée. */
  mechanism: string
  /** Socle scientifique (encadré « Mécanisme du levier »). */
  science: string
  exercises: { n: number, title: string }[]
  color: string
}

/** Sept leviers, sept couleurs : la lumière blanche décomposée par le prisme (cf. « La magie du titre »).
 *  Textes des pages de titre repris de la version aj14 du livre (mécanisme : version allégée). */
export const LEVERS: Lever[] = [
  {
    n: 1,
    slug: 'escalader-le-temps',
    short: 'Escalader le temps',
    title: 'Comment escalader le temps ?',
    question: 'Pour quelle raison m’est-il déjà possible d’accéder à la sagesse d’une version de moi qui a réussi ?',
    quote: 'Se souvenir du futur n’est pas une métaphore. Pour le cerveau, c’est le même geste que se souvenir du passé.',
    mechanism: 'Votre cerveau se souvient du futur comme du passé : consultez dès maintenant la version de vous qui a déjà réussi.',
    science: 'Schacter et Addis, Université Harvard, 2007 : en comparant par imagerie cérébrale une personne qui se souvient d’un événement passé et une personne qui imagine un événement futur, ils ont montré que les deux activités mobilisent un réseau largement commun de régions cérébrales.',
    exercises: [
      { n: 1, title: 'Se souvenir de son Moi futur gagnant' },
      { n: 2, title: 'Repérer ses propres élasticités du temps' }
    ],
    color: '#B5523B'
  },
  {
    n: 2,
    slug: 'tourner-son-cerveau-dans-le-sens-du-succes',
    short: 'Tourner son cerveau dans le sens du succès',
    title: 'Tournez votre cerveau dans le sens du succès',
    question: 'Pourquoi mon cerveau peut-il apprendre à chercher ce qui me libère plutôt que ce qui me limite ?',
    quote: 'Pour le cerveau, le désir perçu comme vital est un ordre à exécuter ; celui perçu comme une menace pour la survie est un danger à bloquer.',
    mechanism: 'Ce que votre cerveau croit possible oriente tout ce qu’il met en œuvre : changez la question, il change de direction.',
    science: 'Albert Bandura, à partir des années 1970 : ses travaux ont donné un nom précis, le sentiment d’efficacité personnelle, à ce que les histoires de Rosenthal (l’effet Pygmalion chez les enseignants) et de Bannister (le record du mile) illustraient chacune séparément, en le confirmant à travers de nombreuses études menées dans des domaines aussi différents que le sport, la santé ou l’éducation.',
    exercises: [
      { n: 3, title: 'Repérer ses zones de capacité et d’incapacité' },
      { n: 4, title: 'Le pari de vingt-quatre heures' }
    ],
    color: '#A85C28'
  },
  {
    n: 3,
    slug: 'la-loi-de-l-attraction',
    short: 'La loi de l’attraction',
    title: 'La loi de l’attraction : quand nos sentiments profonds nous induisent en erreur',
    question: 'Pourquoi le sentiment que je choisis aujourd’hui peut-il déjà attirer ce que je vis demain ?',
    quote: 'La vie est un grand marché où chacun vient acheter ce qu’il a lui-même apporté.',
    mechanism: 'Le sentiment que vous laissez dominer filtre ce que vous voyez et façonne ce que vous récoltez : il peut être choisi plutôt que subi.',
    science: 'Peter Wason, psychologue cognitif britannique, 1960 : en soumettant des volontaires à un test logique, il a montré qu’ils choisissaient le plus souvent les vérifications capables de confirmer leur première hypothèse, plutôt que celles, tout aussi informatives, qui auraient pu la contredire.',
    exercises: [
      { n: 5, title: 'Le relevé de sentiments' },
      { n: 6, title: 'L’ancrage du sentiment recherché' }
    ],
    color: '#977424'
  },
  {
    n: 4,
    slug: 'le-grand-moi-et-le-petit-moi',
    short: 'Le Grand Moi et le petit Moi',
    title: 'Le Grand Moi et le petit Moi : lequel gouverne votre vie ?',
    question: 'Comment se fait-il que je puisse agir avec confiance, même quand la peur est encore là ?',
    quote: 'Nous ne sommes ni notre petit Moi ni notre Grand Moi : ce ne sont que deux outils à notre disposition, et il nous revient de choisir lequel nous utilisons.',
    mechanism: 'Le petit Moi est un mécanisme construit, pas un trait de caractère : il est réversible, et vos ailes n’ont jamais cessé de fonctionner.',
    science: 'Seligman et Maier, 1967 : en exposant des chiens à des chocs électriques inévitables, ils ont montré qu’ils cessaient ensuite d’essayer d’échapper à un choc devenu évitable, un renoncement appris plutôt qu’une incapacité réelle, retrouvé depuis chez l’humain sous le nom d’impuissance apprise.',
    exercises: [
      { n: 7, title: 'L’ancrage du Grand Moi' },
      { n: 8, title: 'Le carton rouge de la semaine' },
      { n: 9, title: 'La lettre à votre Moi futur' }
    ],
    color: '#667A49'
  },
  {
    n: 5,
    slug: 'la-monnaie-la-plus-puissante-au-monde',
    short: 'La monnaie la plus puissante au monde',
    title: 'La monnaie la plus puissante au monde',
    question: 'Pourquoi ma richesse la plus puissante peut-elle déjà circuler, avant le premier euro gagné ?',
    quote: 'La valeur d’une chose ne se lit jamais sur la chose elle-même. Elle se lit dans le regard de celui qui la contemple, et ce regard peut toujours changer.',
    mechanism: 'La valeur ne se lit pas sur la chose, mais dans le regard posé sur elle : votre monnaie intérieure peut précéder l’argent.',
    science: 'Kahneman et Deaton, Université Princeton, prix Nobel, 2010 : en analysant les réponses de plus de quatre cent cinquante mille Américains, ils ont montré que le bien-être émotionnel ressenti au quotidien progresse avec le revenu jusqu’à un certain seuil, puis semble cesser de progresser. En 2023, Killingsworth, Kahneman et Mellers ont montré que, en moyenne, il continue pourtant de progresser, sans plateau.',
    exercises: [
      { n: 10, title: 'Réécrire son script financier' },
      { n: 11, title: 'La visite chez votre Moi déjà riche' },
      { n: 12, title: 'Le bilan hebdomadaire de la monnaie intérieure' }
    ],
    color: '#4F7A86'
  },
  {
    n: 6,
    slug: 'le-grand-reve-aligne',
    short: 'Le grand rêve aligné',
    title: 'Le grand rêve aligné',
    question: 'Pourquoi le rêve qui me ressemble vraiment est-il déjà en moi, et non chez les autres ?',
    quote: 'La solution à un problème se trouve rarement là où il y a le plus de lumière. Elle se trouve là où le problème est réellement né.',
    mechanism: 'La solution naît d’abord à l’intérieur de vous : un rêve qui vous ressemble tient seul, et votre esprit se met à le travailler.',
    science: 'Deci et Ryan, théorie de l’autodétermination, à partir de 1971 et 1985 : leurs travaux montrent qu’une action motivée par le choix, la compétence et le lien à autrui se maintient d’elle-même, contrairement à une action motivée uniquement par une récompense extérieure.',
    exercises: [
      { n: 13, title: 'L’inventaire des talents' },
      { n: 14, title: 'Le diagnostic d’alignement' }
    ],
    color: '#5D6290'
  },
  {
    n: 7,
    slug: 'puiser-a-la-source-infinie',
    short: 'Puiser à la source infinie',
    title: 'Puisez à la source infinie',
    question: 'Pourquoi un simple souffle peut-il déjà me relier à une source sans fond ?',
    quote: 'Les organes du corps ne cherchent jamais de chemin détourné vers ce dont ils ont besoin. Ils puisent directement, sans se demander si la source est assez proche pour être vraie.',
    mechanism: 'Les sources directes comblent mieux que les détours spectaculaires : la respiration est la plus à portée, environ vingt mille fois par jour.',
    science: 'Lehrer et Vaschillo, début des années 2000 : ils ont identifié une fréquence de résonance propre au système cardiovasculaire, proche de six respirations par minute, à laquelle les oscillations du rythme cardiaque et celles du réflexe barorécepteur s’amplifient au lieu de s’annuler.',
    exercises: [
      { n: 15, title: 'Construire son protocole d’Attraction Active Augmentée' },
      { n: 16, title: 'La revue complète du chemin parcouru' }
    ],
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

/** Bloc de texte du livre : paragraphe, intertitre, formule de fin, signature. */
export interface TextBlock { k: 'p' | 'h' | 'end' | 'sign', t: string }

/**
 * Textes du livre publiés sur le site, repris tels quels (pages 9 à 19 de l’extrait).
 * Affichés dans « Extraits » et dans les pages du menu « Le livre ».
 */
export interface Excerpt {
  /** Ancre dans la page Extraits. */
  slug: string
  /** Page dédiée, dans le menu « Le livre ». */
  path: string
  /** Libellé dans le menu. */
  menu: string
  label: string
  /** Titre, tel qu’il figure dans le livre. */
  title: string
  subtitle?: string
  formula?: boolean
  blocks: TextBlock[]
}

export const EXCERPTS: Excerpt[] = [
  {
    slug: 'la-magie-du-titre',
    path: '/le-livre/la-magie-du-titre',
    menu: 'La magie du titre',
    label: 'Extrait 1',
    title: 'La magie du titre',
    subtitle: 'Une Formule',
    blocks: [
      { k: 'p', t: 'Avant de retenir le titre « Une Formule », ce livre a longtemps porté un autre nom possible : La Lumière.' },
      { k: 'p', t: 'Les deux mots se sont disputé la couverture. Et si Formule l’a emporté, c’est qu’elle porte quelque chose que Lumière ne pouvait pas dire seule. Formule, c’est la question qui traverse chaque page de ce livre, posée ici sous trois formes. Connaissez-vous déjà cette chose que vous êtes la seule personne à pouvoir offrir au monde ? Cette capacité créative qui est déjà en vous, est-elle alignée sur vos talents, sur le fonctionnement de votre subconscient, pour se déployer d’elle-même et sans effort ? Avez-vous identifié, activé dans le bon sens, les forces et les ressources déjà à votre disposition ?' },
      { k: 'p', t: 'Chercher la formule, c’est chercher la lumière qui éclaire ces questions. Une étincelle suffit parfois pour changer la trajectoire d’une vie entière.' },
      { k: 'p', t: 'Les deux mots ne sont pas seulement proches par le sens. Formule et Lumière comptent chacun sept lettres. Et sept, ce n’est pas un hasard non plus ailleurs. La lumière blanche du soleil se décompose en sept couleurs quand elle traverse un prisme ou une goutte de pluie, du rouge au violet, chacune voyageant à sa propre longueur d’onde.' },
      { k: 'p', t: 'Sept lettres, sept couleurs. Deux échos qui se répondent sans qu’on ait eu besoin de forcer quoi que ce soit pour les faire coïncider.' },
      { k: 'p', t: 'Il y en a peut-être d’autres. Je ne les ai pas tous trouvés, et ce n’est pas grave. À vous de continuer à chercher, selon vos propres croyances, vos propres expériences. Sortez du livre si besoin, et revenez l’enrichir de ce que vous aurez trouvé. C’est l’esprit dans lequel cette formule a été pensée : jamais figée, toujours à améliorer, la vôtre autant que la mienne.' }
    ]
  },
  {
    slug: 'note-explicative-de-la-formule',
    path: '/le-livre/explication-de-la-formule',
    menu: 'Explication de la formule',
    label: 'Extrait 2',
    title: 'Note explicative de la formule',
    formula: true,
    blocks: [
      { k: 'p', t: 'Vous l’avez déjà vue sur la couverture : Α + β = Ω. Ce n’est pas un ornement mathématique choisi pour faire sérieux. C’est un raccourci volontaire des convictions qui portent ce livre, écrit par quelqu’un qui est, entre autres titres, mathématicien.' },
      { k: 'p', t: 'Α, c’est vous, aujourd’hui, tel que vous êtes déjà : vos ressources, vos échecs, vos talents encore en jachère, votre histoire entière, tout ce que vous apportez à l’équation sans avoir eu besoin de le demander à personne.' },
      { k: 'p', t: 'β, c’est le mécanisme. Pas un mécanisme abstrait : une seule et même dynamique, qui se donne à voir sous sept facettes, une par levier de ce livre, chacune éclairant une part différente du même geste. β ne se révèle jamais en une seule fois. Il se découvre facette après facette, à votre rythme, dans l’ordre qui vous convient.' },
      { k: 'p', t: 'Ω, enfin, n’est pas en réalité un autre vous. C’est une version de vous qui existait déjà en germe dans Α, révélée par l’activation de β. Rien n’est ajouté de l’extérieur : l’équation ne fait que rendre visible ce qui était déjà là, en attente.' },
      { k: 'p', t: 'Cette équation reprend, sous une autre forme, la phrase qui traverse tout ce livre : « vous êtes l’architecte, le matériau et le magicien de votre vie ». Le matériau, c’est Α, c’est vous. Le magicien, c’est vous aussi, dès que vous actionnez le mécanisme β. Et l’architecte, celui qui dessine les plans d’Ω avant même de commencer à construire, à travers l’exercice que ce livre appelle escalader le temps, c’est encore vous, depuis le début.' },
      { k: 'p', t: 'Ce n’est qu’une façon de présenter la formule. Vous en trouverez peut-être une autre, la vôtre, en avançant dans ce livre.' },
      { k: 'h', t: 'Ancrage mathématique de la formule' },
      { k: 'p', t: 'Α + β = Ω se lit aussi en termes de chances, ou, en mathématiques, de probabilités. Α, c’est toujours vous, aujourd’hui, tel que vous êtes déjà. Ω, c’est vous demain, sous deux versions possibles que vous découvrirez dans ce livre : la gagnante et la perdante. Pour simplifier, à elles deux, elles totalisent 100 % des chances de se réaliser : si la gagnante en a 40 %, la perdante en a 60 %. β est constitué des mécanismes des sept leviers. Ils servent à déplacer ces chances en faveur de la version gagnante, par exemple de 40 % à 70 % (la perdante passerait alors de 60 % à 30 %). Ces chiffres ne sont là que pour fixer les idées : personne ne peut les mesurer avec précision.' },
      { k: 'p', t: 'Une dernière précision, valable pour tout le reste du livre. Ce livre passe, parfois sans prévenir, d’un vocabulaire scientifique à un vocabulaire plus intuitif, parfois même mystique. Ce n’est pas un manque de rigueur : c’est un choix assumé. La science éclaire certains des mécanismes qui traversent ce livre ; elle ne prétend jamais prouver chacune de ses métaphores. Là où un mécanisme est documenté, il vous sera montré comme tel, avec sa source. Là où une image reste une image, elle vous sera offerte pour ce qu’elle est : un moyen de ressentir ce que la science, seule, ne fait encore qu’effleurer.' }
    ]
  },
  {
    slug: 'avant-propos',
    path: '/le-livre/avant-propos',
    menu: 'Avant-propos',
    label: 'Extrait 3',
    title: 'Avant-propos',
    blocks: [
      { k: 'p', t: 'En 1993, j’étais en deuxième année de mathématiques à l’université d’Abomey-Calavi, au Bénin, quand je suis tombé gravement malade deux semaines avant la session d’examens qui devait décider de mon maintien à la faculté. La veille des épreuves, mon pronostic vital était engagé, au point que personne, dans le service où j’étais soigné, ne pariait sur ma survie jusqu’au lendemain. J’ai demandé au corps médical l’autorisation d’aller composer. On m’a répondu, avec une pointe de moquerie, que je ferais mieux de me concentrer sur ma guérison. Mais dans mon esprit, réussir cet examen n’était plus une question de moyenne à valider, c’était devenu, littéralement, une question de survie. À l’aube du jour J, j’ai trouvé la force de quitter mon lit d’hôpital pour aller composer. Sur environ trois cents candidats, sept ont été déclarés admis. J’en faisais partie.' },
      { k: 'p', t: 'Ce n’était ni la première ni la dernière fois que ce même réflexe allait me servir. Au début des années 2000, je poursuivais mes études tout en tenant une petite boutique à Cotonou. Un ami de l’époque avait une occasion rare de partir à l’étranger, mais il lui manquait un peu plus d’un millier d’euros et le départ était imminent. Confiant dans son plan de remboursement, j’ai fermé temporairement ma boutique, réuni toutes mes économies et accepté qu’un autre ami m’avance le complément pour lui remettre la somme.' },
      { k: 'p', t: 'Il est parti, mais le retour espéré n’a pas eu lieu. L’engagement a été rompu, la dette est restée partiellement payée, et le silence s’est installé pour longtemps. J’aurais pu nourrir du regret, de l’amertume, entrer dans une stratégie de colère. Rien de tout cela ne m’aurait construit. Plutôt que de m’attarder sur ce qui manquait et sur cette trahison apparente, je me suis reconnecté à mes forces et à mes talents. J’ai rouvert ma boutique et je l’ai reconstruite pas à pas. Cette reconstruction a fini par financer, des années plus tard, une partie des formations qui ont façonné la suite de mon parcours.' },
      { k: 'p', t: 'Ces deux histoires, séparées de plusieurs années, disent la même chose : un choc, même injuste, même presque mortel, peut devenir le point de départ d’une force qu’on ignorait posséder, à condition de savoir où regarder plutôt que de se laisser envahir par la colère ou la peur.' },
      { k: 'p', t: 'Il m’a fallu plus longtemps pour comprendre une autre leçon, plus discrète mais tout aussi centrale dans ce livre. J’ai longtemps confondu rester bon et rester silencieux face à ce qui me faisait du mal, comme si la moindre fermeté envers moi-même trahissait une bonté que je voulais absolue. Il m’a fallu être déçu plus d’une fois par des personnes qui prenaient ma gentillesse pour une invitation à en abuser, pour comprendre enfin que protéger sa bonté n’est pas la renier. Pendant longtemps aussi, j’ai cru que c’était à moi de changer pour que cesse ce mépris silencieux. Ce que j’ai fini par comprendre, c’est l’inverse : je ne contrôle jamais ce que l’autre décide de faire de ma bonté, mais je contrôle entièrement le regard que je porte sur elle. Le jour où j’ai arrêté de mesurer ma valeur au jugement de ceux qui en profitaient, ma façon même d’être bon a changé, et avec elle, les gens qu’elle attirait autour de moi.' },
      { k: 'p', t: 'Je ne suis pas arrivé aux idées de ce livre par une révélation soudaine, ni par un seul diplôme accroché au mur. J’ai commencé ma carrière en 1997 comme enseignant de mathématiques, avant de passer, sur plus de vingt ans, par l’économie, l’aide à la décision, l’ingénierie et le conseil en formation (master de l’Université de Rouen), le conseil en politiques publiques, puis le coaching certifié à Genève. Dix-sept ans de terrain auprès de ministères, d’institutions internationales et d’organisations de la société civile m’ont appris à distinguer ce qui fonctionne réellement de ce qui ne fonctionne que sur le papier, avant même que je mette ces mêmes principes au service des personnes plutôt que des seules organisations. Ce livre est fait de ce même mélange : la rigueur d’un mathématicien et l’expérience vécue d’un homme qui a lui-même traversé ce qu’il décrit.' },
      { k: 'p', t: 'Deux idées précises de ce livre, escalader le temps et la maxime qui l’accompagne, me sont venues bien avant l’idée d’écrire quoi que ce soit, au fil d’une centaine de visionnages en famille de quelques films et documentaires sur la loi de l’attraction dont The Meta Secret, Le Secret et 3 Magic Words. J’y reviens plus longuement en fin d’ouvrage. Retenez pour l’instant que ces intuitions, une fois posées, m’ont poussé à chercher ce que la science pouvait en confirmer avant d’écrire une seule ligne.' },
      { k: 'p', t: 'Ce livre lui-même a suivi cette même leçon. Au moment d’en poser les premières idées, j’ai eu la tentation d’identifier des auteurs déjà reconnus, d’étudier leurs œuvres, et d’orienter mon propre travail dans leur continuité, en espérant qu’un partenariat avec eux lui donnerait un jour de la crédibilité. Puis j’ai compris ce que j’étais en train de faire : je cherchais sous le lampadaire du village, en demandant à la réussite des autres de me dire ce que mon propre livre devait devenir. J’ai changé d’approche. Avant de chercher autour de moi, j’ai décidé de chercher en moi, et je me suis fixé une règle simple : le lecteur d’abord, la reconnaissance ensuite. Ce que vous avez entre les mains est le résultat de cette décision.' },
      { k: 'p', t: 'Si vous ouvrez ce livre, c’est peut-être que vous portez, vous aussi, un rêve resté trop longtemps sur le rebord. Peut-être qu’une trahison, une maladie, ou simplement le poids du quotidien vous a fait douter de vos propres forces. Peut-être qu’on vous a déjà pris pour quelqu’un de naïf parce que vous restiez bienveillant malgré tout. Ce livre est écrit pour vous.' },
      { k: 'p', t: 'Il ne se contente pas de se lire. Chaque levier se termine par des exercices concrets, pensés pour être pratiqués et non simplement parcourus des yeux. Je vous invite à garder un carnet à portée de main pendant la lecture, à y noter ce qui vous traverse, même une phrase, même un doute. Certains passages vont vous mettre face à des vérités inconfortables sur vous-même. C’est normal, et c’est même le signe que le travail est en train de se faire.' },
      { k: 'p', t: 'Je tiens à remercier ici toutes les personnes qui, parfois sans le savoir, ont nourri ce livre : les équipes et les institutions que j’ai accompagnées pendant dix-sept ans, mes formateurs à Rouen et à Genève, et jusqu’à cet ami resté sans nom dans ces pages, qui m’a involontairement appris ce que je n’aurais jamais choisi d’apprendre seul.' },
      { k: 'end', t: 'Bonne lecture, et bon voyage.' },
      { k: 'sign', t: 'Dieudonné GOSSOU' }
    ]
  }
]

/** Temps de lecture estimé, en minutes. */
export const readingMinutes = (e: Excerpt) => Math.max(1, Math.round(e.blocks.reduce((n, b) => n + b.t.split(/\s+/).length, 0) / 220))

export const AUTHOR = {
  name: 'Dieudonné Sossa Gossou',
  photo: '/images/auteur.webp',
  photoSmall: '/images/auteur-sm.webp',
  /** Biographie : le titre du livre est mis en italique à l’affichage. */
  bio: 'Dieudonné GOSSOU est mathématicien de formation. Il débute en 1997 comme enseignant de mathématiques à Cotonou, puis complète son parcours par l’économie, l’aide à la décision, l’ingénierie et le conseil en formation (master de l’Université de Rouen), ainsi que par la planification stratégique et la budgétisation des programmes publics (Université Laval et IDEA International). Il obtient en 2017 une certification de Master Coach à Genève. Depuis 2009, il accompagne, à travers son cabinet, des ministères béninois, des institutions internationales et des organisations de la société civile, sur un terrain où il a appris à distinguer ce qui fonctionne réellement de ce qui ne fonctionne que sur le papier. Il met aujourd’hui cette double expertise, la rigueur des mathématiques et l’expérience de l’accompagnement, au service des personnes. Une formule… 7 leviers pour construire la vie que vous désirez est son deuxième ouvrage.',
  bookTitle: 'Une formule… 7 leviers pour construire la vie que vous désirez'
}

export interface FaqGroup { title: string, items: { q: string, a: string }[] }

export const FAQ: FaqGroup[] = [
  {
    title: 'Sur le livre en général',
    items: [
      { q: 'Qu’est-ce qu’Une Formule ?', a: 'Un livre de développement personnel organisé en sept leviers, chacun appuyé sur des références scientifiques nommées et datées, plutôt que sur la seule inspiration. La formule Α + β = Ω en résume l’idée centrale : vous, plus le mécanisme activé un levier à la fois, égale la version de vous déjà en germe.' },
      { q: 'À qui s’adresse ce livre ?', a: 'À toute personne qui veut avancer concrètement plutôt que seulement se sentir inspirée. Chaque levier se termine par des exercices pratiques, pensés pour être faits, pas seulement lus.' },
      { q: 'Le livre s’appuie-t-il vraiment sur des données scientifiques ?', a: 'Oui. Chaque levier s’appuie sur des recherches que le livre nomme : chercheur, étude, date.' },
      { q: 'Faut-il lire les sept leviers dans l’ordre ?', a: 'Non. Chaque levier peut s’activer indépendamment des six autres, à son propre rythme.' },
      { q: 'Comment donner un retour sur le livre ?', a: 'Depuis l’entrée Retours du menu (uneformule.com/retours), en choisissant le levier concerné ou le retour sur le livre entier.' }
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
      { q: 'Peut-on lire ce livre en étant sceptique du développement personnel ?', a: 'C’est même exactement le lecteur que ce livre cherche à atteindre. Chaque levier s’appuie sur des recherches nommées (chercheur, étude, date) plutôt que sur la seule inspiration.' },
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
