<script setup lang="ts">
import BarraNav from '@/components/NavBarra.vue'
import PaginaMapadeDenuncia from './views/MapadeDenuncias/PaginaMapadeDenuncia.vue';
</script>

<template>
  <div>
    <BarraNav/>
    <main>
      <PaginaMapadeDenuncia/>
    </main>
  </div>
</template>

<style scoped lang="scss">
main {
  width: 100%;
}
</style>
