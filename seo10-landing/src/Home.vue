<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-slate-900 text-white py-20 text-center px-6">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Informe SEO por solo $10</h1>
      <p class="text-lg md:text-xl mb-8">Impulsa tu sitio con mejoras reales y recomendaciones claras</p>
      <router-link to="/solicitud" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition">Solicita tu informe</router-link>
    </section>

    <!-- Beneficios Clave -->
    <section class="py-16 bg-white text-gray-800 px-6">
      <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 class="text-xl font-bold mb-2">✅ Precio fijo</h3>
          <p>Solo $10 USD, sin costos ocultos ni cobros mensuales.</p>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-2">⚡ Entrega rápida</h3>
          <p>En 1 día hábil analizamos tu sitio y enviamos el informe por correo.</p>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-2">📊 Resultados accionables</h3>
          <p>Te entregamos un PDF con mejoras claras, priorizadas y entendibles.</p>
        </div>
      </div>
    </section>

    <!-- ¿Qué incluye el informe? -->
    <section class="bg-slate-100 py-16 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">¿Qué incluye el informe?</h2>
        <ul class="text-left space-y-3 max-w-md mx-auto">
          <li>🔍 Revisión técnica SEO del sitio</li>
          <li>🚀 Análisis de velocidad y Core Web Vitals</li>
          <li>🧠 Evaluación de títulos, descripciones y estructura</li>
          <li>🛠️ Sugerencias de mejora priorizadas</li>
        </ul>
      </div>
    </section>

    <!-- ¿Por qué elegirnos? -->
    <section class="py-16 bg-white px-6 text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
        <p class="text-lg">Somos desarrolladores y especialistas en SEO técnico. Analizamos tu sitio con herramientas reales como Lighthouse, Core Web Vitals, metadatos y sitemap. Sin humo ni promesas vacías. Recibes un informe directo, claro y útil.</p>
      </div>
    </section>

    <!-- Preguntas Frecuentes -->
    <section class="py-16 bg-white px-6">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-6 text-center">Preguntas Frecuentes</h2>
        <div class="space-y-4">
          <details class="group border rounded p-4">
            <summary class="cursor-pointer font-semibold text-lg flex justify-between items-center">
              ¿Cómo funciona?
              <span class="ml-2 transform transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <p class="mt-2">Simple. Llenas el formulario, analizamos tu sitio, y te enviamos un informe claro y útil directamente a tu correo.</p>
          </details>
          <details class="group border rounded p-4">
            <summary class="cursor-pointer font-semibold text-lg flex justify-between items-center">
              ¿Cuánto se demora?
              <span class="ml-2 transform transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <p class="mt-2">1 día hábil. Te avisamos apenas esté listo.</p>
          </details>
          <details class="group border rounded p-4">
            <summary class="cursor-pointer font-semibold text-lg flex justify-between items-center">
              ¿Qué secciones trae el informe?
              <span class="ml-2 transform transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <p class="mt-2">Velocidad, estructura técnica, metadatos, accesibilidad, sugerencias prácticas de mejora y resumen de prioridades.</p>
          </details>
          <details class="group border rounded p-4">
            <summary class="cursor-pointer font-semibold text-lg flex justify-between items-center">
              ¿Qué revisamos?
              <span class="ml-2 transform transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <p class="mt-2">Principalmente el <strong>home</strong> de tu sitio web, donde suele estar el mayor impacto SEO. Si deseas revisar otra sección específica, indícalo en el formulario.</p>
          </details>
          <details class="group border rounded p-4">
            <summary class="cursor-pointer font-semibold text-lg flex justify-between items-center">
              ¿Y si no me llega el informe?
              <span class="ml-2 transform transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <p class="mt-2">Escríbenos a <a href="mailto:hola@seo10.dev" class="text-emerald-600 font-semibold">hola@seo10.dev</a> y lo solucionamos de inmediato.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="bg-emerald-600 text-white py-20 text-center px-6">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">¿Listo para mejorar tu posicionamiento?</h2>
      <p class="mb-8">Solicita tu informe SEO y recibe tu diagnóstico en 24h hábiles directo en tu correo.</p>
      <router-link to="/solicitud" class="bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
        Obtener informe por $10
      </router-link>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-100 text-center py-6 text-sm text-gray-500">
      <p>&copy; 2025 SEO10.dev — Todos los derechos reservados.</p>
      <p>Contacto: <a href="mailto:hola@seo10.dev" class="text-emerald-600">hola@seo10.dev</a></p>
    </footer>
  </div>
</template>

<script setup>
// No se requiere lógica adicional por el momento
</script>