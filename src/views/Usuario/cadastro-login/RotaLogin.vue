<script setup lang="ts">
import CampoDataNascimento from './components/inputs/CampoDataNascimento.vue';
import CampoEmail from './components/inputs/CampoEmail.vue';
</script>

<template>
  <form>
    <div class="parte-escura">
      <img class="montanha" src="./assets/mountain.svg" alt="" />
      <img class="ponto" src="./assets/point.svg" alt="" />
    </div>
    <div class="parte-branca">
      <h2>Entre com sua conta</h2>
      <CampoEmail/>
      <div class="acoes-form"><button>Entrar</button></div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');
</style>
