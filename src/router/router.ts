import  PaginaInicialView  from '@/views/PaginaInicialView.vue';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PaginaInicialView,
    },
  ],
})

export default router
