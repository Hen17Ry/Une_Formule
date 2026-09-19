<template>
  <section
    id="leviers"
    ref="containerRef"
    class="relative w-full bg-[#F8F4EE]"
  >
    <!-- Sticky Fullscreen Viewport for GSAP Pinning -->
    <div class="sticky top-0 h-screen w-full bg-[#F8F4EE] text-[#3A2115] flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Ambient Paper Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B08D57]/15 via-[#F8F4EE]/90 to-[#F8F4EE] pointer-events-none" />

      <!-- Section Top Header Indicator -->
      <div class="absolute top-6 md:top-10 left-0 w-full z-20 text-center pointer-events-none px-6">
        <span class="inline-block uppercase tracking-[0.4em] text-[#B08D57] font-semibold text-xs md:text-sm drop-shadow-sm">
          Les 7 Leviers · Chapitres du Livre
        </span>
      </div>

      <!-- Cards Stack Container -->
      <div class="relative w-[90vw] md:w-[min(85vw,1100px)] h-[560px] sm:h-[620px] md:h-[660px] z-10 flex items-center justify-center">
        <div
          v-for="(levier, index) in leviers"
          :key="levier.number"
          :ref="(el) => setCardRef(el, index)"
          class="lever-card absolute inset-0 bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(58,33,21,0.12)] flex flex-col justify-between overflow-y-auto"
        >
          <!-- Card Header & Content -->
          <div>
            <!-- Top Bar: Number & Subtitle -->
            <div class="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#B08D57]/20 pb-3 sm:pb-4">
              <span class="font-serif text-3xl sm:text-4xl md:text-5xl text-[#B08D57] font-medium tracking-wider">
                {{ levier.number }}
              </span>
              <span class="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#5A4234]/80 font-medium">
                {{ levier.subtitle }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3A2115] font-normal mb-4 sm:mb-6 leading-tight">
              {{ levier.title }}
            </h3>

            <!-- Prose Paragraphs -->
            <div class="space-y-3 sm:space-y-4 text-[#5A4234] text-sm sm:text-base md:text-lg font-light leading-relaxed">
              <p>{{ levier.p1 }}</p>
              <p class="hidden sm:block">{{ levier.p2 }}</p>
            </div>
          </div>

          <!-- Card Footer: Quote & Progress -->
          <div class="mt-6 pt-4 border-t border-[#B08D57]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p class="font-serif italic text-xs sm:text-sm text-[#B08D57] max-w-xl leading-snug">
              {{ levier.quote }}
            </p>
            <div class="inline-flex items-center text-xs uppercase tracking-[0.25em] text-[#B08D57] font-semibold gap-2 shrink-0">
              <span>Levier {{ levier.number }} / 07</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const containerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const setCardRef = (el: any, index: number) => {
  if (el) cardRefs.value[index] = el as HTMLElement
}

let ctx: gsap.Context | null = null

const leviers = [
  {
    number: '01',
    title: 'La Vision de Clarté',
    subtitle: 'Voir plus loin. Décider mieux.',
    quote: '« La clarté n\'est pas la certitude du résultat, mais l\'immobilité absolue de l\'intention. »',
    p1: 'La plupart des trajectoires échouent non pas par manque de puissance ou de volonté, mais par dispersion de l\'attention. Dans un monde saturé de signaux contradictoires, la première vertu d\'un leader est la capacité à faire le vide autour de l\'objectif essentiel.',
    p2: 'Ce premier levier établit une méthodologie rigoureuse pour cartographier vos choix stratégiques, éliminer le bruit ambiant et verrouiller un axe prioritaire inébranlable.'
  },
  {
    number: '02',
    title: 'La Maîtrise du Temps',
    subtitle: 'Arrêter de courir. Commencer à régner.',
    quote: '« Le temps ne s\'économise pas : il s\'investit ou il s\'évapore. »',
    p1: 'Le temps est l\'unique ressource strictly inélastique. Ceux qui réussissent ne disposent pas de plus d\'heures, ils modifient la densité de l\'impact qu\'ils insufflent dans chaque bloc temporel.',
    p2: 'Apprenez à substituer la gestion de l\'agenda par la maîtrise de la bande passante mentale, et transformez vos journées en systèmes de création de valeur exponentielle.'
  },
  {
    number: '03',
    title: 'L\'Énergie Vitale',
    subtitle: 'Le carburant invisible de l\'excellence.',
    quote: '« Un esprit d\'exception dans un véhicule épuisé n\'est qu\'une intention stérile. »',
    p1: 'L\'énergie gouverne la clarté de vos jugements et la fermeté de votre présence. Sans une gestion physiologique et psychologique de haut niveau, même les meilleures stratégies s\'effondrent sous le poids de la fatigue.',
    p2: 'Ce levier livre le protocole de maintien d\'un état de haute performance durable, permettant d\'opérer sous pression sans jamais entamer votre capital vital.'
  },
  {
    number: '04',
    title: 'L\'Effet de Levier',
    subtitle: 'Construire des systèmes, pas des tâches.',
    quote: '« Donnez-moi un levier assez long et un point d\'appui, et je souleverai le monde. »',
    p1: 'Travailler dur est une étape ; construire des leviers est la vraie destination. L\'effet de levier consiste à détacher vos résultats du strict volume d\'heures travaillées grâce à la puissance des processus, des technologies et des délégations.',
    p2: 'Découvrez comment concevoir des architectures organisationnelles qui continuent de produire, de croître et de rayonner en votre absence.'
  },
  {
    number: '05',
    title: 'L\'Alignement Intérieur',
    subtitle: 'Faire sauter les verrous psychologiques.',
    quote: '« Le plus grand ennemi de la réussite se niche dans la contradiction de nos propres désirs. »',
    p1: 'Lorsque vos ambitions conscientes entrent en conflit avec vos croyances profondes, vous créez une friction interne invisible qui épuise votre élan. L\'alignement est l\'art de faire converger toutes vos forces vers une même direction.',
    p2: 'Débloquez les freins inconscients qui limitent votre potentiel et retrouvez la fluidité d\'une action totalement unifiée.'
  },
  {
    number: '06',
    title: 'La Résilience Active',
    subtitle: 'Transformer chaque choc en impulsion.',
    quote: '« L\'obstacle n\'interrompt pas la voie : il devient la voie. »',
    p1: 'L\'adversité n\'est pas une anomalie du parcours, c\'est sa matière première. La résilience active dépasse la simple résistance passive : elle consiste à utiliser l\'impact des crises pour rebondir plus haut et plus fort.',
    p2: 'Forgiez une mentalité antifragile capable d\'assimiler l\'inattendu et d\'en faire le tremplin stratégique de votre prochaine victoire.'
  },
  {
    number: '07',
    title: 'L\'Héritage & Impact',
    subtitle: 'Bâtir pour ce qui vous dépasse.',
    quote: '« La grandeur se mesure à l\'ombre des arbres sous lesquels on ne s\'assiéra jamais. »',
    p1: 'La réussite individuelle n\'atteint sa pleine plénitude que lorsqu\'elle se transforme en impact collectif et transmissible. Ce dernier levier ouvre la réflexion sur la valeur durable que vous laissez au monde.',
    p2: 'Structurez une œuvre pérenne, insufflez du sens à vos conquêtes et inscrivez votre nom dans la durée.'
  }
]

onMounted(() => {
  if (!import.meta.client || !containerRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const cards = cardRefs.value.filter(Boolean)
    if (!cards.length || !containerRef.value) return

    // Set initial GSAP positions for all cards
    cards.forEach((card, i) => {
      gsap.set(card, {
        y: i === 0 ? 0 : '100%',
        scale: i === 0 ? 1 : 0.94,
        opacity: i === 0 ? 1 : 0,
        zIndex: 10 + i
      })
    })

    // Create single declarative timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        pin: true,
        start: 'top top',
        end: () => `+=${(cards.length - 1) * window.innerHeight * 0.85}`,
        scrub: 0.6,
        anticipatePin: 1
      }
    })

    // Animate cards step-by-step
    for (let i = 1; i < cards.length; i++) {
      const prevCard = cards[i - 1]
      const currentCard = cards[i]

      // Card i enters into view & focus
      tl.to(currentCard, {
        y: '0%',
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut'
      })

      // Previous card slides up out of view
      tl.to(prevCard, {
        y: '-100%',
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power1.inOut'
      }, '<')

      // Reading pause step in timeline except after last card
      if (i < cards.length - 1) {
        tl.to({}, { duration: 0.4 })
      }
    }
  }, containerRef.value)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>
