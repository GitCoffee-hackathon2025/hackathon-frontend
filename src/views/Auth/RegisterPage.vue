<script setup lang="ts">
import EmailInput from './components/inputs/EmailInput.vue'
import BirthdayInput from './components/inputs/BirthdayInput.vue'
import LinkAuth from './components/LinkAuth.vue'
import AlertText from './components/AlertText.vue'
import BlackSide from './components/BlackSide.vue'
import PasswordInput from './components/inputs/PasswordInput.vue'
import NameInput from './components/inputs/NameInput.vue'
import CodeInput from '@/views/Auth/components/inputs/CodeInput.vue'

import StepBar from '@/views/Auth/components/StepBar.vue'

import { ROUTES } from '@/router/routes'

import resetData from '@/utils/resetData'
resetData.setup()

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import { computed, reactive, ref } from 'vue'

import { TokenRequisitions } from '@/requisitions/Token'
const tokenReq = TokenRequisitions()
import { UserRequisitions } from '@/requisitions/User'
const userReq = UserRequisitions()

import type { CreateUserDTO, tokenSendOrVerify } from '@/store/TypesStore'

import { AnimsStore } from '@/store/AnimsStore'
const anims = AnimsStore()

import type { Steps } from '@/store/TypesStore'

import OperationSuccess from '@/views/Auth/components/OperationSuccess.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const registerSteps = reactive<Steps>({
  two: true,
  three: true,
  four: true,
  five: false,
})

const errors = reactive({
  email: true,
  date: true,
  password: true,
  digits: true,
  name: true,
})

const errorText = ref('')

async function nextStep() {
  anims.isLoading = true
  if (registerSteps.five) {
    anims.isLoading = false
    router.push({ name: ROUTES.auth.login })
  } else if (registerSteps.four) {
    if (!user.birthday) {
      errorText.value = 'Data de nascimento obrigatória.'
      errors.date = false
      return
    }
    const req: CreateUserDTO = {
      dateBirth: user.birthday,
      email: user.email,
      name: user.name,
      password: user.password,
    }

    const res = await userReq.register(req)

    if (res.success) {
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
      registerSteps.five = true
    } else {
      errorText.value = res.errorText
      errors.digits = res.success
    }
    anims.isLoading = false
    return
  } else if (registerSteps.three) {
    if (!user.birthday) {
      errorText.value = 'Data de nascimento obrigatória.'
      errors.date = false
      anims.isLoading = false
      return
    }
    if (!user.name) {
      errorText.value = 'Nome completo obrigatório.'
      errors.name = false
      anims.isLoading = false
      return
    }
    registerSteps.four = true
    errorText.value = ''
    anims.isLoading = false
    return
  } else if (registerSteps.two) {
    const req: tokenSendOrVerify = {
      email: user.email,
      type: 'EMAIL_VERIFICATION',
      code: user.emailToken,
    }

    const res = await tokenReq.toVerify(req)

    if (res.success) {
      registerSteps.three = true
      errorText.value = ''
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
    } else {
      errorText.value = res.errorText
      errors.digits = res.success
    }
    anims.isLoading = false
    return
  } else {
    const req: tokenSendOrVerify = {
      email: user.email,
      code: user.emailToken,
      type: 'EMAIL_VERIFICATION',
    }
    const res = await tokenReq.send(req)

    if (res.success) {
      registerSteps.two = true
      errorText.value = ''
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
    } else {
      errorText.value = res.errorText
      errors.email = res.success
    }
    anims.isLoading = false
    return
  }
}

function backStep() {
  if (registerSteps.four) {
    errorText.value = ''
    registerSteps.four = false
    return
  } else if (registerSteps.three) {
    errorText.value = ''
    registerSteps.two = false
    registerSteps.three = false
    return
  } else if (registerSteps.two) {
    errorText.value = ''
    registerSteps.two = false
    return
  }
}

const subtitle = computed(() => {
  if (registerSteps.five) return ''
  if (registerSteps.four) return 'Insira uma senha forte'
  if (registerSteps.three) return 'Preencha todos os campos'
  if (registerSteps.two) return 'Digite o código enviado ao seu email'
  return 'Insira seu email'
})

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
</script>

<template>
  <form @submit.prevent="nextStep" novalidate>
    <BlackSide
      :route="ROUTES.occurrenceMap.init"
      :active="true"
      message="Cadastre-se e contribua!"
      father="register"
    />
    <StepBar :steps="registerSteps" class="register-bar" />
    <div class="form-inputs" :class="[{ anim: anims.animRegister }]">
      <h1 v-if="windowWidth < 992">Cadastre-se e contribua!</h1>
      <h2>{{ subtitle }}</h2>
      <BirthdayInput v-if="registerSteps.three && !registerSteps.four && !registerSteps.five" />
      <EmailInput class="register" v-if="!registerSteps.two" :erro="!errors.email" />
      <CodeInput
        v-if="
          registerSteps.two && !registerSteps.three && !registerSteps.four && !registerSteps.five
        "
      />
      <PasswordInput v-if="registerSteps.four && !registerSteps.five" class="register" />
      <PasswordInput v-if="registerSteps.four && !registerSteps.five" class="register" />
      <NameInput
        v-if="registerSteps.three && !registerSteps.four && !registerSteps.five"
        class="register"
      />
      <AlertText :text="errorText" />
      <OperationSuccess message="Cadastro realizado com sucesso!" v-if="registerSteps.five" />
      <div class="form-actions">
        <button v-if="registerSteps.two && !registerSteps.five" @click="backStep">Voltar</button>
        <button
          @click="anims.animLogin = true"
          :style="registerSteps.five ? { backgroundColor: 'var(--color-green)' } : {}"
        >
          {{ registerSteps.five ? 'Confirmar' : 'Avançar' }}
        </button>
      </div>
      <LinkAuth
        :text="'Ja tem tem uma conta?'"
        :route="ROUTES.auth.login"
        v-if="!registerSteps.two"
        anim="login"
      />
    </div>
  </form>
</template>

<style lang="scss">
@use './assets/auth.scss';

@media (min-width: 992px) {
  .anim {
    animation: leftToRight 1s ease;
  }

  @keyframes leftToRight {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0%);
    }
  }
}

form {
  position: relative;
}
</style>
