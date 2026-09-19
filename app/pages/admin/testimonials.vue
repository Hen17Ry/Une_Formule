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
          Administration
        </span>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex items-center space-x-2 sm:space-x-4 text-xs uppercase tracking-wider font-medium">
        <NuxtLink to="/admin" class="px-4 py-2 rounded-full text-[#D4C8BE] hover:text-[#C7A45D] hover:bg-[#B08D57]/10 transition-colors">
          Vue Principale
        </NuxtLink>
        <NuxtLink to="/admin/testimonials" class="px-4 py-2 rounded-full bg-[#C7A45D] text-[#120D09] shadow-sm font-semibold">
          Témoignages Modération
        </NuxtLink>
        <button type="button" class="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 ml-4 border border-red-800/40 px-3 py-1.5 rounded-full" @click="handleLogout">
          Déconnexion
        </button>
      </nav>
    </header>

    <!-- Main Section -->
    <main class="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <!-- Title Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B08D57]/20 pb-6">
        <div>
          <span class="text-xs uppercase tracking-[0.3em] text-[#C7A45D] font-semibold block mb-1">
            Modération & Publication
          </span>
          <h1 class="font-serif text-3xl md:text-4xl text-[#F6F0E7]">
            Témoignages Réels Soumis
          </h1>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-[#C7A45D] font-semibold mb-1">Rechercher</label>
          <input
            v-model="filterSearch"
            type="text"
            placeholder="Mot-clé, prénom..."
            class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7] focus:outline-none focus:border-[#C7A45D]"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-[#C7A45D] font-semibold mb-1">Statut</label>
          <select
            v-model="filterStatus"
            class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7] focus:outline-none focus:border-[#C7A45D]"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente (PENDING)</option>
            <option value="APPROVED">Approuvés (APPROVED)</option>
            <option value="REJECTED">Refusés (REJECTED)</option>
          </select>
        </div>

        <!-- Lever Filter -->
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-[#C7A45D] font-semibold mb-1">Levier</label>
          <select
            v-model="filterLever"
            class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7] focus:outline-none focus:border-[#C7A45D]"
          >
            <option value="ALL">Tous les leviers</option>
            <option v-for="l in 7" :key="l" :value="l">Levier 0{{ l }}</option>
          </select>
        </div>

        <!-- Rating Filter -->
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-[#C7A45D] font-semibold mb-1">Note</label>
          <select
            v-model="filterRating"
            class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7] focus:outline-none focus:border-[#C7A45D]"
          >
            <option value="ALL">Toutes les notes</option>
            <option v-for="r in 5" :key="r" :value="r">{{ r }} ★</option>
          </select>
        </div>
      </div>

      <!-- Testimonials Table / List -->
      <div class="bg-[#1C130D] border border-[#B08D57]/25 rounded-3xl overflow-hidden shadow-xl">
        <div v-if="pending" class="p-12 text-center text-[#D4C8BE]/60 font-serif italic">
          Consultation de la base de données...
        </div>

        <div v-else-if="filteredList.length === 0" class="p-12 text-center text-[#D4C8BE]/60">
          <span class="font-serif text-2xl text-[#C7A45D] block mb-2">Pas encore de témoignages</span>
          <p class="text-xs">Les soumissions de lecteurs apparaîtront ici pour modération.</p>
        </div>

        <div v-else class="divide-y divide-[#B08D57]/15">
          <div
            v-for="t in filteredList"
            :key="t.id"
            class="p-6 transition-colors hover:bg-[#120D09]/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <!-- Left Info -->
            <div class="space-y-2 flex-1">
              <div class="flex items-center space-x-3 text-xs">
                <!-- Status Badge -->
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-semibold"
                  :class="{
                    'bg-amber-900/40 text-amber-300 border border-amber-700/50': t.status === 'PENDING',
                    'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50': t.status === 'APPROVED',
                    'bg-red-900/40 text-red-300 border border-red-700/50': t.status === 'REJECTED'
                  }"
                >
                  {{ t.status === 'APPROVED' ? 'Approuvé' : t.status === 'PENDING' ? 'En attente' : 'Refusé' }}
                </span>

                <span v-if="t.lever_number" class="text-[#C7A45D] font-mono font-medium">Levier 0{{ t.lever_number }}</span>
                <span class="text-amber-400 font-serif">{{ t.rating }} ★</span>
                <span class="text-[#D4C8BE]/40 font-mono text-[10px]">{{ formatDate(t.created_at) }}</span>
              </div>

              <!-- Author & Content -->
              <div>
                <h4 class="font-serif text-lg text-[#F6F0E7] font-normal">
                  {{ t.publication_name || t.first_name }}
                  <span v-if="t.email" class="text-xs font-mono font-normal text-[#D4C8BE]/40 ml-2">({{ t.email }})</span>
                </h4>
                <p class="text-sm text-[#D4C8BE]/90 font-light italic mt-1 leading-relaxed">
                  « {{ t.content }} »
                </p>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="flex items-center space-x-2 shrink-0">
              <button
                v-if="t.status !== 'APPROVED'"
                type="button"
                class="text-xs uppercase tracking-wider bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 px-3.5 py-1.5 rounded-full transition-colors"
                @click="updateStatus(t.id, 'APPROVED')"
              >
                Approuver
              </button>

              <button
                v-if="t.status !== 'REJECTED'"
                type="button"
                class="text-xs uppercase tracking-wider bg-amber-900/30 hover:bg-amber-800/50 text-amber-300 border border-amber-700/40 px-3.5 py-1.5 rounded-full transition-colors"
                @click="updateStatus(t.id, 'REJECTED')"
              >
                Refuser
              </button>

              <button
                type="button"
                class="text-xs uppercase tracking-wider bg-[#B08D57]/20 hover:bg-[#B08D57]/40 text-[#C7A45D] border border-[#B08D57]/40 px-3.5 py-1.5 rounded-full transition-colors"
                @click="openEditModal(t)"
              >
                Modifier
              </button>

              <button
                type="button"
                class="text-xs uppercase tracking-wider bg-red-900/30 hover:bg-red-800/50 text-red-300 border border-red-800/40 px-3 py-1.5 rounded-full transition-colors"
                @click="deleteTestimonial(t.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Testimonial Modal -->
    <Transition name="modal-fade">
      <div v-if="editingTestimonial" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" @click.self="editingTestimonial = null">
        <div class="bg-[#1C130D] border border-[#B08D57]/40 text-[#F6F0E7] p-8 rounded-3xl max-w-lg w-full relative shadow-2xl space-y-4">
          <button type="button" class="absolute top-4 right-4 text-[#D4C8BE] hover:text-[#C7A45D]" @click="editingTestimonial = null">✕</button>
          <h3 class="font-serif text-2xl text-[#C7A45D]">Modifier le Témoignage</h3>

          <div>
            <label class="block text-xs uppercase text-[#C7A45D] font-medium mb-1">Prénom ou Nom Publié</label>
            <input v-model="editForm.publication_name" type="text" class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7]">
          </div>

          <div>
            <label class="block text-xs uppercase text-[#C7A45D] font-medium mb-1">Levier Concerné</label>
            <select v-model="editForm.lever_number" class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7]">
              <option :value="null">Général (Aucun)</option>
              <option v-for="l in 7" :key="l" :value="l">Levier 0{{ l }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs uppercase text-[#C7A45D] font-medium mb-1">Statut</label>
            <select v-model="editForm.status" class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7]">
              <option value="PENDING">PENDING (En attente)</option>
              <option value="APPROVED">APPROVED (Approuvé)</option>
              <option value="REJECTED">REJECTED (Refusé)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs uppercase text-[#C7A45D] font-medium mb-1">Note (1-5)</label>
            <select v-model="editForm.rating" class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl px-3.5 py-2 text-xs text-[#F6F0E7]">
              <option v-for="r in 5" :key="r" :value="r">{{ r }} ★</option>
            </select>
          </div>

          <div>
            <label class="block text-xs uppercase text-[#C7A45D] font-medium mb-1">Contenu de la Citation</label>
            <textarea v-model="editForm.content" rows="4" class="w-full bg-[#120D09] border border-[#B08D57]/30 rounded-xl p-3 text-xs text-[#F6F0E7]"></textarea>
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" class="text-xs uppercase tracking-widest text-[#D4C8BE] hover:text-[#F6F0E7]" @click="editingTestimonial = null">
              Annuler
            </button>
            <button type="button" class="text-xs uppercase tracking-widest bg-[#C7A45D] text-[#120D09] font-semibold px-6 py-2.5 rounded-full hover:bg-[#F6F0E7] transition-colors" @click="saveEdit">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const router = useRouter()
const { data: authData } = await useFetch('/api/auth/me')
if (!authData.value?.authenticated) {
  router.push('/admin/login')
}

const filterSearch = ref('')
const filterStatus = ref('ALL')
const filterLever = ref<string | number>('ALL')
const filterRating = ref<string | number>('ALL')

const { data: responseData, pending, refresh } = await useFetch('/api/admin/testimonials')
const testimonials = computed(() => responseData.value?.data || [])

const filteredList = computed(() => {
  return testimonials.value.filter((t: any) => {
    if (filterStatus.value !== 'ALL' && t.status !== filterStatus.value) return false
    if (filterLever.value !== 'ALL' && t.lever_number !== Number(filterLever.value)) return false
    if (filterRating.value !== 'ALL' && t.rating !== Number(filterRating.value)) return false
    if (filterSearch.value) {
      const q = filterSearch.value.toLowerCase()
      const matchName = (t.publication_name || t.first_name || '').toLowerCase().includes(q)
      const matchContent = (t.content || '').toLowerCase().includes(q)
      if (!matchName && !matchContent) return false
    }
    return true
  })
})

const updateStatus = async (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
  await $fetch(`/api/admin/testimonials/${id}`, {
    method: 'PATCH',
    body: { status }
  })
  refresh()
}

const deleteTestimonial = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce témoignage ?')) {
    await $fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE'
    })
    refresh()
  }
}

// Edit Modal State
const editingTestimonial = ref<any>(null)
const editForm = reactive({
  id: 0,
  publication_name: '',
  content: '',
  rating: 5,
  status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
  lever_number: null as number | null
})

const openEditModal = (t: any) => {
  editingTestimonial.value = t
  editForm.id = t.id
  editForm.publication_name = t.publication_name || t.first_name
  editForm.content = t.content
  editForm.rating = t.rating
  editForm.status = t.status
  editForm.lever_number = t.lever_number
}

const saveEdit = async () => {
  if (!editForm.id) return
  await $fetch(`/api/admin/testimonials/${editForm.id}`, {
    method: 'PATCH',
    body: {
      publication_name: editForm.publication_name,
      content: editForm.content,
      rating: editForm.rating,
      status: editForm.status,
      lever_number: editForm.lever_number
    }
  })
  editingTestimonial.value = null
  refresh()
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  router.push('/admin/login')
}
</script>
