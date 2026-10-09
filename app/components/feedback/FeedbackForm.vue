<script setup lang="ts">
import { Send, Check, ArrowLeft, ArrowRight } from '@lucide/vue'
import type { Consent, Practiced } from '#shared/types'
import {
  type Lever, CONSENT_OPTIONS, PRACTICED_OPTIONS, LEVER_TEXT_QUESTIONS, LEVER_DIFFICULT_QUESTION,
  GENERAL_TEXT_QUESTIONS, RATING_LABELS, LEVERS
} from '~/data/book'

const props = defineProps<{ lever?: Lever | null }>()
const isLever = computed(() => !!props.lever)
const storageKey = computed(() => `uf-draft-${props.lever?.slug ?? 'general'}`)

const form = reactive({
  practiced: null as Practiced | null,
  answers: {} as Record<string, string>,
  rating: 0,
  consent: null as Consent | null,
  firstName: '',
  email: '',
  website: ''
})
const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'sent'>('idle')
const serverError = ref('')
const draftSaved = ref(false)

const textQuestions = computed(() => isLever.value ? [...LEVER_TEXT_QUESTIONS, LEVER_DIFFICULT_QUESTION] : GENERAL_TEXT_QUESTIONS)
const steps = computed(() => isLever.value
  ? ['Votre pratique', 'Votre ressenti', 'Votre note', 'Publication']
  : ['Votre lecture', 'Votre note', 'Publication'])

/* Brouillon local (confort : rien n’est perdu si l’onglet se ferme) */
onMounted(() => {
  try {
    const raw = localStorage.getItem(storageKey.value)
    if (raw) Object.assign(form, JSON.parse(raw), { website: '' })
  } catch {}
})
let saveTimer: ReturnType<typeof setTimeout> | undefined
watch(form, () => {
  if (status.value === 'sent') return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify({ ...form, email: form.email }))
      draftSaved.value = true
      setTimeout(() => (draftSaved.value = false), 1600)
    } catch {}
  }, 700)
}, { deep: true })

const showFirstName = computed(() => form.consent === 'FIRST_NAME' || form.consent === 'ANONYMOUS')

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.rating) errors.rating = 'Choisissez une note de 1 à 5.'
  if (!form.consent) errors.consent = 'Indiquez si votre témoignage peut être cité.'
  if (form.consent === 'FIRST_NAME' && !form.firstName.trim()) errors.firstName = 'Indiquez le prénom qui accompagnera votre témoignage.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Cette adresse email semble incomplète.'
  return Object.keys(errors).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) {
    await nextTick()
    const first = document.querySelector<HTMLElement>('[data-error="true"]')
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    first?.querySelector<HTMLElement>('input, textarea')?.focus({ preventScroll: true })
    return
  }
  status.value = 'sending'
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: {
        kind: isLever.value ? 'LEVER' : 'GENERAL',
        lever: props.lever?.n ?? null,
        practiced: form.practiced,
        rating: form.rating,
        consent: form.consent,
        firstName: showFirstName.value ? form.firstName.trim() : '',
        email: form.email.trim(),
        answers: form.answers,
        website: form.website
      }
    })
    status.value = 'sent'
    try { localStorage.removeItem(storageKey.value) } catch {}
    await nextTick()
    document.getElementById('merci')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } catch (e: any) {
    status.value = 'idle'
    serverError.value = e?.data?.statusMessage || e?.statusMessage || 'L’envoi a échoué. Vérifiez votre connexion et réessayez.'
  }
}

const otherLevers = computed(() => LEVERS.filter(l => l.n !== props.lever?.n).slice(0, 3))
</script>

<template>
  <div>
    <Transition mode="out-in" enter-active-class="transition duration-700 ease-expo" enter-from-class="opacity-0 translate-y-6" leave-active-class="transition duration-300" leave-to-class="opacity-0">
      <!-- Merci -->
      <div v-if="status === 'sent'" id="merci" key="sent" class="surface mx-auto max-w-2xl px-8 py-16 text-center md:px-14" role="status">
        <div class="mx-auto grid h-20 w-20 place-items-center rounded-full text-[#FFFDF9] [background:var(--cover-soft)]">
          <svg viewBox="0 0 24 24" class="h-9 w-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" class="[stroke-dasharray:24] [stroke-dashoffset:24] [animation:draw_.9s_.25s_var(--ease-out)_forwards]" /></svg>
        </div>
        <h2 class="mt-8 font-display text-display-sm">Merci, votre retour est bien arrivé.</h2>
        <p class="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ink-soft">
          Il sera lu avec attention avant toute publication{{ form.consent === 'NO' ? '. Vous avez choisi qu’il ne soit pas cité : il restera privé.' : '.' }}
        </p>
        <div class="mt-10">
          <p class="label">Continuer sur un autre levier</p>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <NuxtLink v-for="l in otherLevers" :key="l.n" :to="`/retours/${l.slug}`" class="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white/70 px-4 text-sm text-ink-soft transition-colors hover:border-caramel hover:text-ink">
              <span class="h-2 w-2 rounded-full" :style="{ background: l.color }" aria-hidden="true" />{{ l.short }}
            </NuxtLink>
            <NuxtLink v-if="lever" to="/retours/general" class="inline-flex min-h-[44px] items-center rounded-full border border-line bg-white/70 px-4 text-sm text-ink-soft transition-colors hover:border-caramel hover:text-ink">Retour général</NuxtLink>
          </div>
        </div>
        <div class="mt-10 flex justify-center gap-3">
          <UiButton to="/" variant="outline" :icon-left="ArrowLeft">Accueil</UiButton>
          <UiButton to="/avis" :icon="ArrowRight">Lire les avis</UiButton>
        </div>
      </div>

      <!-- Formulaire -->
      <form v-else key="form" class="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16" novalidate @submit.prevent="submit">
        <aside class="hidden lg:block" aria-hidden="true">
          <ol class="sticky top-32 space-y-5 border-l border-line pl-6">
            <li v-for="(s, i) in steps" :key="s" class="relative font-sans text-sm text-ink-muted">
              <span class="absolute -left-[1.86rem] top-0.5 grid h-3 w-3 place-items-center rounded-full border border-line-strong bg-paper" />
              <span class="block text-[0.68rem] uppercase tracking-[0.24em]">Étape {{ i + 1 }}</span>
              <span class="text-ink">{{ s }}</span>
            </li>
          </ol>
        </aside>

        <div class="space-y-6">
          <!-- pot de miel -->
          <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>Site web <input v-model="form.website" type="text" tabindex="-1" autocomplete="off"></label>
          </div>

          <!-- Étape : pratique (leviers) -->
          <fieldset v-if="isLever" class="surface p-7 md:p-10">
            <legend class="sr-only">Votre pratique</legend>
            <p class="label-gold">Étape 1 · Votre pratique</p>
            <p class="mt-4 font-display text-[1.6rem] leading-snug text-ink">Avez-vous pratiqué les exercices du levier « {{ lever!.short }} » ?</p>
            <div class="mt-6">
              <UiSegmented v-model="form.practiced" :options="PRACTICED_OPTIONS" name="practiced" />
            </div>
            <p class="mt-3 font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">Facultatif</p>
          </fieldset>

          <!-- Étape : ressenti -->
          <fieldset class="surface space-y-8 p-7 md:p-10">
            <legend class="sr-only">{{ isLever ? 'Votre ressenti' : 'Votre lecture' }}</legend>
            <p class="label-gold">Étape {{ isLever ? 2 : 1 }} · {{ isLever ? 'Votre ressenti' : 'Votre lecture' }}</p>
            <UiField
              v-for="q in textQuestions"
              :key="q.key"
              :model-value="form.answers[q.key] ?? ''"
              :label="q.label"
              textarea
              :rows="3"
              optional
              :max="4000"
              @update:model-value="(v: string) => (form.answers[q.key] = v)"
            />
          </fieldset>

          <!-- Étape : note -->
          <fieldset class="surface p-7 md:p-10" :data-error="!!errors.rating">
            <legend class="sr-only">Votre note</legend>
            <p class="label-gold">Étape {{ isLever ? 3 : 2 }} · Votre note</p>
            <p class="mt-4 font-display text-[1.6rem] leading-snug text-ink">
              {{ isLever ? 'Quelle note attribuez-vous à l’utilité de ce levier pour vous ?' : 'Note globale du livre' }}<span class="text-copper" aria-hidden="true"> *</span>
            </p>
            <div class="mt-5">
              <UiRating v-model="form.rating" :labels="RATING_LABELS" name="rating" :invalid="!!errors.rating" />
            </div>
            <p v-if="errors.rating" class="font-sans text-sm text-danger" role="alert">{{ errors.rating }}</p>
          </fieldset>

          <!-- Étape : publication -->
          <fieldset class="surface space-y-8 p-7 md:p-10">
            <legend class="sr-only">Publication</legend>
            <p class="label-gold">Étape {{ isLever ? 4 : 3 }} · Publication</p>
            <div :data-error="!!errors.consent">
              <p class="font-display text-[1.6rem] leading-snug text-ink">Acceptez-vous que votre témoignage soit cité, dans une future édition ou sur le site ?<span class="text-copper" aria-hidden="true"> *</span></p>
              <div class="mt-5">
                <UiSegmented v-model="form.consent" :options="CONSENT_OPTIONS" name="consent" :invalid="!!errors.consent" />
              </div>
              <p v-if="errors.consent" class="mt-3 font-sans text-sm text-danger" role="alert">{{ errors.consent }}</p>
            </div>

            <Transition enter-active-class="transition-all duration-500 ease-expo" enter-from-class="opacity-0 -translate-y-2" leave-active-class="transition duration-200" leave-to-class="opacity-0">
              <div v-if="showFirstName" :data-error="!!errors.firstName">
                <UiField
                  v-model="form.firstName"
                  label="Si oui, votre prénom"
                  autocomplete="given-name"
                  :max="80"
                  :required="form.consent === 'FIRST_NAME'"
                  :optional="form.consent === 'ANONYMOUS'"
                  :hint="form.consent === 'ANONYMOUS' ? 'Vous avez choisi l’anonymat : votre prénom ne sera jamais affiché.' : 'Il apparaîtra sous votre témoignage.'"
                  :error="errors.firstName"
                />
              </div>
            </Transition>

            <div :data-error="!!errors.email">
              <UiField
                v-model="form.email"
                label="Adresse email"
                type="email"
                inputmode="email"
                autocomplete="email"
                optional
                :max="255"
                hint="Pour vous recontacter si besoin. Jamais publiée."
                :error="errors.email"
              />
            </div>
          </fieldset>

          <div class="flex flex-col-reverse items-start justify-between gap-5 pt-2 sm:flex-row sm:items-center">
            <p class="font-sans text-sm text-ink-muted" aria-live="polite">
              <span v-if="draftSaved" class="inline-flex items-center gap-1.5"><Check class="h-4 w-4 text-ok" aria-hidden="true" /> Brouillon enregistré sur cet appareil</span>
              <span v-else>Les champs marqués <span class="text-copper">*</span> sont requis.</span>
            </p>
            <UiButton type="submit" size="lg" :loading="status === 'sending'" :icon="Send">Envoyer mon retour</UiButton>
          </div>
          <p v-if="serverError" class="rounded-2xl border border-danger/30 bg-danger/5 px-5 py-4 font-sans text-sm text-danger" role="alert">{{ serverError }}</p>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style>
@keyframes draw { to { stroke-dashoffset: 0; } }
</style>
