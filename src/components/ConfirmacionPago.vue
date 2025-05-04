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
        <h1 class="text-3xl font-bold mb-4" v-if="estado === 'exito' || resultado?.status === 2 || resultado?.status === 'AUTHORIZED'">
          <span role="img" aria-label="pago confirmado">✅</span> ¡Pago confirmado!
        </h1>
        <h1 class="text-3xl font-bold mb-4" v-else-if="resultado">
          <span role="img" aria-label="pago no confirmado">❌</span> Estado: {{ resultado.status }}
        </h1>
        <p v-if="estado === 'exito' || resultado?.status === 2 || resultado?.status === 'AUTHORIZED'">
          Gracias por tu compra. Te enviaremos el informe SEO en menos de 24 horas hábiles.
        </p>
        <p v-else-if="resultado">Tu pago no pudo ser confirmado. Estado recibido: {{ resultado.status }}</p>
        <p v-else>Validando tu pago...</p>
    
        <div v-if="estado === 'exito' || resultado?.status === 2 || resultado?.status === 'AUTHORIZED'" class="mt-10 text-left text-sm bg-gray-50 rounded p-6 shadow">
          <h2 class="text-lg font-semibold mb-2">Detalles de la transacción</h2>
          <p><strong>Orden de compra:</strong> {{ resultado.buy_order || resultado.commerceOrder }}</p>
          <p><strong>Monto pagado:</strong> ${{ resultado.amount }}</p>
          <p v-if="resultado.card_detail"><strong>Tarjeta:</strong> **** **** **** {{ resultado.card_detail.card_number }}</p>
          <p v-if="resultado.payment_type_code"><strong>Tipo de pago:</strong> {{ resultado.payment_type_code }}</p>
          <p v-if="resultado.authorization_code"><strong>Código de autorización:</strong> {{ resultado.authorization_code }}</p>
        </div>
    
        <div v-if="estado === 'cargando'" class="text-gray-500 mt-10">
          Procesando tu pago... ⏳
        </div>
    
        <div v-else-if="estado === 'rechazado'" class="text-yellow-600 mt-10">
          <p class="text-xl font-semibold mb-2">⚠️ Pago rechazado o no autorizado.</p>
          <p>Estado entregado por el medio de pago: <strong>{{ resultado.status }}</strong></p>
        </div>
    
        <div v-else-if="estado === 'error'" class="text-red-600 mt-10">
          <p class="text-xl font-semibold mb-2">❌ Error al procesar el pago 1.0</p>
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
    const token_ws = params.get('token_ws')
    const tbk_token = params.get('TBK_TOKEN')
    let buyOrder = params.get('TBK_ORDEN_COMPRA') || params.get('buy_order')
    if (!buyOrder && tbk_token) {
      buyOrder = localStorage.getItem('flow-order-id')
    }
    const form = JSON.parse(localStorage.getItem('formulario-seo') || '{}')

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
            detalles: data,
            estado: 'exito'
          }, form)
        } else {
          estado.value = 'rechazado'
          resultado.value = data
          await guardarEnFirebase(data.buy_order, {
            tipo: 'Flow',
            detalles: data,
            estado: 'rechazado'
          }, form)
        }
      } catch (err) {
        estado.value = 'error'
        resultado.value = { mensaje: 'Error técnico al confirmar el pago.' }
      }
    } else if (tbk_token) {
      estado.value = 'cargando'
      resultado.value = { mensaje: 'Consultando estado del pago...' }

      try {
        const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000'
        // Log para depuración de los datos enviados
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
          console.error('[❌ Error parseando JSON de Flow]', e)
        }

        if (res.ok && data?.status === 2) {
          estado.value = 'exito'
          resultado.value = { mensaje: '¡Pago aprobado!', ...data }
          await guardarEnFirebase(buyOrder, {
            tipo: 'Flow',
            detalles: data,
            estado: estado.value
          }, form)
        } else if (data?.status === 3) {
          estado.value = 'rechazado'
          resultado.value = { mensaje: 'Pago rechazado.', ...data }
          await guardarEnFirebase(buyOrder, {
            tipo: 'Flow',
            detalles: data,
            estado: estado.value
          }, form)
        } else if (data?.status === 4) {
          estado.value = 'anulado'
          resultado.value = { mensaje: 'Pago anulado por el usuario.', ...data }
          await guardarEnFirebase(buyOrder, {
            tipo: 'Flow',
            detalles: data,
            estado: estado.value
          }, form)
        } else {
          estado.value = 'error'
          resultado.value = { mensaje: 'Estado desconocido del pago.', ...data }
          console.error('[Flow][ERROR] Estado inesperado:', res.status, data)
        }
      } catch (err) {
        estado.value = 'error'
        resultado.value = { mensaje: 'Error consultando estado del pago.' }
        console.error('[Flow][ERROR]', err)
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