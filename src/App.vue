<script setup lang="ts">
import BarraNav from '@/components/NavBarra.vue'
</script>

<template>
  <BarraNav/>
  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
}
</style>
