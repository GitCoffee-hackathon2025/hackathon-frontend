<script setup lang="ts">
import { defineProps } from 'vue'
import {AnimsStore } from '@/store/AnimsStore'
const anims = AnimsStore()

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  anim: {
    type: String,
  },
})

function validAnim(a: string | undefined) {
  if (!a) return

  if (a == 'login') {
    anims.animLogin = true
  }
  if (a == 'register') {
    anims.animRegister = true
  }
}
</script>

<template>
  <router-link @click="validAnim(props.anim)" :to="props.route">{{ props.text }}</router-link>
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

  &.recover-password {
    grid-row: 24 / 27;
  }
}
</style>
