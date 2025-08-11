<script setup lang="ts">
import BarraNav from '@/components/NavBarra.vue'
import DadosBairros from './components/DadosBairros.vue';
import PaginaMapadeDenuncia from './views/MapadeDenuncias/PaginaMapadeDenuncia.vue';
</script>

<template>
  <div>
    <BarraNav/>
    <main>
      <DadosBairros />
      <PaginaMapadeDenuncia/>
    </main>
  </div>
</template>

<style scoped lang="scss">
main {
  width: 100%;
}
</style>
