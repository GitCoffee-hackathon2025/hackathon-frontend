<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { ROUTES } from '@/router/routes'
import Loading from '@/components/LoadingScreen.vue'

import { AnimStore } from '@/store/AnimStore'
const anim = AnimStore()

const route = useRoute()
const HIDE_NAV = [
  ROUTES.auth.register,
  ROUTES.auth.login,
  ROUTES.auth.recover,
  ROUTES.misc.notFound,
] as const
 // se App.vue está em src/

</script>

<template>

  <NavBar v-if="!HIDE_NAV.includes(route.name as any)" />
  <router-view />
  <Loading v-if="anim.isLoading" />
</template>

<style lang="scss">
@use './assets/base.scss';
main {
  width: 100%;
}
#app.cvd-deuteranopia, .cvd-deuteranopia {
  -webkit-filter: url(#deuteranopia);
  filter: url(#deuteranopia);
}
#app.cvd-protanopia, .cvd-protanopia {
  -webkit-filter: url(#protanopia);
  filter: url(#protanopia);
}
#app.cvd-tritanopia, .cvd-tritanopia {
  -webkit-filter: url(#tritanopia);
  filter: url(#tritanopia);
}
#app.cvd-none, .cvd-none {
  -webkit-filter: none;
  filter: none;
}

</style>
