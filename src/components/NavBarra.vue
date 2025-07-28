<script setup lang="ts">
import { ref } from 'vue'
const isExpanse = ref<boolean>(false)
function openBar() {
  isExpanse.value = !isExpanse.value
}
</script>

<template>
  <nav @mouseover="openBar" @mouseout="openBar" :class="['container-nav', { isExpanse }]">
    <ul class="icons">
      <li>
        <img src="../assets/iconeconfiguracao.svg" alt="" />
        <p :class="{ visible: isExpanse }">Configurações</p>
      </li>
      <li>
        <img src="../assets/iconeusuario.svg" alt="" />
        <p :class="{ visible: isExpanse }">Usuário</p>
      </li>
      <li>
        <img src="../assets/iconemapa.svg" alt="" />
        <p :class="{ visible: isExpanse }">Mapa de denúncias</p>
      </li>
      <li class="icone-informacao">
        <img src="../assets/iconeinformacao.svg" alt="" />
        <p :class="{ visible: isExpanse }">Sobre o site</p>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.container-nav {
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--preto);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 4.6rem;
  transition: width 0.3s ease;
  overflow: hidden;

  &.isExpanse {
    width: 16rem;
  }

  .icons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 1.2rem;
  width: 100%;
  height: 100%;
  gap: 3rem;
  padding-top: 2rem;
  padding-bottom: 2rem;

  li {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    position: relative;
    width: 100%;

    img {
      width: 2rem;
      color: white;
      cursor: pointer;
    }

    p {
      color: white;
      opacity: 0;
      transform: translateX(1vw);
      transition: opacity 0.3s ease, transform 0.3s ease;
      white-space: nowrap;

      &.visible {
        opacity: 1;
        transform: translateX(1vw);
      }
    }

    &.icone-informacao {
      margin-top: auto;
    }
  }
}

}
</style>
