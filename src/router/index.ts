import { createRouter, createWebHistory } from 'vue-router'
import MapaCrime from '@/views/MapaCrime.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mapa-de-crime',
    },
    {
      path: '/mapa-de-crime',
      component: MapaCrime,
    },
  ],
})

export default router
