<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataUserStore } from '@/store/dataUserStore'

const dataUserStore = useDataUserStore()
const mostrarSenha = ref(false)

// Computed sincronizado com a store
const password = computed({
  get: () => dataUserStore.userPassword,
  set: (val: string) => dataUserStore.userPassword = val
})

function toggleSenha() {
  mostrarSenha.value = !mostrarSenha.value
}
</script>

<template>
  <div class="campo">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <!-- ... ícone fixo ... -->
    </svg>

    <input :type="mostrarSenha ? 'text' : 'password'" placeholder="Senha..." v-model="password" />

    <!-- ícones de alternar senha -->
    <svg v-show="!mostrarSenha" @click="toggleSenha" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <!-- ícone olho fechado -->
    </svg>
    <svg v-show="mostrarSenha" @click="toggleSenha" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <!-- ícone olho aberto -->
    </svg>
  </div>
</template>

<style scoped lang="scss">
@import url('../../../../assets/inputs.scss');

div {
  grid-column: 1 / 31;
  &.entrar {
    grid-row: 12 / 16;
  }
}
</style>
