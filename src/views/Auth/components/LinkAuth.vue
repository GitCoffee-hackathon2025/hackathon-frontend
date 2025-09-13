<script setup lang="ts">
import { defineProps } from 'vue'
import { AnimsAuthStore } from '@/store/AnimsStore'
const animsAuth = AnimsAuthStore()

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
    animsAuth.animLogin = true
  }
  if (a == 'register') {
    animsAuth.animRegister = true
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
