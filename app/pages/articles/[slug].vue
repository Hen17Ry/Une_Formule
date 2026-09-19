<template>
  <div class="min-h-screen bg-[#F8F4EE] text-[#3A2115] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#3A2115]">
    <Navbar />

    <main v-if="article" class="pt-28 pb-20">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <nav class="text-xs uppercase tracking-widest text-[#B08D57] flex items-center gap-2">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <span>/</span>
          <NuxtLink to="/articles" class="hover:underline">Articles</NuxtLink>
          <span>/</span>
          <span class="text-[#3A2115]/60">{{ article.category }}</span>
        </nav>
      </div>

      <!-- Header -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <div class="max-w-4xl space-y-4">
          <div class="flex items-center gap-4 text-xs text-[#5A4234]">
            <span class="uppercase tracking-[0.3em] text-[#B08D57] font-semibold">{{ article.category }}</span>
            <span>·</span>
            <span>{{ article.readTime }} de lecture</span>
            <span>·</span>
            <span>{{ article.date }}</span>
          </div>

          <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3A2115] font-normal leading-tight">
            {{ article.title }}
          </h1>

          <p class="font-serif italic text-lg md:text-xl text-[#B08D57] font-light leading-relaxed">
            « {{ article.excerpt }} »
          </p>
        </div>
      </section>

      <!-- Article Body -->
      <section class="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article class="lg:col-span-8 bg-[#FFFDF9] border border-[#B08D57]/30 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
            <p v-for="(p, idx) in article.content" :key="idx" class="text-[#5A4234] text-base md:text-lg font-light leading-relaxed">
              {{ p }}
            </p>

            <div class="mt-8 pt-6 border-t border-[#B08D57]/20 flex items-center justify-between">
              <span class="text-xs text-[#5A4234]">Auteur : <strong>Dieudonné Sossa GOSSOU</strong></span>
              <NuxtLink to="/articles" class="text-xs uppercase tracking-widest text-[#B08D57] font-semibold">
                ← Tous les articles
              </NuxtLink>
            </div>
          </article>

          <!-- Book Sidebar CTA -->
          <div class="lg:col-span-4">
            <div class="bg-[#120D09] text-[#F6F0E7] border border-[#B08D57]/40 rounded-3xl p-8 space-y-6 sticky top-28">
              <span class="text-xs uppercase tracking-[0.3em] text-[#C7A45D] font-semibold block">Pour aller plus loin</span>
              <h3 class="font-serif text-2xl text-[#F6F0E7]">Le Livre Une Formule</h3>
              <p class="text-xs md:text-sm text-[#D4C8BE]/80 font-light leading-relaxed">
                Retrouvez l'intégralité des 7 leviers et des protocoles d'action dans l'ouvrage officiel.
              </p>
              <NuxtLink
                to="/commander"
                class="block w-full text-center text-xs uppercase tracking-[0.25em] font-medium text-[#120D09] bg-[#C7A45D] hover:bg-[#F6F0E7] transition-all rounded-full py-3.5 shadow-md"
              >
                Commander le Livre
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 404 Fallback -->
    <div v-else class="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
      <div class="text-center space-y-4">
        <h1 class="font-serif text-4xl text-[#3A2115]">Article non trouvé</h1>
        <NuxtLink to="/articles" class="inline-block text-xs uppercase tracking-widest bg-[#B08D57] text-[#F8F4ED] px-6 py-3 rounded-full">
          Retour aux articles
        </NuxtLink>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import Navbar from '~/components/navigation/Navbar.vue'
import Footer from '~/components/navigation/Footer.vue'
import { useArticles } from '~/composables/useArticles'
import { useSeo } from '~/composables/useSeo'
import { useJsonLd } from '~/composables/useJsonLd'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getArticleBySlug } = useArticles()
const { injectBreadcrumbSchema } = useJsonLd()

const article = computed(() => getArticleBySlug(slug.value))

if (article.value) {
  useSeo({
    title: article.value.metaTitle,
    description: article.value.metaDescription,
    path: `/articles/${article.value.slug}`,
    keywords: article.value.keywords,
    ogType: 'article'
  })

  injectBreadcrumbSchema([
    { name: 'Accueil', item: '/' },
    { name: 'Articles', item: '/articles' },
    { name: article.value.title, item: `/articles/${article.value.slug}` }
  ])
}
</script>
