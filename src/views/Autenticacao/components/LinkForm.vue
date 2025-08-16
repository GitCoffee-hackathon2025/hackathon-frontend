<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
  rota: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <router-link :class="{'mais-perto-botao': props.rota == '/recuperar-conta'}" :to="props.rota">{{
    props.texto
  }}</router-link>
</template>

<style scoped lang="scss">
a {
  font-size: var(--texto-p);
  grid-column: 1 / 31;
  grid-row: 27 / 29;
  color: var(--cinza);
  text-decoration: underline;
  text-align: center;
  align-self: center;
  justify-content: center;

  &.mais-perto-botao{
    grid-row: 24 / 27;
  }
}
</style>
