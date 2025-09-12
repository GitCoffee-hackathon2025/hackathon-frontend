<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

</script>

<template>
  <NavBar />
  <router-view></router-view>
</template>

<style lang="scss">
@use './assets/base.scss';
main {
  width: 100%;
}
</style>
