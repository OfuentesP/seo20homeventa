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
              <p v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium" for="sitio">Sitio Web a Analizar</label>
              <input v-model="form.sitio" id="sitio" name="sitio" type="url" required autocomplete="url" placeholder="https://tusitio.com" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
              <p v-if="errors.sitio" class="text-red-500 text-xs mt-1">{{ errors.sitio }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium" for="empresa">Nombre de la Empresa <span class="text-gray-400">(opcional)</span></label>
              <input v-model="form.empresa" id="empresa" name="empresa" type="text" autocomplete="organization" placeholder="Ej: Mi Empresa S.A." class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
              <p v-if="errors.empresa" class="text-red-500 text-xs mt-1">{{ errors.empresa }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium" for="cargo">Cargo en la Empresa <span class="text-gray-400">(opcional)</span></label>
              <input v-model="form.cargo" id="cargo" name="cargo" type="text" autocomplete="organization-title" placeholder="Ej: Gerente de Marketing" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
              <p v-if="errors.cargo" class="text-red-500 text-xs mt-1">{{ errors.cargo }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium" for="email">Correo electrónico</label>
              <input v-model="form.email" id="email" name="email" type="email" required autocomplete="email" placeholder="Ej: tu@email.com" class="w-full border border-gray-300 rounded px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
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
      <p>&copy; 2025 SEO20.dev — Todos los derechos reservados.</p>
      <nav class="mt-2 space-x-4">
        <router-link to="/politica-privacidad" class="hover:text-emerald-600">Política de Privacidad</router-link>
        <router-link to="/terminos-servicio" class="hover:text-emerald-600">Términos de Servicio</router-link>
      </nav>
      <p class="mt-2">Contacto: <a href="mailto:hola@seo20.dev" class="text-emerald-600 hover:underline">hola@seo20.dev</a></p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'

const router = useRouter()
const baseUrl = 'https://seo20.dev';
const canonicalUrl = `${baseUrl}/solicitud`;

useHead({
  title: 'Solicita tu Informe SEO Técnico | SEO20.dev',
  meta: [
    { name: 'robots', content: 'index,follow' },
    { name: 'description', content: 'Solicita tu informe SEO técnico y recibe en 24h un diagnóstico claro, accionable y sin tecnicismos de tu página de inicio.' },
    { name: 'keywords', content: 'solicitud informe SEO, análisis SEO, diagnóstico web, optimización SEO, informe técnico, SEO para empresas' },
    { property: 'og:title', content: 'Solicita tu Informe SEO Técnico | SEO20.dev' },
    { property: 'og:description', content: 'Solicita tu informe SEO técnico y recibe en 24h un diagnóstico claro, accionable y sin tecnicismos de tu página de inicio.' },
    { property: 'og:image', content: `${baseUrl}/images/og-auditoria-seo-10.jpg` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: 'SEO20.dev' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Solicita tu Informe SEO Técnico | SEO20.dev' },
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
          "name": "SEO20.dev",
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

const errors = ref({
  nombre: '',
  sitio: '',
  email: '',
  empresa: '',
  cargo: ''
})

function contieneCodigo(str) {
  // Detecta etiquetas HTML o JS simple
  return /<[^>]+>|(script|onerror|onload|alert|function|\{|\}|\$\{|\`)/i.test(str);
}

function trimAllFields(obj) {
  const out = {}
  for (const k in obj) {
    if (typeof obj[k] === 'string') out[k] = obj[k].trim();
    else out[k] = obj[k];
  }
  return out;
}

function validarFormulario() {
  let valido = true;
  const trimmed = trimAllFields(form.value);

  // Validar nombre
  if (/https?:\/\//i.test(trimmed.nombre)) {
    errors.value.nombre = 'El nombre no debe contener una URL.';
    valido = false;
  } else if (!trimmed.nombre) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valido = false;
  } else if (contieneCodigo(trimmed.nombre)) {
    errors.value.nombre = 'No se permite código en el nombre.';
    valido = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]{3,60}$/.test(trimmed.nombre)) {
    errors.value.nombre = 'El nombre debe tener entre 3 y 60 letras y solo caracteres válidos.';
    valido = false;
  } else {
    errors.value.nombre = '';
  }

  // Validar sitio web
  try {
    const url = new URL(trimmed.sitio);
    if (!/^https?:/.test(url.protocol)) {
      errors.value.sitio = 'El sitio web debe comenzar con http:// o https://';
      valido = false;
    } else if (/localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+/.test(url.hostname)) {
      errors.value.sitio = 'No se permiten sitios locales o IPs.';
      valido = false;
    } else if (!/\./.test(url.hostname)) {
      errors.value.sitio = 'El dominio debe contener al menos un punto.';
      valido = false;
    } else if (contieneCodigo(trimmed.sitio)) {
      errors.value.sitio = 'No se permite código en el sitio web.';
      valido = false;
    } else {
      errors.value.sitio = '';
    }
  } catch {
    errors.value.sitio = 'Ingresa una URL válida (ej: https://tusitio.com)';
    valido = false;
  }

  // Validar email
  if (!/^\S+@\S+\.\S+$/.test(trimmed.email)) {
    errors.value.email = 'Ingresa un correo electrónico válido.';
    valido = false;
  } else if (trimmed.email.length > 100) {
    errors.value.email = 'El correo no debe superar los 100 caracteres.';
    valido = false;
  } else if (contieneCodigo(trimmed.email)) {
    errors.value.email = 'No se permite código en el correo.';
    valido = false;
  } else {
    errors.value.email = '';
  }

  // Validar empresa (opcional)
  if (trimmed.empresa && (trimmed.empresa.length > 60 || contieneCodigo(trimmed.empresa))) {
    errors.value.empresa = 'Máx. 60 caracteres y sin código.';
    valido = false;
  } else {
    errors.value.empresa = '';
  }

  // Validar cargo (opcional)
  if (trimmed.cargo && (trimmed.cargo.length > 60 || contieneCodigo(trimmed.cargo))) {
    errors.value.cargo = 'Máx. 60 caracteres y sin código.';
    valido = false;
  } else {
    errors.value.cargo = '';
  }

  return valido;
}

function enviarFormulario() {
  if (!validarFormulario()) return;
  const trimmed = trimAllFields(form.value);
  localStorage.setItem('formulario-seo', JSON.stringify(trimmed))
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