<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const rotaAtual = useRoute().path
const rotaNova = ref<number>()
if (rotaAtual == '/usuario/cadastro') {
  rotaNova.value = 1
} else {
  rotaNova.value = 2
}

function mudarRota(rota: number): void {
  switch (rota) {
    case 1:
      router.push('/usuario/cadastro')
      rotaNova.value = 1
      break

    case 2:
      router.push('/usuario/entrar')
      rotaNova.value = 2
      break
  }
}
</script>

<template>
  <div class="background-vidro">
    <div :class="['selecionado', rotaNova == 1 ? 'cadastro' : 'entrar']"></div>
    <button type="button" @click="mudarRota(1)">Cadastro</button>
    <button type="button" @click="mudarRota(2)">Entrar</button>
  </div>
</template>

<style scoped lang="scss">
div.background-vidro {
  width: 23rem;
  height: 4.5rem;
  flex-shrink: 0;
  border-radius: 4rem;
  border: 3px solid rgba(255, 255, 255, 0.5);
  background: rgba(77, 77, 77, 0.1);
  box-shadow: 0 2px 2px 1px rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(17.5px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 0;
  padding: 0 0.5rem 0 0.5rem;

  button {
    color: #f8f6f2;
    text-align: center;
    font-family: inherit;
    width: 9.5rem;
    height: 3.5rem;
    background-color: transparent;
    z-index: 2;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4rem;
  }

  .selecionado {
    width: 9.5rem;
    height: 3.5rem;
    border-radius: 4rem;
    background: #1d1e1c;
    box-shadow: 0 0 4px 3px rgba(255, 255, 255, 0.25);
    position: absolute;
    z-index: 1;
    transition: left 0.3s ;

    &.cadastro {
      left: 0.5rem;
    }

    &.entrar {
      left: calc(100% - 1rem - 9rem);
    }
  }
}
</style>
