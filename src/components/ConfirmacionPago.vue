<template>
  <div>
    <component :is="tipo === 'webpay' ? ConfirmacionWebpay : tipo === 'flow' ? ConfirmacionFlow : 'div'" />
    <div v-if="tipo === 'desconocido'" class="text-center py-20">
      <h1 class="text-2xl font-bold text-red-600 mb-4">No se pudo determinar el método de pago</h1>
      <p>Vuelve a intentarlo desde el checkout.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConfirmacionFlow from './ConfirmacionFlow.vue'
import ConfirmacionWebpay from './ConfirmacionWebpay.vue'

const tipo = ref(null)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('token_ws')) {
    tipo.value = 'webpay'
  } else if (params.get('token')) {
    tipo.value = 'flow'
  } else {
    tipo.value = 'desconocido'
  }
  console.log('[ConfirmacionPago] Tipo detectado:', tipo.value)
  console.log('[ConfirmacionPago] Parámetros URL:', Object.fromEntries(params.entries()))
})
</script>

<style scoped>
p {
  margin-bottom: 0.5rem;
}
</style>