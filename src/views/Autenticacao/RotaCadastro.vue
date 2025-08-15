<script setup lang="ts">
import CampoEmail from './components/inputs/CampoEmail.vue'
import CampoDataNascimento from './components/inputs/CampoDataNascimento.vue'
import CampoTelefone from './components/inputs/CampoTelefone.vue'
import LinkForm from './components/LinkForm.vue'
import TextoAviso from './components/TextoAviso.vue'
import ParteCima from './components/ParteCima.vue'
</script>

<template>
  <form>
    <ParteCima :rota="'/mapa-de-denuncias'" :ativo="true"/>
    <div class="entradas">
      <h1>Crie sua conta</h1>
      <CampoDataNascimento />
      <CampoEmail class="cadastro" />
      <!-- Campo aparecerá quando usuário avança no cadastro <CampoDigitos /> -->
      <p>ou</p>
      <CampoTelefone class="cadastro" />
      <TextoAviso :texto="'Entre com seu email'" :erro="false" />
      <div class="acoes-form">
        <!-- Botão aparecer quando usuário avança no cadastro <button>Cancelar</button> --><button>
          Avançar
        </button>
      </div>
      <!-- Onde as mensagens de erro aparecem -->
      <LinkForm :texto="'Ja tem tem uma conta?'" :rota="'/entrar'" />
    </div>
  </form>
</template>

<style lang="scss">
@import url('./assets/logincadastro.scss');
</style>
