export interface Lever {
  number: string
  slug: string
  title: string
  subtitle: string
  quote: string
  p1: string
  p2: string
  p3?: string
  takeaways: string[]
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export function useLevers() {
  const leviers: Lever[] = [
    {
      number: '01',
      slug: 'la-vision-de-clarte',
      title: 'La Vision de Clarté',
      subtitle: 'Voir plus loin. Décider mieux.',
      quote: '« La clarté n\'est pas la certitude du résultat, mais l\'immobilité absolue de l\'intention. »',
      p1: 'La plupart des trajectoires échouent non pas par manque de puissance ou de volonté, mais par dispersion de l\'attention. Dans un monde saturé de signaux contradictoires, la première vertu d\'un leader est la capacité à faire le vide autour de l\'objectif essentiel.',
      p2: 'Ce premier levier établit une méthodologie rigoureuse pour cartographier vos choix stratégiques, éliminer le bruit ambiant et verrouiller un axe prioritaire inébranlable.',
      p3: 'En éliminant l\'hésitation et les arbitrages superficiels, la vision de clarté libère une quantité phénoménale d\'énergie décisionnelle.',
      takeaways: [
        'Éliminer 80% des distractions pour concentrer la puissance sur le point d\'impact unique.',
        'Convertir une intention floue en un protocole d\'action au laser.',
        'Développer l\'immunité face aux urgences artificielles et au bruit ambiant.'
      ],
      metaTitle: 'Levier 1 : La Vision de Clarté | Une Formule par Dieudonné Sossa GOSSOU',
      metaDescription: 'Découvrez le Levier 01 du livre Une Formule : la Vision de Clarté. Apprenez à éliminer le bruit stratégique, fixer des objectifs au laser et prendre des décisions fermes.',
      keywords: ['vision de clarte', 'decision strategique', 'focus', 'discipline', 'antigravite de l intention']
    },
    {
      number: '02',
      slug: 'la-maitrise-du-temps',
      title: 'La Maîtrise du Temps',
      subtitle: 'Arrêter de courir. Commencer à régner.',
      quote: '« Le temps ne s\'économise pas : il s\'investit ou il s\'évapore. »',
      p1: 'Le temps est l\'unique ressource strictement inélastique. Ceux qui réussissent ne disposent pas de plus d\'heures, ils modifient la densité de l\'impact qu\'ils insufflent dans chaque bloc temporel.',
      p2: 'Apprenez à substituer la gestion de l\'agenda par la maîtrise de la bande passante mentale, et transformez vos journées en systèmes de création de valeur exponentielle.',
      p3: 'Maîtriser son temps, c\'est reprendre les reines de sa destinée en refusant d\'être le récepteur passif des priorités d\'autrui.',
      takeaways: [
        'Remplacer la gestion du temps par la gestion de la bande passante mentale.',
        'Créer des blocs de concentration inexpugnables (Deep Work haut niveau).',
        'Multiplier l\'impact par la souveraineté du calendrier.'
      ],
      metaTitle: 'Levier 2 : La Maîtrise du Temps | Une Formule',
      metaDescription: 'Découvrez le Levier 02 d\'Une Formule : la Maîtrise du Temps. Optimisez votre bande passante mentale et transformez votre temps en levier de valeur.',
      keywords: ['maitrise du temps', 'gestion du temps', 'bande passante mentale', 'productivite haut niveau', 'discipline']
    },
    {
      number: '03',
      slug: 'l-energie-vitale',
      title: 'L\'Énergie Vitale',
      subtitle: 'Le carburant invisible de l\'excellence.',
      quote: '« Un esprit d\'exception dans un véhicule épuisé n\'est qu\'une intention stérile. »',
      p1: 'L\'énergie gouverne la clarté de vos jugements et la fermeté de votre présence. Sans une gestion physiologique et psychologique de haut niveau, même les meilleures stratégies s\'effondrent sous le poids de la fatigue.',
      p2: 'Ce levier livre le protocole de maintien d\'un état de haute performance durable, permettant d\'opérer sous pression sans jamais entamer votre capital vital.',
      p3: 'Optimiser son énergie vitale garantit une lucidité permanente et une résilience biologique face aux charges de travail extrêmes.',
      takeaways: [
        'Restaurer et optimiser la biologie de la haute performance.',
        'Éliminer les micro-fuites d\'énergie émotionnelles et cognitives.',
        'Maintenir une clarté mentale absolue dans les moments de forte tension.'
      ],
      metaTitle: 'Levier 3 : L\'Énergie Vitale | Une Formule',
      metaDescription: 'Découvrez le Levier 03 d\'Une Formule : L\'Énergie Vitale. Le guide ultime pour maintenir une haute performance et préserver sa clarté sous pression.',
      keywords: ['energie vitale', 'haute performance', 'lucidite', 'gestion du stress', 'energie cognitive']
    },
    {
      number: '04',
      slug: 'l-effet-de-levier',
      title: 'L\'Effet de Levier',
      subtitle: 'Construire des systèmes, pas des tâches.',
      quote: '« Donnez-moi un levier assez long et un point d\'appui, et je souleverai le monde. »',
      p1: 'Travailler dur est une étape ; construire des leviers est la vraie destination. L\'effet de levier consiste à détacher vos résultats du strict volume d\'heures travaillées grâce à la puissance des processus, des technologies et des délégations.',
      p2: 'Découvrez comment concevoir des architectures organisationnelles qui continuent de produire, de croître et de rayonner en votre absence.',
      p3: 'Le levier permet de passer de la croissance linéaire à une expansion exponentielle sans dégradation de qualité.',
      takeaways: [
        'Détacher la création de valeur de la présence physique.',
        'Automatiser, déléguer et systématiser les processus clés.',
        'Utiliser le capital stratégique et technologique comme multiplicateur de puissance.'
      ],
      metaTitle: 'Levier 4 : L\'Effet de Levier | Une Formule',
      metaDescription: 'Découvrez le Levier 04 d\'Une Formule : L\'Effet de Levier. Apprenez à concevoir des systèmes autonomes et démultiplier vos résultats sans sacrifier votre temps.',
      keywords: ['effet de levier', 'systeme', 'delegation', 'scaling', 'multiplicateur de valeur']
    },
    {
      number: '05',
      slug: 'l-alignement-interieur',
      title: 'L\'Alignement Intérieur',
      subtitle: 'Faire sauter les verrous psychologiques.',
      quote: '« Le plus grand ennemi de la réussite se niche dans la contradiction de nos propres désirs. »',
      p1: 'Lorsque vos ambitions conscientes entrent en conflit avec vos croyances profondes, vous créez une friction interne invisible qui épuise votre élan. L\'alignement est l\'art de faire converger toutes vos forces vers une même direction.',
      p2: 'Débloquez les freins inconscients qui limitent votre potentiel et retrouvez la fluidité d\'une action totalement unifiée.',
      p3: 'L\'alignement intérieur supprime l\'auto-sabotage et génère une impulsion naturelle d\'une puissance inégalée.',
      takeaways: [
        'Identifier et dissoudre les croyances limitantes inconscientes.',
        'Unifier vos valeurs profondes et vos objectifs professionnels.',
        'Éliminer toute friction interne pour une exécution sans effort.'
      ],
      metaTitle: 'Levier 5 : L\'Alignement Intérieur | Une Formule',
      metaDescription: 'Découvrez le Levier 05 d\'Une Formule : L\'Alignement Intérieur. Éliminez les blocages psychologiques et faites converger vos forces vers le succès.',
      keywords: ['alignement interieur', 'psychologie de la reussite', 'auto sabotage', 'conviction', 'unite']
    },
    {
      number: '06',
      slug: 'la-resilience-active',
      title: 'La Résilience Active',
      subtitle: 'Transformer chaque choc en impulsion.',
      quote: '« L\'obstacle n\'interrompt pas la voie : il devient la voie. »',
      p1: 'L\'adversité n\'est pas une anomalie du parcours, c\'est sa matière première. La résilience active dépasse la simple résistance passive : elle consiste à utiliser l\'impact des crises pour rebondir plus haut et plus fort.',
      p2: 'Forgiez une mentalité antifragile capable d\'assimiler l\'inattendu et d\'en faire le tremplin stratégique de votre prochaine victoire.',
      p3: 'En adoptant la résilience active, chaque déconvenue se transforme en données exploitables et en opportunité de réinvention.',
      takeaways: [
        'Développer la mentalité d\'antifragilité face au chaos.',
        'Convertir immédiatement les revers en apprentissage stratégique.',
        'Utiliser l\'énergie de l\'obstacle pour propulser l\'étape suivante.'
      ],
      metaTitle: 'Levier 6 : La Résilience Active | Une Formule',
      metaDescription: 'Découvrez le Levier 06 d\'Une Formule : La Résilience Active. Apprenez à transformer les obstacles en leviers stratégiques et à forger une mentalité antifragile.',
      keywords: ['resilience active', 'antifragile', 'surmonter les obstacles', 'gestion de crise', 'force mentale']
    },
    {
      number: '07',
      slug: 'l-heritage-et-impact',
      title: 'L\'Héritage & Impact',
      subtitle: 'Bâtir pour ce qui vous dépasse.',
      quote: '« La grandeur se mesure à l\'ombre des arbres sous lesquels on ne s\'assiéra jamais. »',
      p1: 'La réussite individuelle n\'atteint sa pleine plénitude que lorsqu\'elle se transforme en impact collectif et transmissible. Ce dernier levier ouvre la réflexion sur la valeur durable que vous laissez au monde.',
      p2: 'Structurez une œuvre pérenne, insufflez du sens à vos conquêtes et inscrivez votre nom dans la durée.',
      p3: 'L\'héritage est l\'aboutissement ultime de la formule : la transformation de la réussite en rayonnement universel.',
      takeaways: [
        'Concevoir une vision à long terme qui dépasse la simple génération actuelle.',
        'Transmettre un savoir-faire, un état d\'esprit et des valeurs durables.',
        'Donner une dimension transcendance et éthique à chaque réussite.'
      ],
      metaTitle: 'Levier 7 : L\'Héritage & Impact | Une Formule',
      metaDescription: 'Découvrez le Levier 07 d\'Une Formule : L\'Héritage et l\'Impact. Bâtissez une œuvre pérenne et transmettez une valeur durable qui traverse le temps.',
      keywords: ['heritage', 'impact durable', 'transmission', 'vision a long terme', 'leadership ethiques']
    }
  ]

  const getLeverBySlug = (slug: string): Lever | undefined => {
    return leviers.find((l) => l.slug === slug)
  }

  return {
    leviers,
    getLeverBySlug
  }
}
