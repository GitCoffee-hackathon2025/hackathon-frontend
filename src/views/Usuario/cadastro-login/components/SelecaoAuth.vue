<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
const router = useRouter()
const route = useRoute()
const rotaAtual = computed(() => route.path)
const rotaNova = ref<number>()
if (rotaAtual.value == '/usuario/cadastro') {
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

const SelecaoAuthAparece = computed(() => {
  return rotaAtual.value == '/usuario/recuperar-conta' ? false : true
})
</script>

<template>
  <div :class="['background-vidro', SelecaoAuthAparece ? '' : 'someSelecao']">
    <div :class="['selecionado', rotaNova == 1 ? 'cadastro' : 'entrar']"></div>
    <button type="button" @click="mudarRota(1)">Cadastro</button>
    <button type="button" @click="mudarRota(2)">Entrar</button>
  </div>
</template>

<style scoped lang="scss">
div {
  transform: translateY(0);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  &.background-vidro {
    z-index: 1;
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
      font-size: var(--texto-medio);
      color: var(--branco);
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
      background: var(--cinza);
      box-shadow: 0 0 4px 3px rgba(255, 255, 255, 0.25);
      position: absolute;
      z-index: 1;
      transition: left 0.3s;

      &.cadastro {
        left: 0.5rem;
      }

      &.entrar {
        left: calc(100% - 1rem - 9rem);
      }
    }
  }

  &.someSelecao {
    transform: translateY(100px);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.25);
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
  }
}
</style>
