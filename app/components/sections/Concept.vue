<template>
  <section
    id="leviers"
    class="relative z-20 bg-[#17120E] text-[#F6F0E7] py-24 md:py-36 px-6 md:px-12 lg:px-16 border-t border-[#C7A45D]/20 overflow-hidden"
  >
    <!-- Ambient paper glow backdrop -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C7A45D]/10 via-transparent to-transparent pointer-events-none" />

    <div class="container mx-auto max-w-6xl relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 md:mb-28">
        <span class="inline-block uppercase tracking-[0.4em] text-[#C7A45D] font-medium text-xs md:text-sm mb-4">
          L'architecture du livre
        </span>
        <h2 class="font-serif text-3xl md:text-5xl lg:text-6xl text-[#F6F0E7] font-normal tracking-tight leading-tight mb-6">
          Sept leviers pour façonner votre trajectoire.
        </h2>
        <div class="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C7A45D]/60 to-transparent mx-auto mb-8" />
        <p class="text-[#D4C8BE] text-base md:text-lg font-light leading-relaxed">
          Une formule synthétise des décennies d'observations pratiques et philosophiques.
          Chaque chapitre agit comme un levier direct sur votre perception, vos décisions et votre impact.
        </p>
      </div>

      <!-- 7 Leviers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <div
          v-for="(levier, index) in leviers"
          :key="index"
          class="group relative bg-[#120D09]/80 border border-[#C7A45D]/20 hover:border-[#C7A45D]/60 p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          <div class="flex items-center justify-between mb-6">
            <span class="font-serif text-2xl text-[#C7A45D] font-medium tracking-widest">
              {{ levier.number }}
            </span>
            <div class="w-8 h-[1px] bg-[#C7A45D]/30 group-hover:w-14 group-hover:bg-[#C7A45D] transition-all duration-500" />
          </div>

          <h3 class="font-serif text-xl md:text-2xl text-[#F6F0E7] font-normal mb-3 group-hover:text-[#C7A45D] transition-colors">
            {{ levier.title }}
          </h3>

          <p class="text-[#D4C8BE]/80 text-sm font-light leading-relaxed">
            {{ levier.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const leviers = [
  {
    number: '01',
    title: 'La Vision de Clarté',
    description: 'Définir avec une précision mathématique la destination voulue sans interférence.'
  },
  {
    number: '02',
    title: 'La Maîtrise du Temps',
    description: 'Transformer chaque heure en actif résiduel durable et focalisé.'
  },
  {
    number: '03',
    title: 'L\'Énergie Vitale',
    description: 'Optimiser la force physique et mentale pour maintenir une vitesse d\'exécution haute.'
  },
  {
    number: '04',
    title: 'L\'Effet de Levier',
    description: 'Multiplier chaque effort par des systèmes automatisés et scalables.'
  },
  {
    number: '05',
    title: 'L\'Alignement Intérieur',
    description: 'Éliminer toute friction psychologique entre l\'intention et l\'action.'
  },
  {
    number: '06',
    title: 'La Résilience Active',
    description: 'Convertir les obstacles inévitables en accélérateurs stratégiques.'
  },
  {
    number: '07',
    title: 'L\'Héritage & Impact',
    description: 'Construire une œuvre qui dépasse l\'individu et résonne durablement.'
  }
]
</script>
