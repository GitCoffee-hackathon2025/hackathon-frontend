import { createRouter, createWebHistory } from 'vue-router'
import MapadeDenuncia from '@/views/Map/OcurrenceMap.vue'
import MapaDenunciasInicial from '@/views/Map/views/InitPage.vue'
import Configuracoes from '@/views/Config/ConfigPage.vue'
import Usuario from '@/views/User/UserPage.vue'
import SobreSite from '@/views/About/AboutPage.vue'
import NaoEncontrada from '@/views/PageNotFound.vue'
import { ROUTES } from './routes'

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
          name: ROUTES.occurrenceMap.init,
        },
        {
          path: 'fazer-denuncia',
          component: () => import('@/views/Map/views/OcurrenceForm.vue'),
          name: ROUTES.occurrenceMap.report,
        },
        {
          path: 'selecionar-localizacao',
          component: MapaDenunciasInicial,
          name: ROUTES.occurrenceMap.select,
        },
      ],
    },
    {
      path: '/configuracoes',
      component: Configuracoes,
      name: ROUTES.config.init,
    },
    {
      path: '/usuario',
      component: Usuario,
      name: ROUTES.user.init,
      children: [
        {
          path: 'conta',
          component: () => import('@/views/User/views/AccountManagement.vue'),
          meta: { titulo: 'Conta' },
          name: ROUTES.user.account,
        },
        {
          path: 'historico-de-denuncias',
          component: () => import('@/views/User/views/OcurrenceHistoric.vue'),
          meta: { titulo: 'Histórico de denúncias' },
          name: ROUTES.user.historic,
        },
        {
          path: 'termos-e-privacidade',
          component: () => import('@/views/User/views/TermsPrivacy.vue'),
          meta: { titulo: 'Termos e Privacidade' },
          name: ROUTES.user.termAndPrivacy,
        },
      ],
    },
    {
      path: '/cadastro',
      component: () => import('@/views/Auth/RegisterPage.vue'),
      name: ROUTES.auth.register,
    },
    {
      path: '/entrar',
      component: () => import('@/views/Auth/LoginPage.vue'),
      name: ROUTES.auth.login,
    },
    {
      path: '/recuperar-conta',
      component: () => import('@/views/Auth/RecoverPasswordPage.vue'),
      name: ROUTES.auth.recover,
    },
    {
      path: '/sobre-o-site',
      component: SobreSite,
      name: ROUTES.about.init,
    },
    {
      path: '/:pathMatch(.*)*',
      component: NaoEncontrada,
      name: ROUTES.misc.notFound,
    },
  ],
})

export default router
