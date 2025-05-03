<template>
  <section class="relative py-20 px-6 overflow-hidden" style="background: radial-gradient(ellipse at 70% 30%, #e0e7ff 0%, #f3e8ff 40%, #f1f5f9 100%);">
    <!-- Fondo tipo blob -->
    <div class="absolute inset-0 pointer-events-none select-none z-0">
      <div class="absolute left-[-10%] top-[30%] w-[700px] h-[400px] bg-pink-200 opacity-40 rounded-full blur-3xl" style="filter: blur(80px);"></div>
      <div class="absolute right-[-10%] top-[-20%] w-[900px] h-[600px] bg-blue-200 opacity-40 rounded-full blur-3xl" style="filter: blur(120px);"></div>
    </div>
    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
      <!-- Imagen a la izquierda -->
      <div class="h-full flex justify-center items-center">
        <img src="/img/ejemplo-negocio.webp" alt="Ilustración informe SEO sin tecnicismos" class="h-full w-auto object-contain rounded-none shadow-none" />
      </div>
      <!-- Texto a la derecha -->
      <div class="sm:text-center md:text-left">
        <h2 class="text-3xl font-bold mb-4 flex items-center gap-2 justify-center md:justify-start">
          <span role="img" aria-label="análisis sin tecnicismos" class="text-emerald-600 text-4xl">🧩</span>
          Análisis SEO Sin Tecnicismos: Diseñado para tu Negocio
        </h2>
        <p class="text-lg leading-relaxed max-w-xl mx-auto md:mx-0 mb-4">Nuestro informe está pensado para dueños de negocios, emprendedores y profesionales del marketing como tú.</p>
        <p class="text-lg leading-relaxed max-w-xl mx-auto md:mx-0 text-gray-700">Olvídate de informes complejos. Recibirás recomendaciones SEO que puedes entender fácilmente, discutir con tu equipo o pasar directamente a tu desarrollador. Obtén una visión clara del estado técnico de tu web y los pasos a seguir, sin perder tiempo.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Component logic can be added aquí si es necesario
</script> 