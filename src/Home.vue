<template>
  <header class="bg-slate-900 text-white py-4 text-center">
    <router-link to="/" class="flex justify-center items-center">
      <img src="/img/logo-seo-20.webp" alt="Logo SEO20" width="256" height="82" class="mx-auto" loading="lazy" />
    </router-link>
  </header>
  <nav class="sr-only" aria-label="Navegación principal">
    <ul>
      <li v-for="route in navRoutes" :key="route.path">
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
  </nav>

  <main>
    <HomeHero />
    <HomeAdvantages />
    <HomeCoverage />
    <HomeExperience />
    <HomeBusiness />
    <HomeFAQ />
    <HomeCTA />
  </main>

  <footer class="bg-gray-100 text-center text-sm text-gray-600 min-h-[160px] h-[160px] flex flex-col justify-center">
    <p>&copy; 2025 SEO10.dev — Todos los derechos reservados.</p>
    <nav class="mt-2 space-x-4">
      <router-link to="/politica-privacidad" class="hover:text-emerald-600">Política de Privacidad</router-link>
      <router-link to="/terminos-servicio" class="hover:text-emerald-600">Términos de Servicio</router-link>
    </nav>
    <p class="mt-2">Contacto: <a href="mailto:hola@seo10.dev" class="text-emerald-600 hover:underline">hola@seo10.dev</a></p>
  </footer>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const router = useRouter()
const navRoutes = router.options.routes.filter(
  r => !r.path.includes(':') && r.name && !['NotFound'].includes(r.name)
)

// Define la URL base de tu sitio para las imágenes y URLs canónicas
// ¡Asegúrate de que esta sea la URL correcta en producción!
const baseUrl = 'https://seo10.dev';
const canonicalUrl = `${baseUrl}/`; // Asume que esta es la URL de esta página

useHead({
  // Título optimizado para SEO y atractivo para el usuario
  title: 'Informe SEO de tu Home por $20 USD | SEO10.dev',

  // Meta tags esenciales para SEO y redes sociales
  meta: [
    { name: 'robots', content: 'index,follow' },
    { name: 'description', content: 'Recibe en 24 h un análisis SEO técnico de tu página principal con velocidad, Core Web Vitals y metadatos. Informe PDF claro y accionable por solo $10 USD.' },
    // Keywords tiene bajo impacto en Google, pero puede servir para otros motores o contexto interno
    { name: 'keywords', content: 'auditoría SEO, análisis SEO técnico, informe SEO, diagnóstico web, SEO barato, optimización web, Core Web Vitals, velocidad web, SEO para pymes, informe SEO $10' },
    // Open Graph (para Facebook, LinkedIn, etc.)
    { property: 'og:title', content: 'Informe SEO de tu Home por $10 USD | SEO10.dev' },
    { property: 'og:description', content: 'Recibe en 24 h un análisis SEO técnico de tu página principal con velocidad, Core Web Vitals y metadatos. Informe PDF claro y accionable por solo $10 USD.' },
    // IMPORTANTE: Reemplaza con la URL de una imagen real optimizada para OG (1200x630px recomendado)
    { property: 'og:image', content: `${baseUrl}/images/og-auditoria-seo-10.jpg` },
    { property: 'og:type', content: 'product' }, // 'product' o 'website'/'service' son apropiados
    { property: 'og:url', content: canonicalUrl }, // URL Canónica de esta página
    { property: 'og:site_name', content: 'SEO10.dev' }, // Nombre del sitio
    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Informe SEO de tu Home por $10 USD | SEO10.dev' },
    { name: 'twitter:description', content: 'Recibe en 24 h un análisis SEO técnico de tu página principal con velocidad, Core Web Vitals y metadatos. Informe PDF claro y accionable por solo $10 USD.' },
    // IMPORTANTE: Reemplaza con la URL de una imagen real optimizada para Twitter (puede ser la misma que OG)
    { name: 'twitter:image', content: `${baseUrl}/images/twitter-auditoria-seo-10.jpg` },
    // { name: 'twitter:site', content: '@tuUsuarioTwitter' } // Opcional: si tienes cuenta de Twitter
  ],

  // Define el enlace canónico y hreflang para internacionalización
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'es', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }
  ],

  // Datos Estructurados (Schema.org) en formato JSON-LD
  script: [
    // Schema para el Producto/Servicio ofrecido
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product", // O "Service" si lo prefieres
        "name": "Informe SEO de tu Home por $10 USD",
        "description": "Recibe en 24 h un análisis SEO técnico de tu página principal con velocidad, Core Web Vitals y metadatos. Informe PDF claro y accionable por solo $10 USD.",
        // IMPORTANTE: Reemplaza con la URL de una imagen real del producto/servicio
        "image": `${baseUrl}/images/informe-seo-muestra.jpg`,
        "sku": "SEO10-AUDIT-EXPRESS", // Identificador único del producto/servicio (opcional)
        "mpn": "SEO10AUDIT01", // Manufacturer Part Number (si aplica, opcional)
        "brand": {
          "@type": "Organization", // O "Brand"
          "name": "SEO10.dev",
          "url": baseUrl
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "10.00",
          "availability": "https://schema.org/InStock", // El servicio está disponible
          "url": `${baseUrl}/solicitud`, // URL para comprar/solicitar
          "validFrom": "2024-01-01", // Fecha desde que la oferta es válida (opcional)
          "priceValidUntil": "2025-12-31" // Fecha hasta que el precio es válido (opcional)
        },
        // IMPORTANTE: Añade reseñas reales aquí si las tienes disponibles
        // "review": [
        //   {
        //     "@type": "Review",
        //     "reviewRating": {
        //       "@type": "Rating",
        //       "ratingValue": "5",
        //       "bestRating": "5"
        //      },
        //     "author": {
        //       "@type": "Person",
        //       "name": "Nombre Cliente Real"
        //     },
        //     "reviewBody": "¡Excelente servicio! El informe fue claro y me ayudó a identificar problemas clave."
        //   }
        // ]
      })
    },
    // Schema para las Preguntas Frecuentes (FAQ)
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          // Usamos las preguntas/respuestas mejoradas que ya tenías
           {
            "@type": "Question",
            "name": "¿Qué incluye exactamente este informe SEO por $10?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Este informe detallado incluye un diagnóstico técnico de tu página de inicio, análisis de la velocidad y experiencia de usuario (Core Web Vitals), una revisión de tu visibilidad en Google, y sugerencias priorizadas y accionables para mejorar tu SEO."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuál es el tiempo de entrega del informe SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Recibirás tu informe SEO completo en un plazo de 24 horas hábiles directamente en tu correo electrónico."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué tipo de recomendaciones encontraré en el informe SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Encontrarás recomendaciones prácticas y fáciles de entender sobre cómo mejorar la velocidad de tu sitio, optimizar su estructura técnica, trabajar con tus metadatos de manera efectiva, mejorar la accesibilidad y un resumen de las acciones más importantes a implementar."
            }
          },
          {
            "@type": "Question",
            "name": "¿El informe SEO se enfoca solo en la página principal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, el análisis principal se realiza en la página de inicio de tu sitio web, ya que suele ser la que tiene mayor impacto SEO. Si necesitas un análisis de otra sección específica, puedes indicarlo en el formulario de solicitud."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué debo hacer si no recibo mi informe SEO en el tiempo indicado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Por favor, revisa tu carpeta de spam. Si no está allí, contáctanos de inmediato a través de nuestro correo electrónico hola@seo10.dev y nuestro equipo se encargará de solucionar el problema a la brevedad."
            }
          }
        ]
      })
    }
  ]
})

const HomeHero = defineAsyncComponent(() => import('./components/HomeHero.vue'))
const HomeAdvantages = defineAsyncComponent(() => import('./components/HomeAdvantages.vue'))
const HomeCoverage = defineAsyncComponent(() => import('./components/HomeCoverage.vue'))
const HomeExperience = defineAsyncComponent(() => import('./components/HomeExperience.vue'))
const HomeBusiness = defineAsyncComponent(() => import('./components/HomeBusiness.vue'))
const HomeFAQ = defineAsyncComponent(() => import('./components/HomeFAQ.vue'))
const HomeCTA = defineAsyncComponent(() => import('./components/HomeCTA.vue'))
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si Tailwind no es suficiente */
</style>