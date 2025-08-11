<script setup lang="ts">
import NavLogin from '@/views/Usuario/cadastro-login/components/SelecaoAuth.vue'
</script>

<template>
  <div class="box-cadastro-login">
    <NavLogin />
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
div.box-cadastro-login {
  display: flex;
  align-items: baseline;
  justify-content: baseline;
  flex-direction: column;
  gap: 1.6rem;
}
</style>
