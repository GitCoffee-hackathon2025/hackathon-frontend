import { createRouter, createWebHistory } from 'vue-router'
import MapadeDenuncia from '@/views/MapadeDenuncias/MapaDenuncias.vue'
import MapaDenunciasInicial from '@/views/MapadeDenuncias/views/PaginaInicial.vue'
import Configuracoes from '@/views/Configuracoes/PaginaConfiguracoes.vue'
import Usuario from '@/views/Usuario/PaginaUsuario.vue'
import SobreSite from '@/views/SobreSite/PaginaSobreSite.vue'
import NaoEncontrada from '@/views/PaginaNaoEncontrada.vue'

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
      ],
    },
    {
      path: '/configuracoes',
      component: Configuracoes,
      redirect: '/configuracoes/pagina-inicial',
      children: [],
    },
    {
      path: '/usuario',
      component: Usuario,
      redirect: {},
      children: [],
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
      redirect: '/sobre-o-site/pagina-inicial',
      children: [],
    },
    {
      path: '/:pathMatch(.*)*',
      component: NaoEncontrada,
    },
  ],
})

export default router
