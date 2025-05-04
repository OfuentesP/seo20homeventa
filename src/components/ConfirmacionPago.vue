<template>
    <div class="max-w-2xl mx-auto py-20 px-6 text-center">
      <template v-if="esMercadoPago">
        <h1 class="text-3xl font-bold mb-4" v-if="status === 'success'"><span role="img" aria-label="pago aprobado">✅</span> ¡Pago aprobado con Mercado Pago!</h1>
        <h1 class="text-3xl font-bold mb-4" v-else-if="status === 'failure'"><span role="img" aria-label="pago rechazado">❌</span> Pago rechazado o no autorizado.</h1>
        <h1 class="text-3xl font-bold mb-4" v-else-if="status === 'pending'"><span role="img" aria-label="pago pendiente">⏳</span> Pago pendiente de confirmación.</h1>
        <p v-if="status === 'success'">Gracias por tu compra. Te enviaremos el informe SEO en menos de 24 horas hábiles.</p>
        <p v-else-if="status === 'failure'">Tu pago no pudo ser confirmado. Estado recibido: {{ status }}</p>
        <p v-else-if="status === 'pending'">Tu pago está pendiente. Te avisaremos cuando se confirme.</p>
      </template>
      <template v-else>
        <h1 class="text-3xl font-bold mb-4" v-if="resultado?.status === 'AUTHORIZED'"><span role="img" aria-label="pago confirmado">✅</span> ¡Pago confirmado!</h1>
        <h1 class="text-3xl font-bold mb-4" v-else-if="resultado"><span role="img" aria-label="pago no confirmado">❌</span> Estado: {{ resultado.status }}</h1>
        <p v-if="resultado?.status === 'AUTHORIZED'">
          Gracias por tu compra. Te enviaremos el informe SEO en menos de 24 horas hábiles.
        </p>
        <p v-else-if="resultado">Tu pago no pudo ser confirmado. Estado recibido: {{ resultado.status }}</p>
        <p v-else>Validando tu pago...</p>
    
        <div v-if="resultado?.status === 'AUTHORIZED'" class="mt-10 text-left text-sm bg-gray-50 rounded p-6 shadow">
          <h2 class="text-lg font-semibold mb-2">Detalles de la transacción</h2>
          <p><strong>Orden de compra:</strong> {{ resultado.buy_order }}</p>
          <p><strong>Monto pagado:</strong> ${{ resultado.amount }}</p>
          <p><strong>Tarjeta:</strong> **** **** **** {{ resultado.card_detail.card_number }}</p>
          <p><strong>Tipo de pago:</strong> {{ resultado.payment_type_code }}</p>
          <p><strong>Código de autorización:</strong> {{ resultado.authorization_code }}</p>
        </div>
    
        <div v-if="estado === 'cargando'" class="text-gray-500 mt-10">
          Procesando tu pago... ⏳
        </div>
    
        <div v-else-if="estado === 'exito'" class="text-green-600 mt-10">
          <p class="text-xl font-semibold mb-2">✅ ¡Pago aprobado!</p>
          <p>Tu orden <strong>{{ resultado.buy_order }}</strong> fue confirmada con éxito.</p>
        </div>
    
        <div v-else-if="estado === 'rechazado'" class="text-yellow-600 mt-10">
          <p class="text-xl font-semibold mb-2">⚠️ Pago rechazado o no autorizado.</p>
          <p>Estado entregado por Transbank: <strong>{{ resultado.status }}</strong></p>
        </div>
    
        <div v-else-if="estado === 'error'" class="text-red-600 mt-10">
          <p class="text-xl font-semibold mb-2">❌ Error al procesar el pago</p>
          <p>{{ resultado.mensaje }}</p>
        </div>
    
        <div v-else-if="estado === 'anulado'" class="text-yellow-600 mt-10">
          <p class="text-xl font-semibold mb-2">⚠️ Pago cancelado o anulado</p>
          <p>{{ resultado.mensaje }}</p>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { db } from '../firebase'
  import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore'
  
  const estado = ref('cargando')
  const resultado = ref(null)
  const status = ref('')
  const esMercadoPago = ref(false)
  
  async function guardarEnFirebase(buyOrder, pago) {
    try {
      if (!buyOrder) return
      if (localStorage.getItem('solicitud-guardada-' + buyOrder)) {
        console.log(`[🟡 Ya guardado en Firebase] buyOrder: ${buyOrder}`)
        return
      }
      const form = JSON.parse(localStorage.getItem('formulario-seo') || '{}')
      console.log('[🔥 Intentando guardar en Firebase]', buyOrder, { ...form, ...pago })
      await setDoc(doc(collection(db, 'solicitudes'), buyOrder), {
        nombre: form.nombre || '',
        sitio: form.sitio || '',
        empresa: form.empresa || '',
        cargo: form.cargo || '',
        email: form.email || '',
        tipo_pago: pago.tipo,
        detalles_pago: pago.detalles,
        fecha: serverTimestamp()
      })
      localStorage.setItem('solicitud-guardada-' + buyOrder, '1')
      console.log(`[✅ Guardado en Firebase] buyOrder: ${buyOrder}`)
    } catch (e) {
      console.error('[❌ Error guardando en Firebase]', e)
    }
  }
  
  onMounted(async () => {
    const params = new URLSearchParams(window.location.search)
    const token_ws = params.get('token_ws')
    const tbk_token = params.get('TBK_TOKEN')
    const buyOrder = params.get('TBK_ORDEN_COMPRA') || params.get('buy_order')

    if (token_ws) {
      // Pago exitoso: consulta y muestra resultado
      const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000'
      try {
        const res = await fetch(`${apiBase}/api/webpay/commit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token_ws })
        })
        const data = await res.json()
        if (res.ok && data.status === 'AUTHORIZED') {
          estado.value = 'exito'
          resultado.value = data
          await guardarEnFirebase(data.buy_order, {
            tipo: 'Webpay',
            detalles: data
          })
        } else {
          estado.value = 'rechazado'
          resultado.value = data
          await guardarEnFirebase(data.buy_order, {
            tipo: 'Flow',
            detalles: data,
            estado: 'rechazado'
          })
        }
      } catch (err) {
        estado.value = 'error'
        resultado.value = { mensaje: 'Error técnico al confirmar el pago.' }
      }
    } else if (tbk_token) {
      // Pago anulado/cancelado: consulta estado real en backend
      estado.value = 'anulado'
      resultado.value = { mensaje: 'El pago fue cancelado o anulado por el usuario.' }
      try {
        const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000'
        const res = await fetch(`${apiBase}/api/flow/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tbk_token, buyOrder })
        })
        const data = await res.json()
        if (data.status && data.status !== 'AUTHORIZED') {
          resultado.value = { mensaje: 'El pago fue cancelado o anulado por el usuario.', ...data }
          await guardarEnFirebase(buyOrder, {
            tipo: 'Flow',
            detalles: data,
            estado: 'anulado'
          })
        }
      } catch (err) {
        console.error('[❌ Error consultando estado de Flow]', err)
      }
    } else {
      // Otro caso: error genérico
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