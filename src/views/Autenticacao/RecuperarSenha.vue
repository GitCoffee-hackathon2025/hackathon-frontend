<script setup lang="ts">
import CampoEmail from './components/inputs/CampoEmail.vue'
import CampoTelefone from './components/inputs/CampoTelefone.vue'
import ParteCima from './components/ParteCima.vue'
</script>
<template>
  <form>
    <ParteCima :rota="'/mapa-de-denuncias'" :ativo="true"/>
    <div class="parte-baixa">
      <h2>Recupere sua conta</h2>
      <CampoTelefone class="recuperar-senha" />
      <p class="recuperar-senha">ou</p>
      <CampoEmail class="recuperar-senha" />
      <!-- Campo aparecerá quando usuário avança na recuperação
      <CampoDigitos />
      <CampoSenha />
      <CampoNovaSenha/> -->
      <div class="acoes-form">
        <router-link to="/entrar">Cancelar</router-link><button type="button">Avançar</button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

h3 {
  grid-column: 2 / 10;
  grid-row: 3 / 6;
  text-align: center;
  color: var(--cinza);
  font-size: var(--texto-medio);
}

.email {
  grid-column: 2 / 10;
  grid-row: 3 / 7;
}

.telefone {
  grid-column: 2 / 10;
  grid-row: 5 / 8;
}

p {
  margin: 0.3rem;
  color: var(--cinza);
  font-size: var(--texto-medio);
  grid-column: 2 / 10;
  grid-row: 5 / 6;
  justify-self: center;
  align-self: end;
}
</style>
