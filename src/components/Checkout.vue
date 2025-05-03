<script setup>
import { onMounted, ref } from 'vue'

const datosFormulario = ref({})

onMounted(() => {
  const data = localStorage.getItem('formulario-seo')
  if (data) {
    datosFormulario.value = JSON.parse(data)
  }
})

async function iniciarPago() {
  try {
    const apiBase = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL
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
</script>

<template>
  <div class="max-w-xl mx-auto py-16 px-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Resumen de tu Compra</h1>

    <div class="bg-white rounded shadow p-6 mb-8">
      <div class="mb-4">
        <h2 class="font-semibold text-lg">Informe SEO Básico</h2>
        <p class="text-sm text-gray-500">Entrega en 1 día hábil</p>
        <p class="mt-2 text-sm text-gray-700">
          <strong>Nombre:</strong> {{ datosFormulario.nombre }}<br />
          <strong>Sitio web:</strong> {{ datosFormulario.sitio }}<br />
          <strong>Empresa:</strong> {{ datosFormulario.empresa || '—' }}
        </p>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-xl font-bold">Total</span>
        <span class="text-xl font-bold">$10.000</span>
      </div>

      <img src="https://www.transbank.cl/public/img/webpay/webpay_plus.png"
           alt="Webpay Logo"
           class="mx-auto h-10 mt-4" />
    </div>
    <div class="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
  <h2 class="text-xl font-semibold mb-4">¿Qué incluye este informe SEO?</h2>
  <ul class="text-left space-y-2 text-gray-700 list-disc list-inside">
    <li>✅ Análisis técnico con Lighthouse y Core Web Vitals</li>
    <li>✅ Evaluación de títulos, metadatos y estructura HTML</li>
    <li>✅ Revisión del sitemap y elementos clave para Google</li>
    <li>✅ Recomendaciones accionables y priorizadas</li>
  </ul>
</div>

<div class="bg-emerald-50 border border-emerald-200 p-6 rounded-lg mb-6">
  <h2 class="text-xl font-semibold mb-2 text-emerald-700">¿Dudas antes de pagar?</h2>
  <p class="text-gray-700 mb-1">Si tienes preguntas sobre el informe, puedes escribirnos antes de completar el pago.</p>
  <p class="font-semibold text-emerald-700">📧 contacto@seo10.dev</p>
</div>
    <div class="text-center">
      <button @click="iniciarPago"
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition">
        Pagar con Webpay Plus
      </button>
    </div>
  </div>
</template>