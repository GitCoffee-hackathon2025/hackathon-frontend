<script setup lang="ts">
import { computed } from 'vue'
import { useDataUserStore } from '@/store/dataUserStore'

const dataUserStore = useDataUserStore()

const email = computed({
  get: () => dataUserStore.userEmail,
  set: (value: string) => { dataUserStore.userEmail = value }
})
</script>

<template>
  <div class="campo">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
      />
    </svg>
    <input type="email" placeholder="Email..." v-model="email" />
  </div>
</template>

<style scoped lang="scss">
@import '../../../../assets/inputs.scss';

div {
  grid-column: 1 / 31;

  &.cadastro {
    grid-row: 14 / 19;
  }

  &.entrar {
    grid-row: 9 / 13;
  }

  &.recuperar-senha {
    grid-row: 12 / 17;
  }
}
</style>
