<script setup lang="ts">
import { defineProps } from 'vue'

const { texto, erro, posicao } = defineProps({
  texto: String,
  erro: Boolean,
  posicao: String
})
</script>

<template>
  <p :class="['aviso', posicao, { 'erro': erro }]">{{ texto }}</p>
</template>

<style scoped lang="scss">
p.aviso {
  grid-column: 1 / 31;
  grid-row: 17 / 20;
  width: var(--largura-componentes);
  font-size: var(--texto-m);
  text-align: left;
  margin-top: 3rem;

  &.entrar {
    grid-row: 16 / 20;
  }

  &.erro {
    color: var(--vermelho);
  }
}

@media (min-width: 576px) {
  p.aviso.entrar {
    grid-row: 17 / 19;
  }
}
</style>
