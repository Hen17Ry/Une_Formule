<script setup lang="ts">
import { Save, Plus, Trash2, ExternalLink, ArrowUp, ArrowDown } from '@lucide/vue'
import type { SourceEntry, SourceStatus } from '#shared/types'
import { LEVERS } from '~/data/book'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { push } = useToasts()

const list = ref<SourceEntry[] | null>(null)
const saving = ref(false)
const dirty = ref(false)

onMounted(async () => {
  list.value = (await adminFetch<{ sources: SourceEntry[] }>('/api/admin/sources')).sources
  watch(list, () => { dirty.value = true }, { deep: true })
})

const groups = computed(() => [
  { lever: null as number | null, title: 'Le livre entier' },
  ...LEVERS.map(l => ({ lever: l.n as number | null, title: `Levier ${l.n} · ${l.title}` }))
])
const inGroup = (lever: number | null) => (list.value ?? []).filter(s => s.lever === lever)
const counts = computed(() => {
  const all = list.value ?? []
  return { total: all.length, consultee: all.filter(s => s.status === 'consultee').length, connue: all.filter(s => s.status === 'connue').length, todo: all.filter(s => !s.status || !s.url).length }
})

function add(lever: number | null) {
  list.value?.push({ id: '', lever, name: '', reference: '', claim: '', url: '', status: '' })
}
function remove(s: SourceEntry) {
  if (!list.value) return
  list.value.splice(list.value.indexOf(s), 1)
}
function move(s: SourceEntry, dir: -1 | 1) {
  if (!list.value) return
  const same = inGroup(s.lever)
  const other = same[same.indexOf(s) + dir]
  if (!other) return
  const a = list.value.indexOf(s), b = list.value.indexOf(other)
  list.value[a] = other
  list.value[b] = s
}

async function save() {
  if (!list.value) return
  saving.value = true
  try {
    list.value = (await adminFetch<{ sources: SourceEntry[] }>('/api/admin/sources', { method: 'PUT', body: { sources: list.value } })).sources
    await nextTick()
    dirty.value = false
    push('Sources enregistrées.')
  } catch (e: any) { push(e?.data?.statusMessage || 'Enregistrement impossible.', 'error') }
  finally { saving.value = false }
}

const statuses: { value: SourceStatus, label: string }[] = [
  { value: '', label: 'À préciser' },
  { value: 'consultee', label: 'Consultée' },
  { value: 'connue', label: 'Non consultée, largement connue' }
]
const inputCls = 'h-11 w-full rounded-xl border border-line bg-paper/60 px-3.5 text-[0.95rem] focus:border-caramel focus:outline-none focus:ring-4 focus:ring-caramel/15'
</script>

<template>
  <div>
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label">Contenu</p>
        <h1 class="mt-2 font-display text-[2.6rem] leading-tight">Sources</h1>
        <p class="mt-2 max-w-2xl text-sm text-ink-muted">Page publique « À propos des sources » (/sources) : une ligne par source, avec ce que dit le livre, le lien officiel et le statut. Le statut n’est affiché qu’une fois précisé.</p>
      </div>
      <a href="/sources" target="_blank" class="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm hover:border-caramel">Voir la page <ExternalLink class="h-4 w-4" aria-hidden="true" /></a>
    </header>

    <div v-if="!list" class="mt-10 h-96 animate-pulse rounded-[24px] bg-white/70" />
    <form v-else class="mt-8 space-y-6 pb-24" @submit.prevent="save">
      <p class="flex flex-wrap gap-2 text-sm">
        <span class="rounded-full bg-white px-3 py-1 shadow-soft">{{ counts.total }} sources</span>
        <span class="rounded-full bg-ok/10 px-3 py-1 text-ok">{{ counts.consultee }} consultées</span>
        <span class="rounded-full bg-gold/15 px-3 py-1 text-ink-soft">{{ counts.connue }} largement connues</span>
        <span v-if="counts.todo" class="rounded-full bg-danger/10 px-3 py-1 text-danger">{{ counts.todo }} à compléter (lien ou statut)</span>
      </p>

      <section v-for="g in groups" :key="String(g.lever)" class="rounded-[24px] border border-line bg-white p-5 shadow-soft md:p-7">
        <div class="flex items-center justify-between gap-3">
          <h2 class="font-display text-2xl">{{ g.title }}</h2>
          <button type="button" class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm hover:border-caramel" @click="add(g.lever)"><Plus class="h-4 w-4" aria-hidden="true" />Ajouter</button>
        </div>
        <p v-if="!inGroup(g.lever).length" class="mt-3 text-sm text-ink-muted">Aucune source.</p>
        <ul class="mt-4 space-y-4">
          <li v-for="(src, i) in inGroup(g.lever)" :key="src.id || `new-${i}`" class="rounded-2xl border border-line bg-paper/40 p-4">
            <div class="grid gap-3 md:grid-cols-2">
              <label class="block"><span class="mb-1.5 block text-xs font-medium">Nom</span><input v-model="src.name" required maxlength="160" placeholder="Effet Pygmalion — Rosenthal" :class="inputCls"></label>
              <label class="block"><span class="mb-1.5 block text-xs font-medium">Référence</span><input v-model="src.reference" maxlength="400" placeholder="Auteurs (année). Titre. Revue." :class="inputCls"></label>
              <label class="block md:col-span-2"><span class="mb-1.5 block text-xs font-medium">Ce que dit le livre</span><textarea v-model="src.claim" rows="2" maxlength="600" :class="[inputCls, 'h-auto py-2.5']" /></label>
              <label class="block"><span class="mb-1.5 block text-xs font-medium">Lien officiel</span><input v-model="src.url" type="url" maxlength="500" placeholder="https://doi.org/…" :class="inputCls"></label>
              <div class="grid grid-cols-[1fr_auto] items-end gap-2">
                <label class="block"><span class="mb-1.5 block text-xs font-medium">Statut</span>
                  <select v-model="src.status" :class="inputCls">
                    <option v-for="o in statuses" :key="o.value" :value="o.value">{{ o.label }}</option>
                  </select>
                </label>
                <label class="block"><span class="mb-1.5 block text-xs font-medium">Levier</span>
                  <select v-model="src.lever" :class="[inputCls, 'w-24']">
                    <option :value="null">Livre</option>
                    <option v-for="l in LEVERS" :key="l.n" :value="l.n">{{ l.n }}</option>
                  </select>
                </label>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-end gap-1 text-ink-muted">
              <a v-if="src.url" :href="src.url" target="_blank" rel="noopener" class="grid h-9 w-9 place-items-center rounded-full hover:bg-paper-2 hover:text-ink" aria-label="Ouvrir le lien"><ExternalLink class="h-4 w-4" aria-hidden="true" /></a>
              <button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-paper-2 hover:text-ink disabled:opacity-30" :disabled="i === 0" aria-label="Monter" @click="move(src, -1)"><ArrowUp class="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-paper-2 hover:text-ink disabled:opacity-30" :disabled="i === inGroup(g.lever).length - 1" aria-label="Descendre" @click="move(src, 1)"><ArrowDown class="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-danger/10 hover:text-danger" aria-label="Supprimer cette source" @click="remove(src)"><Trash2 class="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </li>
        </ul>
      </section>

      <div class="sticky bottom-4 z-10 flex justify-end">
        <UiButton type="submit" :loading="saving" :icon-left="Save" :class="!dirty && 'opacity-80'">Enregistrer</UiButton>
      </div>
    </form>
  </div>
</template>
