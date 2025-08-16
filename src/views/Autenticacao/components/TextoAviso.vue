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
  posicao: {
    type: String,
    required: false,
  },
})
</script>
<template>
  <p :texto="props.texto" :class="[{ erro: props.erro }, 'aviso', props.posicao]">oi</p>
</template>

<style scoped lang="scss">
p.aviso {
  grid-column: 1 / 31;
  grid-row: 17 / 20;
  width: var(--largura-componentes);
  font-size: var(--texto-m);
  text-align: left;
  justify-content: center;
  align-self: center;
  margin: 0;

  &.entrar {
    grid-row: 16 / 20;
  }
  &.erro {
    color: var(--vermelho);
  }
}

@media (min-width: 576px) {
  p.aviso {
    &.entrar {
      grid-row: 17 / 19;
    }
  }
}
</style>
