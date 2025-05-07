<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <div v-if="loading" class="text-center py-12">
      <span class="text-emerald-600 text-3xl">⏳</span>
      <p class="mt-4 text-lg font-semibold">Procesando tu pago...</p>
    </div>
    <div v-else>
      <div v-if="status === 'success'" class="bg-emerald-100 border border-emerald-300 rounded-lg p-6 text-center">
        <span class="text-emerald-600 text-4xl">✅</span>
        <h2 class="text-2xl font-bold mt-2 mb-2">¡Pago confirmado!</h2>
        <p class="mb-2">Tu informe SEO será enviado a tu correo en menos de 24 horas hábiles.</p>
        <p class="text-sm text-gray-600">Orden: <span class="font-mono">{{ orderId || buyOrder }}</span></p>
      </div>
      <div v-else-if="status === 'cancelled'" class="bg-yellow-100 border border-yellow-300 rounded-lg p-6 text-center">
        <span class="text-yellow-600 text-4xl">⚠️</span>
        <h2 class="text-2xl font-bold mt-2 mb-2">Pago cancelado</h2>
        <p>Tu pago fue anulado o cancelado. Si fue un error, puedes intentarlo nuevamente.</p>
      </div>
      <div v-else class="bg-red-100 border border-red-300 rounded-lg p-6 text-center">
        <span class="text-red-600 text-4xl">❌</span>
        <h2 class="text-2xl font-bold mt-2 mb-2">Error en el pago</h2>
        <p>Ocurrió un problema al procesar tu pago. Si ya se descontó el monto, contáctanos.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const paymentMethod = ref('');
const status = ref('');
const orderId = ref('');
const buyOrder = ref('');
const loading = ref(true);

onMounted(async () => {
  const url = new URL(window.location.href);
  let pm = url.searchParams.get('method');
  let st = url.searchParams.get('status');
  let oid = url.searchParams.get('orderId');
  let bo = url.searchParams.get('buyOrder');

  // Si viene token_ws, procesar confirmación Webpay
  if (url.searchParams.has('token_ws')) {
    try {
      const res = await fetch('/api/webpay/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_ws: url.searchParams.get('token_ws') })
      });
      if (res.ok) {
        const data = await res.json();
        pm = 'webpay';
        st = ['AUTHORIZED','SUCCESS'].includes(data.status) ? 'success'
             : ['ANULADA','CANCELED'].includes(data.status) ? 'cancelled'
             : 'error';
        bo = data.buy_order;
      } else {
        pm = 'webpay';
        st = 'error';
      }
    } catch (e) {
      pm = 'webpay';
      st = 'error';
    }
  }

  if (!pm || !st) {
    window.location.href = '/es/checkout';
    return;
  }

  paymentMethod.value = pm;
  status.value = st;
  orderId.value = oid || '';
  buyOrder.value = bo || '';
  loading.value = false;
});
</script>
