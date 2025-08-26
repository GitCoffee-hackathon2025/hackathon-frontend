<script setup lang="ts">
import NavBarra from '@/components/NavBarra.vue'
</script>

<template>
  <NavBarra />
  <router-view></router-view>
</template>

<style lang="scss">
@import './assets/base.scss';
main {
  width: 100%;
}
</style>
