import { createRouter, createWebHistory } from 'vue-router'
import MapadeDenuncia from '@/views/Map/OcurrenceMap.vue'
import MapaDenunciasInicial from '@/views/Map/views/InitPage.vue'
import Configuracoes from '@/views/Config/ConfigPage.vue'
import Usuario from '@/views/User/UserPage.vue'
import SobreSite from '@/views/About/AboutPage.vue'
import NaoEncontrada from '@/views/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mapa-de-denuncias',
    },
    {
      path: '/mapa-de-denuncias',
      component: MapadeDenuncia,

      children: [
        {
          path: '',
          component: MapaDenunciasInicial,
        },
        {
          path: 'fazer-denuncia',
          component: () => import('@/views/Map/views/OcurrenceForm.vue'),
        },
        {
          path: 'selecionar-localizacao',
          component: MapaDenunciasInicial,
        },
      ],
    },
    {
      path: '/configuracoes',
      component: Configuracoes,
    },
    {
      path: '/usuario',
      component: Usuario,
      children: [
        {
          path: 'conta',
          component: () => import('@/views/User/views/AccountManagement.vue'),
          meta: { titulo: 'Conta' },
        },
        {
          path: 'historico-de-denuncias',
          component: () => import('@/views/User/UserPage.vue'),
          meta: { titulo: 'Histórico de denúncias' },
        },
        {
          path: 'termos-e-privacidade',
          component: () => import('@/views/User/views/TermsPrivacy.vue'),
          meta: { titulo: 'Termos e Privacidade' },
        },
      ],
    },
    {
      path: '/cadastro',
      component: () => import('@/views/Auth/RegisterPage.vue'),
    },
    {
      path: '/entrar',
      component: () => import('@/views/Auth/LoginPage.vue'),
    },
    {
      path: '/recuperar-conta',
      component: () => import('@/views/Auth/RecoverPasswordPage.vue'),
    },
    {
      path: '/sobre-o-site',
      component: SobreSite,
    },
    {
      path: '/:pathMatch(.*)*',
      component: NaoEncontrada,
    },
  ],
})

export default router
