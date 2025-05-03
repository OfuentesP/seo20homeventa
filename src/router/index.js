import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../Home.vue')
  },
  {
    path: '/solicitud',
    name: 'Formulario',
    component: () => import('../components/FormularioSolicitud.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../components/Checkout.vue')
  },
  {
    path: '/confirmacion',
    name: 'ConfirmacionPago',
    component: () => import('../components/ConfirmacionPago.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: {
      template: `<div class="p-12 text-center text-xl text-red-600 font-bold">Página no encontrada</div>`
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router