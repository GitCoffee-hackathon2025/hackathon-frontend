import { createRouter, createWebHistory } from 'vue-router'
import MapadeDenuncia from '@/views/MapadeDenuncias/PaginaMapadeDenuncia.vue'
import Configuracoes from '@/views/Configuracoes/PaginaConfiguracoes.vue'
import Usuario from '@/views/Usuario/PaginaUsuario.vue'
import SobreSite from '@/views/SobreSite/PaginaSobreSite.vue'
import NaoEncontrada from '@/views/PaginaNaoEncontrada.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mapa-de-crime',
    },
    {
      path: '/mapa-de-crime',
      component: MapadeDenuncia,
      children: [],
    },
    {
      path: '/configuracoes',
      component: Configuracoes,
      redirect: {},
      children: [],
    },
    {
      path: '/usuario',
      component: Usuario,
      redirect: {},
      children: [],
    },
    {
      path: '/sobre-o-site',
      component: SobreSite,
      redirect: {},
      children: [],
    },
    {
      path: '/:pathMatch(.*)*',
      component: NaoEncontrada,
    },
  ],
})


export default router
