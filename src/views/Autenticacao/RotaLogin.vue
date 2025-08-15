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
    <div class="entradas">
      <h1>Entre com sua conta</h1>
      <CampoEmail class="entrar" />
      <CampoSenha class="entrar" />
      <TextoAviso :posicao="'entrar'" :erro="false" :texto="'Entre'" />
      <div class="caixa-lembre">
        <label class="lembre">
          <input type="checkbox" />
          <span class="checkmark"></span>
          <span class="texto">Lembre de mim</span>
        </label>
      </div>
      <div class="acoes-form"><button>Entrar</button></div>
      <LinkForm :rota="'/recuperar-conta'" :texto="'Esqueceu a senha?'" />
      <LinkForm :rota="'/cadastro'" :texto="'Não tem uma conta?'" />
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

div.caixa-lembre {
  grid-row: 15 / 18;
  grid-column: 1 / 31;
  width: var(--largura-componentes);
  justify-self: center;
  align-self: center;
  display: flex;
  justify-content: left;
  align-items: center;
  .lembre {
    font-size: var(--texto-m);
    user-select: none;
    color: var(--cinza);
    cursor: pointer;
    gap: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: left;

    input {
      cursor: pointer;
    }

    input[type='checkbox'] {
      display: none;
    }

    .checkmark {
      width: calc(var(--tamanho-icones) / 1.3);
      height: calc(var(--tamanho-icones) / 1.3);
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
      height: 1rem;
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
      font-size: var(--texto-m);
      color: var(--cinza);
    }
  }
}

@media (min-width: 576px) {
  div.caixa-lembre {
    grid-row: 16 / 17;
    grid-column: 1 / 31;

    .lembre {
      .checkmark::after {
        width: 0.7rem;
        height: 1.4rem;
      }
    }
  }
}

@media (min-width: 992px) {
  div.caixa-lembre {

    .lembre {
      .checkmark::after {
        width: 0.5rem;
        height: 1rem;
      }
    }
  }
}
</style>
