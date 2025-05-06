<template>
  <p><small>Webpay</small></p>
  <div class="max-w-2xl mx-auto py-20 px-6 text-center">
    <h1 class="text-3xl font-bold mb-4 text-blue-700" v-if="estado === 'exito'">
      <span role="img" aria-label="pago confirmado">✅</span> ¡Pago confirmado con <b>Webpay</b>!
    </h1>
    <div v-if="estado === 'exito'" class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-base font-medium mb-6">
      <span class="font-bold">Tu pago fue procesado exitosamente a través de Webpay Plus.</span><br>
      <span>Recibirás tu informe SEO en menos de 24 horas hábiles en tu correo electrónico.</span><br>
      <span class="text-xs text-blue-600">Pago seguro y respaldado por Transbank.</span>
    </div>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'rechazado'">
      <span role="img" aria-label="pago no confirmado">❌</span> Pago rechazado o no autorizado (Webpay)
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'anulado'">
      <span role="img" aria-label="pago anulado">⚠️</span> Pago cancelado o anulado
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'cargando'">
      <span role="img" aria-label="esperando confirmacion">⏳</span> Consultando estado de pago...
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'error'">
      <span role="img" aria-label="error">❌</span> Error al consultar el estado del pago
    </h1>

    <p v-if="estado === 'exito'">
      <!-- Mensaje destacado ya mostrado arriba -->
    </p>
    <p v-else-if="estado === 'rechazado'">
      Tu pago no pudo ser confirmado. Estado recibido: <strong>{{ resultado?.status ?? resultado?.estado ?? 'desconocido' }}</strong>
    </p>
    <p v-else-if="estado === 'anulado'">
      El pago fue cancelado o anulado. Si tienes dudas, contáctanos.
    </p>
    <p v-else-if="estado === 'cargando'">
      Consultando el estado de tu pago. Por favor, espera unos segundos.
    </p>
    <p v-else-if="estado === 'error'">
      {{ resultado?.mensaje || 'Ocurrió un error inesperado.' }}
    </p>

    <div v-if="estado === 'exito'" class="mt-10 text-left text-sm bg-gray-50 rounded p-6 shadow">
      <h2 class="text-lg font-semibold mb-2">Detalles de la transacción (Webpay)</h2>
      <p><strong>Orden de compra:</strong> {{ resultado?.buyOrder || resultado?.buy_order || 'No disponible' }}</p>
      <p><strong>Monto pagado:</strong> ${{ resultado?.amount || resultado?.response?.amount || 'No disponible' }}</p>
      <p><strong>Fecha de transacción:</strong> {{ resultado?.transactionDate || resultado?.response?.transaction_date || 'No disponible' }}</p>
      <p><strong>Código de autorización:</strong> {{ resultado?.authorizationCode || resultado?.response?.authorization_code || 'No disponible' }}</p>
      <p><strong>Tipo de pago:</strong> {{ resultado?.paymentTypeCode || resultado?.response?.payment_type_code || 'No disponible' }}</p>
    </div>

    <div v-if="estado === 'error'" class="text-red-600 mt-10">
      <p class="text-xl font-semibold mb-2">❌ Error al procesar el pago</p>
      <p>{{ resultado?.mensaje || 'Error desconocido.' }}</p>
      <pre v-if="resultado">{{ JSON.stringify(resultado, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const estado = ref('cargando')
const resultado = ref(null)

async function consultarEstadoWebpay(token_ws) {
  try {
    const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000';
    console.log('[Webpay] Consultando backend con token_ws:', token_ws)
    const res = await fetch(`${apiBase}/api/webpay/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_ws })
    });
    if (!res.ok) {
      throw new Error('Error consultando estado en Webpay');
    }
    const data = await res.json();
    console.log('[Webpay] Respuesta backend:', data)
    resultado.value = data;
    if (data.status === 'AUTHORIZED' || data.status === 'SUCCESS') {
      estado.value = 'exito';
    } else if (data.status === 'ANULADA' || data.status === 'CANCELED') {
      estado.value = 'anulado';
    } else {
      estado.value = 'rechazado';
    }
    return data;
  } catch (e) {
    estado.value = 'error';
    resultado.value = { mensaje: 'Error consultando Webpay', error: e.message };
    console.error('[❌ Webpay] Error consultando Webpay:', e);
  }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token_ws = params.get('token_ws')
  console.log('[Webpay] token_ws detectado en URL:', token_ws)
  if (!token_ws) {
    estado.value = 'error'
    resultado.value = { mensaje: 'No se encontró el token de Webpay.' }
    console.error('[Webpay] No se encontró token_ws en la URL')
    return
  }
  estado.value = 'cargando'
  await consultarEstadoWebpay(token_ws)
})
</script>

<style scoped>
p {
  margin-bottom: 0.5rem;
}
</style> 