<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CampoSenha from './components/inputs/CampoSenha.vue'
import CampoEmail from './components/inputs/CampoEmail.vue'
import LinkForm from './components/LinkForm.vue'
import TextoAviso from './components/TextoAviso.vue'
import ParteCima from './components/ParteCima.vue'

import { AnimsAuthStore } from '@/store/AnimsAuth'
const animsAuth = AnimsAuthStore()

import resetData from '@/utils/resetData'
resetData.setup()

import { useRouter } from 'vue-router'
const router = useRouter()

import { UserRequisitions } from '@/requisitions/User'
const userReq = UserRequisitions()

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import type { LoginUser } from '@/store/Types'

const errorText = ref<string>('')
const loginFailed = ref(false)

async function login() {
  const req: LoginUser = {
    email: user.email,
    password: user.password,
  }

  const res = await userReq.login(req)
  if (!res.success) {
    errorText.value = res.message
    loginFailed.value = !res.success
    return
  }

  router.push('/mapa-de-denuncias')
}

onMounted(() => {})
</script>
<template>
  <form @submit.prevent="login" novalidate class="login">
    <ParteCima :route="'/mapa-de-denuncias'" :active="true" />
    <div class="form-inputs" :class="[{ anim: animsAuth.animLogin }]">
      <h1>Entre com sua conta</h1>
      <CampoEmail class="login" :erro="loginFailed" />
      <CampoSenha class="login" :erro="loginFailed" />
      <TextoAviso :position="'login'" :texto="errorText" />

      <div class="remember-container">
        <label class="remember-label">
          <input type="checkbox" />
          <span class="custom-checkbox"></span>
          <span class="remember-text">Lembre de mim</span>
        </label>
      </div>

      <div class="form-actions">
        <button>Entrar</button>
      </div>

      <LinkForm class="recover-password" :route="'/recuperar-conta'" :text="'Esqueceu a senha?'" />
      <LinkForm :route="'/cadastro'" :text="'Não tem uma conta?'" anim="register" />
    </div>
  </form>
</template>

<style scoped lang="scss">
@import url('./assets/logincadastro.scss');

.remember-container {
  grid-row: 15 / 18;
  grid-column: 1 / 31;
  width: var(--largura-componentes);
  justify-self: center;
  align-self: center;
  display: flex;
  justify-content: left;
  align-items: center;

  .remember-label {
    font-size: var(--texto-m);
    user-select: none;
    color: var(--cinza);
    cursor: pointer;
    gap: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: left;

    input {
      cursor: pointer;
      display: none;
    }

    .custom-checkbox {
      width: calc(var(--tamanho-icones) / 1.3);
      height: calc(var(--tamanho-icones) / 1.3);
      border: 2px solid var(--cinza);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--branco);
      transition: all 0.2s ease-in-out;
      position: relative;
    }

    .custom-checkbox::after {
      content: '';
      width: 0.5rem;
      height: 1rem;
      border: solid var(--branco);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) scale(0);
      opacity: 0;
      transition:
        transform 0.2s ease,
        opacity 0.2s ease;
      position: absolute;
    }

    input[type='checkbox']:checked + .custom-checkbox {
      background-color: var(--cinza);
    }

    input[type='checkbox']:checked + .custom-checkbox::after {
      transform: rotate(45deg) scale(0.7) translateY(-1px) translateX(-1px);
      opacity: 1;
    }

    .remember-text {
      font-size: var(--texto-m);
      color: var(--cinza);
    }
  }
}

@media (min-width: 576px) {
  .remember-container {
    grid-row: 16 / 17;
    grid-column: 1 / 31;

    .remember-label {
      .custom-checkbox::after {
        width: 0.7rem;
        height: 1.4rem;
      }
    }
  }
}

@media (min-width: 992px) {
  .remember-container {
    .remember-label {
      .custom-checkbox::after {
        width: 0.5rem;
        height: 1rem;
      }
    }
  }
  .anim {
    animation: rightToLeft 1s;
  }

  @keyframes rightToLeft {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0%);
    }
  }
}
</style>
