<script setup>
import { onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'

const datosFormulario = ref({})

onMounted(() => {
  const data = localStorage.getItem('formulario-seo')
  if (data) {
    datosFormulario.value = JSON.parse(data)
  }
})

function limpiarSitio(sitio) {
  if (!sitio) return '—';
  return sitio.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

async function iniciarPago() {
  try {
    const apiBase = import.meta.env.PROD
      ? '' // En producción, usa el mismo dominio
      : 'http://localhost:3000';

    const res = await fetch(`${apiBase}/api/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error del servidor: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (!data.url || !data.token) {
      throw new Error('Datos de pago inválidos recibidos.');
    }

    window.location.href = `${data.url}?token_ws=${data.token}`;
  } catch (err) {
    console.error('[❌ Error al generar el pago]', err);
    alert('Hubo un error al generar el pago. Revisa la consola para más detalles.');
  }
}

async function iniciarPagoMercadoPago() {
  try {
    const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000';
    const res = await fetch(`${apiBase}/api/mercadopago/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert('Error al iniciar pago con Mercado Pago');
    }
  } catch (err) {
    console.error('[❌ Error al generar el pago con Mercado Pago]', err);
    alert('Hubo un error al generar el pago con Mercado Pago. Revisa la consola para más detalles.');
  }
}

const baseUrl = 'https://seo10.dev';
const canonicalUrl = `${baseUrl}/checkout`;

useHead({
  title: 'Resumen y Pago de tu Informe SEO Técnico | SEO10.dev',
  meta: [
    { name: 'robots', content: 'noindex,follow' },
    { name: 'description', content: 'Revisa y paga tu informe SEO técnico. Pago seguro con Webpay Plus o Mercado Pago. Recibe tu informe en menos de 24h.' },
    { property: 'og:title', content: 'Resumen y Pago de tu Informe SEO Técnico | SEO10.dev' },
    { property: 'og:description', content: 'Revisa y paga tu informe SEO técnico. Pago seguro con Webpay Plus o Mercado Pago. Recibe tu informe en menos de 24h.' },
    { property: 'og:image', content: `${baseUrl}/images/og-auditoria-seo-10.jpg` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: 'SEO10.dev' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Resumen y Pago de tu Informe SEO Técnico | SEO10.dev' },
    { name: 'twitter:description', content: 'Revisa y paga tu informe SEO técnico. Pago seguro con Webpay Plus o Mercado Pago. Recibe tu informe en menos de 24h.' },
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
        "@type": "OrderAction",
        "name": "Pago de Informe SEO Técnico",
        "description": "Revisa y paga tu informe SEO técnico. Pago seguro con Webpay Plus o Mercado Pago. Recibe tu informe en menos de 24h.",
        "instrument": [
          { "@type": "PaymentMethod", "name": "Webpay Plus" },
          { "@type": "PaymentMethod", "name": "Mercado Pago" }
        ],
        "provider": {
          "@type": "Organization",
          "name": "SEO10.dev",
          "url": baseUrl
        },
        "url": canonicalUrl
      })
    }
  ]
})
</script>

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
        <div class="bg-white shadow-md rounded-lg p-8">
          <h1 class="text-3xl font-bold mb-6 text-center flex items-center gap-2 justify-center">
            <span class="text-emerald-600 text-4xl">📄</span>
            Resumen de tu Compra
          </h1>
          <div class="mb-6">
            <h2 class="font-semibold text-lg mb-2">Informe SEO Básico</h2>
            <div class="bg-gray-50 rounded-lg p-4 mb-2">
              <p class="text-base text-gray-700 mb-1"><strong>Nombre:</strong> {{ datosFormulario.nombre || '—' }}</p>
              <p class="text-base text-gray-700 mb-1"><strong>Sitio web:</strong> {{ limpiarSitio(datosFormulario.sitio) }}</p>
              <p class="text-base text-gray-700"><strong>Empresa:</strong> {{ datosFormulario.empresa || '—' }}</p>
            </div>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xl font-bold">Total</span>
              <span class="text-xl font-bold">$20 USD</span>
            </div>
          </div>
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><span class="text-emerald-600 text-2xl">✅</span> ¿Qué incluye este informe SEO?</h2>
            <ul class="text-left space-y-2 text-gray-700 list-disc list-inside">
              <li class="flex items-center gap-2"><span class="text-emerald-600 text-lg">✔️</span> Análisis técnico con Lighthouse y Core Web Vitals</li>
              <li class="flex items-center gap-2"><span class="text-emerald-600 text-lg">✔️</span> Evaluación de títulos, metadatos y estructura HTML</li>
              <li class="flex items-center gap-2"><span class="text-emerald-600 text-lg">✔️</span> Revisión del sitemap y elementos clave para Google</li>
              <li class="flex items-center gap-2"><span class="text-emerald-600 text-lg">✔️</span> Recomendaciones accionables y priorizadas</li>
            </ul>
          </div>
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-2 text-emerald-700">¿Dudas antes de pagar?</h2>
            <p class="text-gray-700 mb-1">Si tienes preguntas sobre el informe, puedes escribirnos antes de completar el pago.</p>
            <p class="font-semibold text-emerald-700 flex items-center gap-2"><span class="text-2xl">📧</span> contacto@seo10.dev</p>
          </div>
          <div class="mb-8">
            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center text-emerald-800 text-base font-medium mb-4">
              Tus datos están protegidos. El pago se realiza mediante plataformas seguras como Webpay Plus y Mercado Pago.
            </div>
            <div class="text-center text-base text-gray-700 mb-4 font-semibold">
              Recibirás tu informe SEO técnico en menos de 24 horas hábiles directamente en tu correo.
            </div>
            <h2 class="text-lg font-bold mb-4">Selecciona tu método de pago</h2>
            <div class="flex flex-col sm:flex-row gap-4">
              <button disabled class="bg-emerald-400 text-white font-semibold text-lg py-4 rounded-xl flex items-center gap-3 justify-center w-full transition opacity-60 cursor-not-allowed">
                <span class="text-2xl">🏦</span> Webpay Plus <span class="ml-2 text-xs font-normal">(Pronto disponible)</span>
              </button>
            </div>
          </div>
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