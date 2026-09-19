import { useHead, useRuntimeConfig } from '#imports'

export function useJsonLd() {
  const config = useRuntimeConfig()
  const baseUrl = (config.public?.siteUrl as string) || 'https://uneformule.com'

  const injectBookSchema = () => {
    const bookSchema = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: 'Une Formule : α + β = Ω',
      alternateName: 'Une Formule',
      author: {
        '@type': 'Person',
        name: 'Dieudonné Sossa GOSSOU',
        jobTitle: 'Auteur & Consultant en Performance Humaine',
        url: `${baseUrl}/auteur`
      },
      url: `${baseUrl}/le-livre`,
      image: `${baseUrl}/cover-book.jpg`,
      description: 'Un ouvrage d\'exception conçu comme un véritable outil de transformation personnelle, d\'élévation stratégique et de maîtrise des 7 leviers de l\'accomplissement.',
      inLanguage: 'fr',
      isbn: '978-2-9588000-0-1',
      bookFormat: 'https://schema.org/Hardcover',
      publisher: {
        '@type': 'Organization',
        name: 'Une Formule Éditions',
        url: baseUrl
      },
      offers: {
        '@type': 'Offer',
        price: '39.00',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${baseUrl}/commander`
      }
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(bookSchema)
        }
      ]
    })
  }

  const injectPersonSchema = () => {
    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Dieudonné Sossa GOSSOU',
      jobTitle: 'Auteur, Strategic Leadership & Human Performance Consultant',
      worksFor: {
        '@type': 'Organization',
        name: 'Une Formule Éditions'
      },
      description: 'Auteur du livre Une Formule (α + β = Ω), conférencier et expert en alignement stratégique, discipline et transformation personnelle.',
      url: `${baseUrl}/auteur`,
      image: `${baseUrl}/auteur-dieudonne-sossa-gossou.jpg`,
      sameAs: [
        'https://linkedin.com',
        'https://twitter.com'
      ]
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(personSchema)
        }
      ]
    })
  }

  const injectFaqSchema = (faqs: Array<{ question: string; answer: string }>) => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(faqSchema)
        }
      ]
    })
  }

  const injectBreadcrumbSchema = (breadcrumbs: Array<{ name: string; item: string }>) => {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.item.startsWith('http') ? b.item : `${baseUrl}${b.item}`
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema)
        }
      ]
    })
  }

  return {
    injectBookSchema,
    injectPersonSchema,
    injectFaqSchema,
    injectBreadcrumbSchema
  }
}
