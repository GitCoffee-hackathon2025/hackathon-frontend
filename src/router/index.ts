import { createRouter, createWebHistory } from 'vue-router'
import MapadeDenuncia from '@/views/MapadeDenuncias/MapaDenuncias.vue'
import MapaDenunciasInicial from '@/views/MapadeDenuncias/views/PaginaInicial.vue'
import Configuracoes from '@/views/Configuracoes/ConfigPage.vue'
import Usuario from '@/views/Usuario/PaginaUsuario.vue'
import SobreSite from '@/views/SobreSite/AboutPage.vue'
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
          component: () => import('@/views/MapadeDenuncias/views/FormularioDenuncia.vue'),
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
          component: () => import('@/views/Usuario/views/GerenciamentConta.vue'),
          meta: { titulo: 'Conta' },
        },
        {
          path: 'historico-de-denuncias',
          component: () => import('@/views/Usuario/views/HistoricoDenuncias.vue'),
          meta: { titulo: 'Histórico de denúncias' },
        },
        {
          path: 'termos-e-privacidade',
          component: () => import('@/views/Usuario/views/TermosPrivacidade.vue'),
          meta: { titulo: 'Termos e Privacidade' },
        },
      ],
    },
    {
      path: '/cadastro',
      component: () => import('@/views/Autenticacao/RotaCadastro.vue'),
    },
    {
      path: '/entrar',
      component: () => import('@/views/Autenticacao/RotaLogin.vue'),
    },
    {
      path: '/recuperar-conta',
      component: () => import('@/views/Autenticacao/RecuperarSenha.vue'),
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
