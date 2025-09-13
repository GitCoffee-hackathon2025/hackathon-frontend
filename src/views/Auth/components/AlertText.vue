<script setup lang="ts">
import { defineProps } from 'vue'

const { text, position } = defineProps({
  text: String,
  position: String,
})
</script>

<template>
  <p :class="['alert', position, 'error']">{{ text }}</p>
</template>

<style scoped lang="scss">
p.alert {
  grid-column: 1 / 31;
  grid-row: 10 / 20;
  width: var(--largura-componentes);
  font-size: var(--texto-m);
  text-align: left;
  margin-top: 3rem;

  &.login {
    grid-row: 16 / 20;
  }

  &.error {
    color: var(--vermelho);
  }

  &.recover-password {
    grid-row: 12 / 20;
  }
}

@media (min-width: 576px) {
  p.alert.login {
    grid-row: 17 / 19;
  }
}
</style>
