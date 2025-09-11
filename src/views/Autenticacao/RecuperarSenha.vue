<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import CampoEmail from './components/inputs/CampoEmail.vue'
import ParteCima from './components/ParteCima.vue'
import CampoDigitos from './components/inputs/CampoDigitos.vue'
import CampoSenha from './components/inputs/CampoSenha.vue'
import TextoAviso from './components/TextoAviso.vue'

import resetData from '@/utils/resetData'
resetData.setup()

import type { tokenSendOrVerify, UpdateType, UpdateUserBody, UpdateUserParams } from '@/store/Types'

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import { TokenRequisitions } from '@/requisitions/Token'
const tokenReq = TokenRequisitions()
import { UserRequisitions } from '@/requisitions/User'
const userReq = UserRequisitions()

import { AnimsAuthStore } from '@/store/AnimsAuth'
const animsAuth = AnimsAuthStore()

onMounted(() => {
  animsAuth.animLogin = false
})

const recoverPasswordSteps = reactive({
  two: false,
  three: false,
})

const errorText = ref('')

const errors = reactive({
  email: true,
  date: true,
  password: true,
  digits: true,
  name: true,
})

async function nextStep() {
  if (recoverPasswordSteps.three) {
    const req: {
      params: UpdateUserParams
      body: { user: UpdateUserBody; type: UpdateType }
    } = {
      params: { id: '1' },
      body: { user: { password: '' }, type: 'PASSWORD' },
    }

    const res = await userReq.update(req)
    if (res.success) {
      errorText.value = ''
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
    } else {
      errorText.value = res.errorText
      errors.digits = res.success
    }
    return
  } else if (recoverPasswordSteps.two) {
    const req: tokenSendOrVerify = {
      email: user.email,
      type: 'PASSWORD_RESET',
      code: user.emailToken,
    }

    const res = await tokenReq.toVerify(req)

    if (res.success) {
      recoverPasswordSteps.three = true
      errorText.value = ''
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
    } else {
      errorText.value = res.errorText
      errors.digits = res.success
    }
    return
  } else {
    const req: tokenSendOrVerify = {
      email: user.email,
      code: user.emailToken,
      type: 'PASSWORD_RESET',
    }
    const res = await tokenReq.send(req)

    if (res.success) {
      recoverPasswordSteps.two = true
      errorText.value = ''
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
    } else {
      errorText.value = res.errorText
      errors.email = res.success
    }
    return
  }
}

function backStep() {
  if (recoverPasswordSteps.three) {
    errorText.value = ''
    recoverPasswordSteps.two = false
    recoverPasswordSteps.three = false
    return
  } else if (recoverPasswordSteps.two) {
    errorText.value = ''
    recoverPasswordSteps.two = false
    return
  }
}
</script>
<template>
  <form @submit.prevent="nextStep" novalidate class="login">
    <ParteCima :route="'/mapa-de-denuncias'" :active="false" />
    <div class="form-inputs">
      <h1>Recupere sua conta</h1>
      <CampoEmail class="recover-password" v-if="!recoverPasswordSteps.two" />
      <CampoDigitos v-if="recoverPasswordSteps.two && recoverPasswordSteps.three" />
      <CampoSenha v-if="recoverPasswordSteps.three" />

      <TextoAviso :text="errorText" :position="'recover-password'" />
      <div class="form-actions">
        <router-link to="/entrar" v-if="!recoverPasswordSteps.two">Cancelar</router-link
        ><button type="button" v-if="recoverPasswordSteps.two" @click="backStep">Voltar</button
        ><button type="button">Avançar</button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

.email {
  grid-column: 2 / 10;
  grid-row: 3 / 7;
}

p {
  margin: 0.3rem;
  color: var(--cinza);
  font-size: var(--texto-m2);
  grid-column: 2 / 10;
  grid-row: 5 / 6;
  justify-self: center;
  align-self: end;
}
</style>
