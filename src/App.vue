<script setup lang="ts">
import BarraNav from '@/components/NavBarra.vue'
</script>

<template>
  <header><BarraNav /></header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped lang="scss">
header {
  width: auto;
}
main {
  width: 100%;
}
</style>
