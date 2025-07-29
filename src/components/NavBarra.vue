<script setup lang="ts">
import { ref } from 'vue'
const navExpandida = ref<boolean>(false)
function openBar() {
  navExpandida.value = !navExpandida.value
}
</script>

<template>
  <header>
    <nav @mouseover="openBar" @mouseout="openBar" :class="[{ navExpandida: navExpandida }]">
      <ul>
        <li>
          <router-link to="/configuracoes">
            <img src="../assets/iconeconfiguracao.svg" alt="" />
            <p :class="{ linkVisivel: navExpandida }">Configurações</p></router-link
          >
        </li>
        <li>
          <router-link to="/usuario">
            <img src="../assets/iconeusuario.svg" alt="" />
            <p :class="{ linkVisivel: navExpandida }">Usuário</p></router-link
          >
        </li>
        <li>
          <router-link to="/mapa-de-crime">
            <img src="../assets/iconemapa.svg" alt="" />
            <p :class="{ linkVisivel: navExpandida }">Mapa de denúncias</p></router-link
          >
        </li>
        <li class="icone-informacao">
          <router-link to="/sobre-o-site">
            <img src="../assets/iconeinformacao.svg" alt="" />
            <p :class="{ linkVisivel: navExpandida }">Sobre o site</p></router-link
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  nav {
    position: fixed;
    top: 2.5vh;
    left: 2.5vh;
    height: 95vh;
    width: 5.4rem;
    border-radius: 1.25rem;
    background: rgba(29, 30, 28, 0.54);
    box-shadow: 0 0 20px 0 rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s ease;
    overflow: hidden;

    &.navExpandida {
      width: 16rem;
    }

    ul {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding-left: calc(
        2.7rem - 1.125rem
      ); // Cálculo do tamanho da nav e da metade do tamanho da imagem de cada link
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      padding-bottom: 2rem;
      gap: 3rem;

      li {
        a {
          text-decoration: none;
          display: flex;
          align-items: center;
          color: var(--branco);
          position: relative;
          gap: 1.3rem;

          img {
            width: 2.25rem;
            cursor: pointer;
          }

          p {
            font-size: var(--texto-medio);
          }

          h1 {
            font-size: var(--texto-grande);
          }

          p,
          h1 {
            opacity: 0;
            transition:
              opacity 0.3s ease,
              transform 0.3s ease;
            white-space: nowrap;

            &.linkVisivel {
              opacity: 1;
            }
          }
        }

        &.icone-informacao {
          margin-top: auto; //Empurra pra baixo
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
