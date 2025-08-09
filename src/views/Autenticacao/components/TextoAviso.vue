<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
  erro: {
    type: Boolean,
    required: true,
  },
  posicao:{
    type: String,
    required: false,
  }
})
</script>
<template>
  <p :texto="props.texto" :class="[{ erro: props.erro }, 'aviso', props.posicao]">oi</p>
</template>

<style scoped lang="scss">
p.aviso {
  grid-column: 1 / 31;
  grid-row: 17 / 19;
  width: var(--largura-componentes);
  font-size: var(--texto-medio);
  text-align: left;
  justify-content: center;
  align-self: center;

  &.entrar{
      grid-row: 15 / 17;
  }
  &.erro {
    color: var(--vermelho);
  }
}
</style>
