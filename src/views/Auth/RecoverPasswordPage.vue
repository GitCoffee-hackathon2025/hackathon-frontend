<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import BlackSide from './components/BlackSide.vue'
import CodeInput from './components/inputs/CodeInput.vue'
import PasswordInput from './components/inputs/PasswordInput.vue'
import AlertText from './components/AlertText.vue'
import EmailInput from './components/inputs/EmailInput.vue'
import OperationSuccess from './components/OperationSuccess.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

import { ROUTES } from '@/router/routes'

import resetData from '@/utils/resetData'
resetData.setup()

import type {
  tokenSendOrVerify,
  UpdateType,
  UpdateUserBody,
  UpdateUserParams,
} from '@/store/TypesStore'

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import { TokenRequisitions } from '@/requisitions/Token'
const tokenReq = TokenRequisitions()
import { UserRequisitions } from '@/requisitions/User'
const userReq = UserRequisitions()

import { AnimsStore } from '@/store/AnimsStore'
const anims = AnimsStore()

import StepBar from '@/views/Auth/components/StepBar.vue'

import type { Steps } from '@/store/TypesStore'

onMounted(() => {
  anims.animLogin = false
})

const recoverPasswordSteps: Steps = reactive({
  two: true,
  three: true,
  four: true,
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
  anims.isLoading = true
  if (recoverPasswordSteps.four) {
    anims.isLoading = false
    router.push({ name: ROUTES.auth.login })
  } else if (recoverPasswordSteps.three) {
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

const subtitle = computed(() => {
  if (recoverPasswordSteps.five) return ''
  if (recoverPasswordSteps.four) return 'Insira uma senha forte'
  if (recoverPasswordSteps.three) return 'Preencha todos os campos'
  if (recoverPasswordSteps.two) return 'Digite o código enviado ao seu email'
  return 'Insira seu email'
})

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
</script>
<template>
  <form @submit.prevent="nextStep" novalidate class="login">
    <BlackSide
      :route="'/mapa-de-denuncias'"
      :active="false"
      message="Recupere seu acesso!"
      father="recover"
    />
    <StepBar :steps="recoverPasswordSteps" class="recover-bar" />
    <div class="form-inputs">
      <h1 v-if="windowWidth < 992">Recupere seu acesso!</h1>
      <h2 v-if="!recoverPasswordSteps.four">{{ subtitle }}</h2>
      <OperationSuccess message="Senha recuperada com sucesso!" v-if="recoverPasswordSteps.four"/>
      <EmailInput class="recover-password" v-if="!recoverPasswordSteps.two" />
      <CodeInput v-if="recoverPasswordSteps.two && !recoverPasswordSteps.three" />
      <PasswordInput v-if="recoverPasswordSteps.three && !recoverPasswordSteps.four" class="recover" />
      <AlertText :text="errorText" :position="'recover-password'" />
      <div class="form-actions">
        <router-link :to="{ name: ROUTES.auth.login }" v-if="!recoverPasswordSteps.two"
          >Cancelar</router-link
        ><button
          type="button"
          v-if="recoverPasswordSteps.two && !recoverPasswordSteps.four"
          @click="backStep"
        >
          Voltar
        </button>
        <button :style="recoverPasswordSteps.four ? { backgroundColor: 'var(--color-green)' } : {}">
          {{ recoverPasswordSteps.four ? 'Confirmar' : 'Avançar' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use './assets/auth.scss';

.email {
  grid-column: 2 / 10;
  grid-row: 3 / 7;
}

p {
  margin: 0.3rem;
  color: var(--color-gray-dark);
  font-size: var(--text-md);
  grid-column: 2 / 10;
  grid-row: 5 / 6;
  justify-self: center;
  align-self: end;
}
</style>
