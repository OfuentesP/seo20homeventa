<template>
    <div class="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 class="text-3xl font-bold mb-4" v-if="resultado?.status === 'AUTHORIZED'">✅ ¡Pago confirmado!</h1>
      <h1 class="text-3xl font-bold mb-4" v-else-if="resultado">❌ Estado: {{ resultado.status }}</h1>
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
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  
  const estado = ref('cargando')
  const resultado = ref(null)
  
  onMounted(async () => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token_ws')
  
    if (!token) {
      estado.value = 'error'
      resultado.value = { mensaje: 'Token de pago no encontrado en la URL.' }
      return
    }
  
    try {
      const apiBase = import.meta.env.PROD ? '' : 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/webpay/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_ws: token })
      })
  
      const data = await res.json()
  
      if (res.ok && data.status === 'AUTHORIZED') {
        estado.value = 'exito'
        resultado.value = data
      } else {
        estado.value = 'rechazado'
        resultado.value = data
      }
    } catch (err) {
      console.error('[❌ Error en confirmación Webpay]', err)
      estado.value = 'error'
      resultado.value = { mensaje: 'Error técnico al confirmar el pago.' }
    }
  })
  </script>
  
  <style scoped>
  p {
    margin-bottom: 0.5rem;
  }
  </style>