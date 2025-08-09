<script setup lang="ts">
import CampoSenha from './components/inputs/CampoSenha.vue'
import CampoEmail from './components/inputs/CampoEmail.vue'
import LinkForm from './components/LinkForm.vue'
import TextoAviso from './components/TextoAviso.vue'
import ParteCima from './components/ParteCima.vue'
</script>

<template>
  <form>
    <ParteCima :rota="'/mapa-de-denuncias'" :ativo="true" />
    <div class="parte-baixa">
      <h2>Entre com sua conta</h2>
      <CampoEmail class="entrar" />
      <CampoSenha class="entrar" />
      <TextoAviso :posicao="'entrar'" :erro="false" :texto="'Entre'" />
      <label class="lembre checkbox-wrapper">
        <input type="checkbox" />
        <span class="checkmark"></span>
        <span class="texto">Lembre de mim</span>
      </label>
      <div class="acoes-form"><button>Entrar</button></div>
      <LinkForm :rota="'/recuperar-conta'" :texto="'Esqueceu a senha?'" />
      <LinkForm :rota="'/cadastro'" :texto="'Não tem uma conta?'" />
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

.lembre {
  width: var(--largura-componentes);
  font-size: var(--texto-pequeno);
  grid-column: 1 / 31;
  grid-row: 17 / 19;
  justify-self: center;
  align-self: left;
  display: flex;
  justify-content: left;
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
    width: 1.2rem;
    height: 1.2rem;
    border: 2px solid var(--cinza);
    border-radius: 3px;
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
    transform: rotate(45deg) scale(0.7) translateY(-1px) translateX(-1px);
    opacity: 1;
  }

  .texto {
    font-size: var(--texto-pequeno);
    color: var(--cinza);
  }
}
</style>
