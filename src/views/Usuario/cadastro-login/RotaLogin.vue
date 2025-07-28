<script setup lang="ts">
import CampoSenha from './components/inputs/CampoSenha.vue'
import CampoEmail from './components/inputs/CampoEmail.vue'
</script>

<template>
  <form>
    <div class="parte-escura">
      <img class="montanha" src="./assets/mountain.svg" alt="" />
      <img class="ponto" src="./assets/point.svg" alt="" />
    </div>
    <div class="parte-branca">
      <h2>Entre com sua conta</h2>
      <CampoEmail />
      <CampoSenha />
      <router-link to="/usuario/recuperar-conta" class="esquecisenha"
        >Esqueceu a senha?</router-link
      >
      <label class="lembre checkbox-wrapper">
        <input type="checkbox" />
        <span class="checkmark"></span>
        <span class="texto">Lembre de mim</span>
      </label>
      <div class="acoes-form"><button>Entrar</button></div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

.esquecisenha {
  grid-row: 6 / 7;
  grid-column: 2 / 5;
  justify-self: center;
  align-self: end;

  color: var(--cinza);
  text-decoration: underline;
  font-size: var(--texto-pequeno);
}

.lembre {
  font-size: var(--texto-pequeno);
  grid-column: 7 / 10;
  grid-row: 6 / 7;
  justify-self: center;
  align-self: end;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  color: var(--cinza);
  cursor: pointer;
  gap: 0.5rem;

  input {
    cursor: pointer;
  }

  input[type='checkbox'] {
    display: none;
  }

  .checkmark {
    width: 1.6rem;
    height: 1.6rem;
    border: 2px solid var(--cinza);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--branco);
    transition: all 0.2s ease-in-out;
    position: relative;
  }

  .checkmark::after {
    content: '';
    width: 0.5rem;
    height: 1.1rem;
    border: solid var(--branco);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    opacity: 0;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    position: absolute;
  }

  input[type='checkbox']:checked + .checkmark {
    background-color: var(--cinza);
  }

  input[type='checkbox']:checked + .checkmark::after {
    transform: rotate(45deg) scale(1) translateY(-1px) translateX(-1px);
    opacity: 1;
  }

  .texto {
    font-size: var(--texto-pequeno);
    color: var(--cinza);
  }
}

.email {
  grid-column: 2 / 10;
  grid-row: 3 / 5;
}

.senha {
  grid-column: 2 / 10;
  grid-row: 5 / 6;
}
</style>
