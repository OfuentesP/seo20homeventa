<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-6 text-center">Solicita tu Informe SEO</h1>
    <form @submit.prevent="enviarFormulario" class="space-y-6">
      <div>
        <label class="block mb-1 font-medium">Nombre y Apellido</label>
        <input v-model="form.nombre" type="text" required class="w-full border rounded px-4 py-2" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Sitio Web a Analizar</label>
        <input v-model="form.sitio" type="url" required placeholder="https://" class="w-full border rounded px-4 py-2" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Nombre de la Empresa <span class="text-gray-400">(opcional)</span></label>
        <input v-model="form.empresa" type="text" class="w-full border rounded px-4 py-2" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Cargo en la Empresa <span class="text-gray-400">(opcional)</span></label>
        <input v-model="form.cargo" type="text" class="w-full border rounded px-4 py-2" />
      </div>

      <div class="text-center">
        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  nombre: '',
  sitio: '',
  empresa: '',
  cargo: ''
})

function enviarFormulario() {
  // ✅ Guarda datos en localStorage para que el checkout los use
  localStorage.setItem('formulario-seo', JSON.stringify(form.value))

  // ✅ Redirige al paso de resumen antes del pago
  router.push('/checkout')
}
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>