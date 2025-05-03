<template>
  <nav class="bg-slate-900 px-4 py-3 flex items-center justify-between">
    <router-link to="/" class="flex items-center gap-3">
      <img src="/img/logo-seo-20.webp" alt="Logo SEO20" class="h-10 w-auto" />
    </router-link>
    <router-link to="/" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl text-base transition shadow">
      Home
    </router-link>
  </nav>
  <div class="bg-slate-50 min-h-screen flex flex-col justify-between">
    <main class="flex-1 flex flex-col justify-center">
      <div class="max-w-2xl mx-auto py-12 px-2 sm:px-4">
        <div class="bg-white shadow-lg rounded-2xl p-8">
          <h1 class="text-3xl font-bold mb-2 text-center flex items-center justify-center gap-2">
            <span class="text-emerald-600 text-4xl">📈</span>
            Solicita tu Informe SEO
          </h1>
          <div class="flex items-center gap-2 justify-center mt-4 mb-2">
            <span class="text-emerald-500 text-xl">✅</span>
            <h2 class="text-xl font-semibold">¿Qué analizamos en tu sitio web?</h2>
          </div>
          <ul class="list-disc ml-8 mt-2 text-gray-600 space-y-1">
            <li>Velocidad y experiencia de usuario (Core Web Vitals)</li>
            <li>Metadatos y títulos optimizados</li>
            <li>Revisión de indexabilidad</li>
            <li>Sitemap XML y estructura</li>
          </ul>
          <p class="text-center text-gray-600 mb-6 mt-4 text-base">
            Completa este formulario y en solo 24h te enviaremos un informe SEO técnico de tu página de inicio, claro, accionable y sin tecnicismos.
          </p>
          <form @submit.prevent="enviarFormulario" class="space-y-6">
            <div>
              <label class="block mb-1 font-medium" for="nombre">Nombre y Apellido</label>
              <input v-model="form.nombre" id="nombre" name="nombre" type="text" required autocomplete="name" placeholder="Ej: Juan Pérez" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
            </div>
            <div>
              <label class="block mb-1 font-medium" for="sitio">Sitio Web a Analizar</label>
              <input v-model="form.sitio" id="sitio" name="sitio" type="url" required autocomplete="url" placeholder="https://tusitio.com" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
            </div>
            <div>
              <label class="block mb-1 font-medium" for="empresa">Nombre de la Empresa <span class="text-gray-400">(opcional)</span></label>
              <input v-model="form.empresa" id="empresa" name="empresa" type="text" autocomplete="organization" placeholder="Ej: Mi Empresa S.A." class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
            </div>
            <div>
              <label class="block mb-1 font-medium" for="cargo">Cargo en la Empresa <span class="text-gray-400">(opcional)</span></label>
              <input v-model="form.cargo" id="cargo" name="cargo" type="text" autocomplete="organization-title" placeholder="Ej: Gerente de Marketing" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
            </div>
            <div>
              <label class="block mb-1 font-medium" for="email">Correo electrónico</label>
              <input v-model="form.email" id="email" name="email" type="email" required autocomplete="email" placeholder="Ej: tu@email.com" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
            </div>
            <div class="text-center">
              <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 justify-center w-full mt-2 transition-all">
                <span>Enviar Solicitud</span>
              </button>
              <div class="text-xs text-gray-400 mt-2 text-center">No compartimos tus datos con nadie. Solo los usamos para enviarte el informe.</div>
            </div>
          </form>
        </div>
      </div>
    </main>
    <footer class="bg-gray-100 text-center text-sm text-gray-600 min-h-[160px] h-[160px] flex flex-col justify-center pt-12">
      <p>&copy; 2025 SEO10.dev — Todos los derechos reservados.</p>
      <nav class="mt-2 space-x-4">
        <router-link to="/politica-privacidad" class="hover:text-emerald-600">Política de Privacidad</router-link>
        <router-link to="/terminos-servicio" class="hover:text-emerald-600">Términos de Servicio</router-link>
      </nav>
      <p class="mt-2">Contacto: <a href="mailto:hola@seo10.dev" class="text-emerald-600 hover:underline">hola@seo10.dev</a></p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'

const router = useRouter()
const baseUrl = 'https://seo10.dev';
const canonicalUrl = `${baseUrl}/solicitud`;

useHead({
  title: 'Solicita tu Informe SEO Técnico | SEO10.dev',
  meta: [
    { name: 'robots', content: 'index,follow' },
    { name: 'description', content: 'Solicita tu informe SEO técnico y recibe en 24h un diagnóstico claro, accionable y sin tecnicismos de tu página de inicio.' },
    { name: 'keywords', content: 'solicitud informe SEO, análisis SEO, diagnóstico web, optimización SEO, informe técnico, SEO para empresas' },
    { property: 'og:title', content: 'Solicita tu Informe SEO Técnico | SEO10.dev' },
    { property: 'og:description', content: 'Solicita tu informe SEO técnico y recibe en 24h un diagnóstico claro, accionable y sin tecnicismos de tu página de inicio.' },
    { property: 'og:image', content: `${baseUrl}/images/og-auditoria-seo-10.jpg` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: 'SEO10.dev' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Solicita tu Informe SEO Técnico | SEO10.dev' },
    { name: 'twitter:description', content: 'Solicita tu informe SEO técnico y recibe en 24h un diagnóstico claro, accionable y sin tecnicismos de tu página de inicio.' },
    { name: 'twitter:image', content: `${baseUrl}/images/twitter-auditoria-seo-10.jpg` },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'es', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Informe SEO Técnico",
        "provider": {
          "@type": "Organization",
          "name": "SEO10.dev",
          "url": baseUrl
        },
        "areaServed": "ES",
        "description": "Solicita tu informe SEO técnico y recibe en 24h un diagnóstico claro, accionable y sin tecnicismos de tu página de inicio.",
        "offers": {
          "@type": "Offer",
          "price": "20.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        }
      })
    }
  ]
})

const form = ref({
  nombre: '',
  sitio: '',
  empresa: '',
  cargo: '',
  email: ''
})

function enviarFormulario() {
  // ✅ Guarda datos en localStorage para que el checkout los use
  localStorage.setItem('formulario-seo', JSON.stringify(form.value))
  // ✅ Redirige al paso de resumen antes del pago
  router.push('/checkout')
}
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>