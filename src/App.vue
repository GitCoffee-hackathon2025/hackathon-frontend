<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { ROUTES } from '@/router/routes'
import Loading  from "@/components/LoadingScreen.vue";

import {AnimsStore  } from "@/store/AnimsStore";
const anims = AnimsStore()

const route = useRoute()
const HIDE_NAV = [ROUTES.auth.register, ROUTES.auth.login, ROUTES.auth.recover, ROUTES.misc.notFound] as const
</script>

<template>
  <NavBar v-if="!HIDE_NAV.includes(route.name as any)" />
  <router-view />
  <Loading v-if="anims.isLoading"/>
</template>

<style lang="scss">
@use './assets/base.scss';
main {
  width: 100%;
}
</style>
