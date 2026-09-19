<template>
  <div class="min-h-screen bg-[#120D09] text-[#F6F0E7] selection:bg-[#B08D57] selection:text-[#120D09]">
    <!-- Admin Header Navigation -->
    <header class="bg-[#1C130D] border-b border-[#B08D57]/20 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center space-x-6">
        <a href="/" class="font-serif text-xl tracking-[0.2em] text-[#F6F0E7] font-medium flex items-center gap-2">
          <span class="text-[#C7A45D]">Α</span>
          <span>+</span>
          <span class="text-[#C7A45D]">β</span>
          <span>=</span>
          <span class="text-[#C7A45D]">Ω</span>
        </a>
        <span class="hidden sm:inline-block text-xs uppercase tracking-widest text-[#C7A45D]/80 border-l border-[#B08D57]/30 pl-4">
          Administration · PostgreSQL & Redis Engine
        </span>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex items-center space-x-2 sm:space-x-4 text-xs uppercase tracking-wider font-medium">
        <NuxtLink to="/admin" class="px-4 py-2 rounded-full bg-[#C7A45D] text-[#120D09] shadow-sm font-semibold">
          Vue Principale
        </NuxtLink>
        <NuxtLink to="/admin/testimonials" class="px-4 py-2 rounded-full text-[#D4C8BE] hover:text-[#C7A45D] hover:bg-[#B08D57]/10 transition-colors">
          Témoignages Modération
        </NuxtLink>
        <button type="button" class="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 ml-4 border border-red-800/40 px-3 py-1.5 rounded-full" @click="handleLogout">
          Déconnexion
        </button>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="p-6 md:p-12 max-w-7xl mx-auto space-y-10">
      <!-- Title Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B08D57]/20 pb-6">
        <div>
          <span class="text-xs uppercase tracking-[0.3em] text-[#C7A45D] font-semibold block mb-1">
            Tableau de Bord PostgreSQL & Audit Trail
          </span>
          <h1 class="font-serif text-3xl md:text-4xl text-[#F6F0E7]">
            Statistiques & Métriques Réelles
          </h1>
        </div>
        <div class="flex items-center space-x-3">
          <NuxtLink to="/admin/testimonials" class="text-xs uppercase tracking-widest bg-[#B08D57]/20 text-[#C7A45D] border border-[#B08D57]/40 px-5 py-2.5 rounded-full hover:bg-[#C7A45D] hover:text-[#120D09] transition-all font-medium">
            Gérer la modération →
          </NuxtLink>
        </div>
      </div>

      <!-- Real KPIs Grid (NO FAKE DATA) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- KPI 1: Real Total Submissions -->
        <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-2xl p-5 text-center shadow-md">
          <span class="text-[10px] uppercase tracking-widest text-[#D4C8BE]/60 block mb-2">Témoignages Reçus</span>
          <span class="font-serif text-3xl text-[#F6F0E7] font-medium">{{ stats?.totalTestimonials || 0 }}</span>
        </div>

        <!-- KPI 2: Real Approved -->
        <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-2xl p-5 text-center shadow-md">
          <span class="text-[10px] uppercase tracking-widest text-[#D4C8BE]/60 block mb-2">Validés (APPROVED)</span>
          <span class="font-serif text-3xl text-emerald-400 font-medium">{{ stats?.approvedTestimonials || 0 }}</span>
        </div>

        <!-- KPI 3: Real Pending -->
        <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-2xl p-5 text-center shadow-md">
          <span class="text-[10px] uppercase tracking-widest text-[#D4C8BE]/60 block mb-2">En Attente (PENDING)</span>
          <span class="font-serif text-3xl text-amber-400 font-medium">{{ stats?.pendingTestimonials || 0 }}</span>
        </div>

        <!-- KPI 4: Real Rejected -->
        <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-2xl p-5 text-center shadow-md">
          <span class="text-[10px] uppercase tracking-widest text-[#D4C8BE]/60 block mb-2">Refusés (REJECTED)</span>
          <span class="font-serif text-3xl text-red-400 font-medium">{{ stats?.rejectedTestimonials || 0 }}</span>
        </div>

        <!-- KPI 5: Real Avg Rating -->
        <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-2xl p-5 text-center shadow-md">
          <span class="text-[10px] uppercase tracking-widest text-[#D4C8BE]/60 block mb-2">Note Moyenne</span>
          <span class="font-serif text-3xl text-[#C7A45D] font-medium">
            {{ stats?.avgRating !== null ? `★ ${stats.avgRating}` : '-' }}
          </span>
        </div>
      </div>

      <!-- Historical Audit Trail Table (testimonial_events) -->
      <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-3xl p-6 sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-serif text-xl text-[#F6F0E7]">Historique d'Audit (`testimonial_events`)</h3>
            <p class="text-xs text-[#D4C8BE]/60">Traçabilité complète des créations, validations, rejets et suppressions</p>
          </div>
          <span class="text-xs text-[#C7A45D] tracking-widest uppercase font-mono">PostgreSQL Audit</span>
        </div>

        <div v-if="!stats?.eventsHistory || stats.eventsHistory.length === 0" class="text-center py-10 text-[#D4C8BE]/40 text-xs italic">
          Aucun événement d'audit enregistré pour le moment.
        </div>

        <div v-else class="space-y-3 font-mono text-xs">
          <div
            v-for="evt in stats.eventsHistory"
            :key="evt.id"
            class="p-4 bg-[#120D09] rounded-xl border border-[#B08D57]/15 flex items-center justify-between text-[#D4C8BE]/80"
          >
            <div class="flex items-center space-x-4">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                :class="{
                  'bg-blue-900/40 text-blue-300 border border-blue-700/50': evt.action === 'creation',
                  'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50': evt.action === 'validation',
                  'bg-amber-900/40 text-amber-300 border border-amber-700/50': evt.action === 'rejection',
                  'bg-red-900/40 text-red-300 border border-red-700/50': evt.action === 'deletion'
                }"
              >
                {{ evt.action }}
              </span>
              <span class="text-[#F6F0E7] font-sans">Témoignage #{{ evt.testimonial_id }}</span>
              <span class="text-[#D4C8BE]/50 text-[11px]">Par : {{ evt.performed_by }}</span>
            </div>
            <span class="text-[10px] text-[#D4C8BE]/40">{{ formatDate(evt.created_at) }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Protect route check
const { data: authData } = await useFetch('/api/auth/me')
const router = useRouter()

if (!authData.value?.authenticated) {
  router.push('/admin/login')
}

const { data: statsData } = await useFetch('/api/admin/stats')
const stats = computed(() => statsData.value?.data)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  router.push('/admin/login')
}
</script>
