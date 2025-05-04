<template>
  <div class="max-w-2xl mx-auto py-20 px-6 text-center">
    <h1 class="text-3xl font-bold mb-4" v-if="pagoExitoso">
      <span role="img" aria-label="pago confirmado">✅</span> ¡Pago confirmado con Flow!
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else>
      <span role="img" aria-label="pago no confirmado">❌</span> Estado: {{ resultado?.status ?? 'desconocido' }}
    </h1>

    <p v-if="pagoExitoso">
      Gracias por tu compra. Te enviaremos el informe SEO en menos de 24 horas hábiles.
    </p>
    <p v-else>
      Tu pago no pudo ser confirmado. Estado recibido: {{ resultado?.status ?? 'desconocido' }}
    </p>

    <div v-if="pagoExitoso" class="mt-10 text-left text-sm bg-gray-50 rounded p-6 shadow">
      <h2 class="text-lg font-semibold mb-2">Detalles de la transacción</h2>
      <p><strong>Orden de compra:</strong> {{ resultado.commerceOrder || 'No disponible' }}</p>
      <p><strong>Monto pagado:</strong> ${{ resultado.amount || 'No disponible' }}</p>
      <p v-if="resultado?.payer"><strong>Pagador:</strong> {{ resultado.payer }}</p>
    </div>

    <div v-if="estado === 'cargando'" class="text-gray-500 mt-10">
      Procesando tu pago... ⏳
    </div>
    <div v-else-if="estado === 'rechazado'" class="text-yellow-600 mt-10">
      <p class="text-xl font-semibold mb-2">⚠️ Pago rechazado o no autorizado.</p>
      <p>Estado entregado por el medio de pago: <strong>{{ resultado?.status ?? 'desconocido' }}</strong></p>
    </div>
    <div v-else-if="estado === 'error'" class="text-red-600 mt-10">
      <p class="text-xl font-semibold mb-2">❌ Error al procesar el pago</p>
      <p>{{ resultado?.mensaje || 'Error desconocido.' }}</p>
      <pre v-if="resultado">{{ JSON.stringify(resultado, null, 2) }}</pre>
    </div>
    <div v-else-if="estado === 'anulado'" class="text-yellow-600 mt-10">
      <p class="text-xl font-semibold mb-2">⚠️ Pago cancelado o anulado</p>
      <p>{{ resultado?.mensaje || 'Sin más detalles.' }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore'

const estado = ref('cargando')
const resultado = ref(null)

const pagoExitoso = computed(() =>
  estado.value === 'exito' ||
  resultado.value?.status === 2 ||
  resultado.value?.estado === 'exito'
)

async function guardarEnFirebase(buyOrder, pago, form = {}) {
  try {
    if (!buyOrder) return
    if (localStorage.getItem('solicitud-guardada-' + buyOrder)) {
      console.log(`[🟡 Ya guardado en Firebase] buyOrder: ${buyOrder}`)
      return
    }
    const formData = Object.keys(form).length ? form : JSON.parse(localStorage.getItem('formulario-seo') || '{}')
    console.log('[🔥 Intentando guardar en Firebase]', buyOrder, { ...formData, ...pago })
    await setDoc(doc(collection(db, 'solicitudes'), buyOrder), {
      nombre: formData.nombre || '',
      sitio: formData.sitio || '',
      empresa: formData.empresa || '',
      cargo: formData.cargo || '',
      email: formData.email || '',
      tipo_pago: pago.tipo,
      detalles_pago: pago.detalles,
      estado: pago.estado || '',
      fecha: serverTimestamp()
    }, { merge: true })
    localStorage.setItem('solicitud-guardada-' + buyOrder, '1')
    console.log(`[✅ Guardado en Firebase] buyOrder: ${buyOrder}`)
  } catch (e) {
    console.error('[❌ Error guardando en Firebase]', e)
  }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  let token = params.get('token') || params.get('TBK_TOKEN') || localStorage.getItem('flow-token')
  let buyOrder = params.get('buy_order') || params.get('TBK_ORDEN_COMPRA') || localStorage.getItem('flow-order-id')
  const form = JSON.parse(localStorage.getItem('formulario-seo') || '{}')

  if (token) localStorage.setItem('flow-token', token)
  if (buyOrder) localStorage.setItem('flow-order-id', buyOrder)

  if (!token) {
    estado.value = 'error'
    resultado.value = { mensaje: 'No se pudo determinar el estado del pago (token ausente).' }
    return
  }

  try {
    const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000'
    const res = await fetch(`${apiBase}/api/flow/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        buyOrder,
        ...form
      })
    })

    let data = null
    try {
      data = await res.json()
    } catch (e) {
      estado.value = 'error'
      resultado.value = { mensaje: 'Error parseando la respuesta del backend.' }
      console.error('[❌ Error parseando JSON de Flow]', e)
      return
    }

    resultado.value = { ...data }

    if (!res.ok) {
      estado.value = 'error'
      resultado.value = { mensaje: `Error HTTP del backend: ${res.status}` }
      console.error('[Flow][ERROR] HTTP:', res.status, data)
      return
    }

    switch (data?.status) {
      case 2:
        estado.value = 'exito'
        await guardarEnFirebase(buyOrder, {
          tipo: 'Flow',
          detalles: data,
          estado: 'exito'
        }, form)
        break
      case 3:
        estado.value = 'rechazado'
        await guardarEnFirebase(buyOrder, {
          tipo: 'Flow',
          detalles: data,
          estado: 'rechazado'
        }, form)
        break
      case 4:
        estado.value = 'anulado'
        await guardarEnFirebase(buyOrder, {
          tipo: 'Flow',
          detalles: data,
          estado: 'anulado'
        }, form)
        break
      default:
        estado.value = 'error'
        resultado.value = { mensaje: 'No se pudo determinar el estado del pago.', ...data }
        console.error('[Flow][ERROR] Estado inesperado:', res.status, data)
    }
  } catch (err) {
    estado.value = 'error'
    resultado.value = { mensaje: 'Error consultando estado del pago.' }
    console.error('[Flow][ERROR]', err)
  }
})
</script>

<style scoped>
p {
  margin-bottom: 0.5rem;
}
</style>