<template>
  <p><small>Flow</small></p>
  <div class="max-w-2xl mx-auto py-20 px-6 text-center">
    <h1 class="text-3xl font-bold mb-4" v-if="estado === 'exito'">
      <span role="img" aria-label="pago confirmado">✅</span> ¡Pago confirmado con <b>Flow</b>!
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'rechazado'">
      <span role="img" aria-label="pago no confirmado">❌</span> Pago rechazado o no autorizado (Flow)
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'anulado'">
      <span role="img" aria-label="pago anulado">⚠️</span> Pago cancelado o anulado
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'esperando' || estado === 'cargando'">
      <span role="img" aria-label="esperando confirmacion">⏳</span> Esperando confirmación de pago...
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'timeout'">
      <span role="img" aria-label="timeout">⏰</span> No pudimos confirmar tu pago automáticamente
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else-if="estado === 'error'">
      <span role="img" aria-label="error">❌</span> Error al consultar el estado del pago
    </h1>

    <p v-if="estado === 'exito'">
      Gracias por tu compra. Te enviaremos el informe SEO en menos de 24 horas hábiles.
    </p>
    <p v-else-if="estado === 'rechazado'">
      Tu pago no pudo ser confirmado. Estado recibido: <strong>{{ resultado?.estado ?? 'desconocido' }}</strong>
    </p>
    <p v-else-if="estado === 'anulado'">
      El pago fue cancelado o anulado. Si tienes dudas, contáctanos.
    </p>
    <p v-else-if="estado === 'esperando' || estado === 'cargando'">
      Estamos esperando la confirmación de tu pago. Puedes recargar esta página en unos segundos.
    </p>
    <p v-else-if="estado === 'timeout'">
      No pudimos confirmar tu pago automáticamente. Por favor, contáctanos o recarga la página más tarde.
    </p>
    <p v-else-if="estado === 'error'">
      {{ resultado?.mensaje || 'Ocurrió un error inesperado.' }}
    </p>

    <div v-if="estado === 'exito'" class="mt-10 text-left text-sm bg-gray-50 rounded p-6 shadow">
      <h2 class="text-lg font-semibold mb-2">Detalles de la transacción (Flow)</h2>
      <p><strong>Orden de compra:</strong> {{ resultado?.orden || resultado?.buyOrder || 'No disponible' }}</p>
      <p><strong>Monto pagado:</strong> ${{ resultado?.detalles_pago?.amount || resultado?.amount || 'No disponible' }}</p>
      <p v-if="resultado?.email"><strong>Pagador:</strong> {{ resultado.email }}</p>
    </div>

    <div v-if="estado === 'error'" class="text-red-600 mt-10">
      <p class="text-xl font-semibold mb-2">❌ Error al procesar el pago</p>
      <p>{{ resultado?.mensaje || 'Error desconocido.' }}</p>
      <pre v-if="resultado">{{ JSON.stringify(resultado, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const estado = ref('cargando')
const resultado = ref(null)
const pollingInterval = 4000 // ms
const pollingMaxTries = 30 // 2 minutos
let pollingTimer = null
let pollingCount = 0

async function consultarEstadoEnFirestore(buyOrder) {
  if (!buyOrder) return null
  const estados = ['-exito', '-rechazado', '-anulado', '']
  for (const sufijo of estados) {
    const docId = buyOrder + sufijo
    const docRef = doc(db, 'solicitudes', docId)
    const docSnap = await getDoc(docRef)
    console.log(`[🔍 Firestore] Buscando documento: ${docId} => exists: ${docSnap.exists()}`)
    if (docSnap.exists()) {
      return docSnap.data()
    }
  }
  return null
}

async function consultaYActualiza(buyOrder, isPolling = false) {
  if (isPolling) {
    pollingCount++
    console.log(`[🔁 Polling #${pollingCount}] Consultando Firestore para buyOrder:`, buyOrder)
  }
  const startTime = Date.now()
  const datos = await consultarEstadoEnFirestore(buyOrder)
  const elapsed = Date.now() - startTime
  console.log(`[⏱️ Confirmación] Consulta a Firestore tomó ${elapsed} ms (polling: ${isPolling})`)
  console.log('[🧩 Confirmación] Resultado de consultarEstadoEnFirestore:', datos)

  if (!datos) {
    estado.value = 'esperando'
    resultado.value = { mensaje: 'Esperando confirmación de pago...' }
    if (isPolling) {
      console.warn(`[⏳ Polling #${pollingCount}] Documento no encontrado en Firestore para buyOrder:`, buyOrder)
    }
    return false
  }
  resultado.value = datos
  console.log('[✅ Confirmación] Documento Firestore:', datos)
  if (datos.estado === 'exito') {
    estado.value = 'exito'
    console.log('[🎉 Confirmación] Pago exitoso para buyOrder:', buyOrder)
    return true
  } else if (datos.estado === 'rechazado') {
    estado.value = 'rechazado'
    console.warn('[⚠️ Confirmación] Pago rechazado para buyOrder:', buyOrder)
    return true
  } else if (datos.estado === 'anulado') {
    estado.value = 'anulado'
    console.warn('[⚠️ Confirmación] Pago anulado para buyOrder:', buyOrder)
    return true
  } else {
    estado.value = 'esperando'
    console.log('[⏳ Confirmación] Estado aún no definido para buyOrder:', buyOrder, 'Estado:', datos.estado)
    return false
  }
}

onMounted(async () => {
  console.log('[🚦 Confirmación] Iniciando consulta de estado de pago (Flow)...')
  const params = new URLSearchParams(window.location.search)
  let buyOrder = params.get('buy_order') || params.get('TBK_ORDEN_COMPRA') || localStorage.getItem('flow-order-id')
  console.log('[🔎 Confirmación] buyOrder detectado:', buyOrder)
  console.log('[🔎 Confirmación] Parámetros URL:', Object.fromEntries(params.entries()))

  if (!buyOrder) {
    estado.value = 'error'
    resultado.value = { mensaje: 'No se encontró la orden.' }
    console.error('[❌ Confirmación] No se encontró buyOrder en URL ni localStorage')
    return
  }
  estado.value = 'cargando'
  try {
    const finalizado = await consultaYActualiza(buyOrder)
    if (!finalizado) {
      pollingTimer = setInterval(async () => {
        if (pollingCount >= pollingMaxTries) {
          clearInterval(pollingTimer)
          estado.value = 'timeout'
          resultado.value = { mensaje: 'No pudimos confirmar tu pago automáticamente. Por favor, contáctanos o recarga la página más tarde.' }
          console.error('[⏰ Polling] Se alcanzó el límite de intentos de polling. Timeout.')
          return
        }
        const done = await consultaYActualiza(buyOrder, true)
        if (done) {
          clearInterval(pollingTimer)
          console.log('[🛑 Polling] Estado final detectado, deteniendo polling.')
        }
      }, pollingInterval)
    }
  } catch (e) {
    estado.value = 'error'
    resultado.value = { mensaje: 'Error consultando Firestore.' }
    console.error('[❌ Confirmación] Error consultando Firestore:', e)
  }
})
</script>

<style scoped>
p {
  margin-bottom: 0.5rem;
}
</style> 