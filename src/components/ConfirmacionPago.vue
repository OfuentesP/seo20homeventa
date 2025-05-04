<template>
  <div class="max-w-2xl mx-auto py-20 px-6 text-center">
    <!-- Flow -->
    <h1 class="text-3xl font-bold mb-4" v-if="estado === 'exito' || resultado?.status === 2">
      <span role="img" aria-label="pago confirmado">✅</span> ¡Pago confirmado con Flow!
    </h1>
    <h1 class="text-3xl font-bold mb-4" v-else>
      <span role="img" aria-label="pago no confirmado">❌</span> Estado: {{ resultado?.status }}
    </h1>
    <p v-if="estado === 'exito' || resultado?.status === 2">
      Gracias por tu compra. Te enviaremos el informe SEO en menos de 24 horas hábiles.
    </p>
    <p v-else>Tu pago no pudo ser confirmado. Estado recibido: {{ resultado?.status }}</p>
    <div v-if="estado === 'exito' || resultado?.status === 2" class="mt-10 text-left text-sm bg-gray-50 rounded p-6 shadow">
      <h2 class="text-lg font-semibold mb-2">Detalles de la transacción</h2>
      <p><strong>Orden de compra:</strong> {{ resultado.commerceOrder }}</p>
      <p><strong>Monto pagado:</strong> ${{ resultado.amount }}</p>
      <p v-if="resultado.payer"><strong>Pagador:</strong> {{ resultado.payer }}</p>
    </div>
    <div v-if="estado === 'cargando'" class="text-gray-500 mt-10">
      Procesando tu pago... ⏳
    </div>
    <div v-else-if="estado === 'rechazado'" class="text-yellow-600 mt-10">
      <p class="text-xl font-semibold mb-2">⚠️ Pago rechazado o no autorizado.</p>
      <p>Estado entregado por el medio de pago: <strong>{{ resultado.status }}</strong></p>
    </div>
    <div v-else-if="estado === 'error'" class="text-red-600 mt-10">
      <p class="text-xl font-semibold mb-2">❌ Error al procesar el pago 1.2</p>
      <p>{{ resultado.mensaje }}</p>
    </div>
    <div v-else-if="estado === 'anulado'" class="text-yellow-600 mt-10">
      <p class="text-xl font-semibold mb-2">⚠️ Pago cancelado o anulado</p>
      <p>{{ resultado.mensaje }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { db } from '../firebase'
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore'

const estado = ref('cargando')
const resultado = ref(null)

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
  const tbk_token = params.get('TBK_TOKEN')
  let buyOrder = params.get('TBK_ORDEN_COMPRA') || params.get('buy_order')
  if (!buyOrder && tbk_token) {
    buyOrder = localStorage.getItem('flow-order-id')
  }
  const form = JSON.parse(localStorage.getItem('formulario-seo') || '{}')

  if (tbk_token) {
    estado.value = 'cargando'
    resultado.value = { mensaje: 'Consultando estado del pago...' }

    try {
      const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000'
      console.log('[Flow][Front] Enviando a backend:', {
        token: tbk_token,
        buyOrder,
        nombre: form.nombre,
        empresa: form.empresa,
        sitio: form.sitio,
        cargo: form.cargo,
        email: form.email
      });
      const res = await fetch(`${apiBase}/api/flow/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tbk_token,
          buyOrder,
          nombre: form.nombre,
          empresa: form.empresa,
          sitio: form.sitio,
          cargo: form.cargo,
          email: form.email
        })
      })

      console.log('[Flow][DEBUG] res.status:', res.status)
      let data = null
      try {
        data = await res.json()
        console.log('[Flow][DEBUG] Respuesta backend:', data)
      } catch (e) {
        estado.value = 'error'
        resultado.value = { mensaje: 'Error parseando la respuesta del backend.' }
        console.error('[❌ Error parseando JSON de Flow]', e)
        return
      }

      if (!res.ok) {
        estado.value = 'error'
        resultado.value = { mensaje: `Error HTTP del backend: ${res.status}` }
        console.error('[Flow][ERROR] HTTP:', res.status, data)
        return
      }

      if (data?.status === 2 || data?.status === '2') {
        estado.value = 'exito'
        resultado.value = { mensaje: '¡Pago aprobado!', ...data }
        await guardarEnFirebase(buyOrder, {
          tipo: 'Flow',
          detalles: data,
          estado: estado.value
        }, form)
      } else if (data?.status === 3 || data?.status === '3') {
        estado.value = 'rechazado'
        resultado.value = { mensaje: 'Pago rechazado.', ...data }
        await guardarEnFirebase(buyOrder, {
          tipo: 'Flow',
          detalles: data,
          estado: estado.value
        }, form)
      } else if (data?.status === 4 || data?.status === '4') {
        estado.value = 'anulado'
        resultado.value = { mensaje: 'Pago anulado por el usuario.', ...data }
        await guardarEnFirebase(buyOrder, {
          tipo: 'Flow',
          detalles: data,
          estado: estado.value
        }, form)
      } else {
        estado.value = 'error'
        resultado.value = { mensaje: 'No se pudo determinar el estado del pago.', ...data }
        console.error('[Flow][ERROR] Estado inesperado:', res.status, data)
      }
    } catch (err) {
      estado.value = 'error'
      resultado.value = { mensaje: 'Error consultando estado del pago.' }
      console.error('[Flow][ERROR]', err)
    }
  } else {
    estado.value = 'error'
    resultado.value = { mensaje: 'No se pudo determinar el estado del pago.' }
  }
})
</script>

<style scoped>
p {
  margin-bottom: 0.5rem;
}
</style>