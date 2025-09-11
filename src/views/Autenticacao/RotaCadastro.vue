<script setup lang="ts">
import CampoEmail from './components/inputs/CampoEmail.vue'
import CampoDataNascimento from './components/inputs/CampoDataNascimento.vue'
import LinkForm from './components/LinkForm.vue'
import TextoAviso from './components/TextoAviso.vue'
import ParteCima from './components/ParteCima.vue'
import CampoSenha from './components/inputs/CampoSenha.vue'
import CampoNome from './components/inputs/CampoNome.vue'
import CampoDigitos from '@/views/Autenticacao/components/inputs/CampoDigitos.vue'

import resetData from '@/utils/resetData'
resetData.setup()

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import { reactive, ref, computed } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

import { TokenRequisitions } from '@/requisitions/Token'
const tokenReq = TokenRequisitions()
import { UserRequisitions } from '@/requisitions/User'
const userReq = UserRequisitions()

import type { CreateUserDTO, tokenSendOrVerify } from '@/store/Types'

import { AnimsAuthStore } from '@/store/AnimsAuth'
const animsAuth = AnimsAuthStore()

const registerSteps = reactive({
  two: false,
  three: false,
  four: false,
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
  if (registerSteps.four) {
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
      registerSteps.three = true
      errorText.value = 'Conta criada com sucesso.'
      errors.date = true
      errors.digits = true
      errors.email = true
      errors.password = true
      router.push('/entrar')
    } else {
      errorText.value = res.errorText
      errors.digits = res.success
    }
    return
  } else if (registerSteps.three) {
    if (!user.birthday) {
      errorText.value = 'Data de nascimento obrigatória.'
      errors.date = false
      return
    }
    if (!user.name) {
      errorText.value = 'Nome completo obrigatório.'
      errors.name = false
      return
    }
    registerSteps.four = true
    errorText.value = ''
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

const totalSteps = 4

const currentStep = computed(() => {
  if (registerSteps.four) return 4
  if (registerSteps.three) return 3
  if (registerSteps.two) return 2
  return 1
})

const stepPercent = (i: number) => {
  if (totalSteps <= 1) return 100
  return ((i - 1) / (totalSteps - 1)) * 100
}

const progressPercent = computed(() => {
  if (totalSteps <= 1) return 100
  return Math.round(((currentStep.value - 1) / (totalSteps - 1)) * 100 * 10) / 10 + 1
})
</script>

<template>
  <form @submit.prevent="nextStep" novalidate>
    <div class="progress-simple">
      <div class="progress-track"></div>
      <div class="progress-fill" :style="{ height: progressPercent + '%' }"></div>
      <div class="progress-steps">
        <div
          v-for="i in totalSteps"
          :key="i"
          :class="['green-circle', { active: progressPercent >= stepPercent(i) }]"
        ></div>
      </div>
    </div>

    <ParteCima :route="'/mapa-de-denuncias'" :active="true" />
    <div class="form-inputs" :class="[{ anim: animsAuth.animRegister }]">
      <h1>Crie sua conta</h1>
      <CampoDataNascimento v-if="registerSteps.three && !registerSteps.four" />
      <CampoEmail class="register" v-if="!registerSteps.two" :erro="!errors.email" />
      <CampoDigitos v-if="registerSteps.two && !registerSteps.three && !registerSteps.four" />
      <CampoSenha v-if="registerSteps.four" class="register" />
      <CampoSenha v-if="registerSteps.four" class="register" />
      <CampoNome v-if="registerSteps.three && !registerSteps.four" class="register" />
      <TextoAviso :text="errorText" />
      <div class="form-actions">
        <button v-if="registerSteps.two" @click="backStep">Voltar</button>
        <button>Avançar</button>
      </div>
      <LinkForm
        :text="'Ja tem tem uma conta?'"
        :route="'/entrar'"
        v-if="!registerSteps.two"
        anim="login"
      />
    </div>
  </form>
</template>

<style lang="scss">
@import url('./assets/logincadastro.scss');

@media (min-width: 992px) {
  .anim {
    animation: leftToRight 1s;
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

.progress-simple {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 45%;
  width: 6px;
  height: 80%;
  z-index: 2000;
  pointer-events: none;
  .progress-track {
    position: absolute;
    inset: 0;
    background: var(--branco);
    border-radius: 4px;
  }
  .progress-fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0%;
    transition: height 300ms ease;
    background: var(--verde);
    border-radius: 4px;
    z-index: 1;
  }
  .progress-steps {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    pointer-events: none;

    .green-circle {
      width: var(--tamanho-icones);
      height: var(--tamanho-icones);
      border-radius: 50%;
      box-sizing: border-box;
      transition:
        background-color 180ms ease,
        border-color 180ms ease,
        transform 180ms ease;
      transform: translateZ(0);
      background: var(--branco);
      &.active {
        background: var(--verde);
        border-color: var(--verde);
        transform: scale(1.05);
      }
    }
  }
}
</style>
