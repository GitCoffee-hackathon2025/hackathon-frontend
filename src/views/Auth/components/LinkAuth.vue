<script setup lang="ts">
import { AnimStore } from '@/store/AnimStore'
const animation = AnimStore()

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
    animation.animLogin = true
  }
  if (a == 'register') {
    animation.animRegister = true
  }
}
</script>

<template>
  <router-link @click="validAnim(props.anim)" :to="{ name: props.route }">{{
    props.text
  }}</router-link>
</template>

<style scoped lang="scss">
a {
  font-size: var(--text-sm);
  grid-column: 1 / 31;
  grid-row: 27 / 29;
  color: var(--color-gray-dark);
  text-decoration: underline;
  text-align: center;
  align-self: center;
  justify-content: center;

  &.recover-password {
    grid-row: 24 / 27;
  }
}
</style>
