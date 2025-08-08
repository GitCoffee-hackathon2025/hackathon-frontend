<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import CampoEmail from './components/inputs/CampoEmail.vue'
import CampoTelefone from './components/inputs/CampoTelefone.vue'
import CampoDigitos from './components/inputs/CampoDigitos.vue'
import CampoSenha from './components/inputs/CampoSenha.vue'
import CampoNovaSenha from './components/inputs/CampoNovaSenha.vue'
const animar = ref(false)

onMounted(() => {
  setTimeout(() => {
    animar.value = true
  }, 50)
})

onUnmounted(() => {
  setTimeout(() => {
    animar.value = false
  }, 50)
})

function mudarRota() {
  animar.value = false
  setTimeout(() => {
    router.push('/usuario/entrar')
  }, 300)
}
</script>
<template>
  <form :class="{ formSobe: animar }">
    <div class="parte-escura">
      <img class="montanha" src="./assets/mountain.svg" alt="" />
      <img class="ponto" src="./assets/point.svg" alt="" />
    </div>
    <div class="parte-branca">
      <h2>Recupere sua conta</h2>
      <h3>Digite seu telefone ou email</h3>
      <CampoEmail />
      <p>ou</p>
      <CampoTelefone />
      <!-- Campo aparecerá quando usuário avança na recuperação
      <CampoDigitos />
      <CampoSenha />
      <CampoNovaSenha/> -->
      <div class="acoes-form">
        <button type="button" @click="mudarRota">Cancelar</button
        ><button type="button">Avançar</button>
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
