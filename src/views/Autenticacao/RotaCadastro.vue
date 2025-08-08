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
      <!-- Onde as mensagens de erro aparecem -->
      <p class="aviso">Digite seu email</p>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

.datanascimento {
  grid-column: 1 / 31;
  grid-row: 7 / 9;
}
.email {
  grid-column: 1 / 31;
  grid-row: 11 / 13;
}

.telefone {
  grid-column: 1 / 31;
  grid-row: 8 / 10;
}

p {
  margin: 0.3rem;
  color: var(--cinza);
  font-size: var(--texto-medio);
  grid-column: 1 / 31;
  grid-row: 10 / 11;
  justify-self: center;
  align-self: center;
}

.otp-container {
  grid-column: 1 / 31;
  grid-row: 16 / 17;
}

.aviso {
  grid-row: 14 / 15;
}
</style>
