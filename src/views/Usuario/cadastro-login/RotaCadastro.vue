<script setup lang="ts">
import CampoEmail from './components/inputs/CampoEmail.vue'
import CampoDataNascimento from './components/inputs/CampoDataNascimento.vue'
import CampoTelefone from './components/inputs/CampoTelefone.vue'
import CampoDigitos from './components/inputs/CampoDigitos.vue'
</script>

<template>
  <form>
    <div class="parte-escura">
      <img class="montanha" src="./assets/mountain.svg" alt="" />
      <img class="ponto" src="./assets/point.svg" alt="" />
    </div>
    <div class="parte-branca">
      <h2>Crie sua conta</h2>
      <CampoDataNascimento />
      <CampoEmail />
      <!-- Campo aparecerá quando usuário avança no cadastro <CampoDigitos /> -->
      <p>ou</p>
      <CampoTelefone />
      <div class="acoes-form">
        <!-- Botão aparecer quando usuário avança no cadastro <button>Cancelar</button> --><button>
          Avançar
        </button>
      </div>
      <!-- Onde as mensagens de erro aparecem ->  <p></p>-->
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

.datanascimento {
  grid-column: 2 / 10;
  grid-row: 3 / 4;
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

.otp-container {
  grid-column: 2 / 10;
  grid-row: 3 / 7;
}
</style>
