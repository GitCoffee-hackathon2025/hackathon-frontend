<script setup lang="ts">
import { ref } from 'vue'
import PasswordInput from './components/inputs/PasswordInput.vue'
import EmailInput from './components/inputs/EmailInput.vue'
import LinkAuth from './components/LinkAuth.vue'
import AlertText from './components/AlertText.vue'
import BlackSide from './components/BlackSide.vue'

import { ROUTES } from '@/router/routes'

import { AnimStore } from '@/store/AnimStore'
const anim = AnimStore()

import resetData from '@/utils/resetData'
resetData.setup()

import { useRouter } from 'vue-router'
const router = useRouter()

import { UserRequisitions } from '@/requisitions/User'
const userReq = UserRequisitions()

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import type { LoginUser } from '@/store/TypesStore'

const errorText = ref<string>('')
const loginFailed = ref(false)

async function login() {
  anim.isLoading = true
  const req: LoginUser = {
    email: user.email,
    password: user.password,
  }

  const res = await userReq.login(req)
  if (!res.success) {
    errorText.value = res.message
    loginFailed.value = !res.success
    anim.isLoading = false
    return
  }

  anim.isLoading = false
  router.push({ name: ROUTES.occurrenceMap.init })
}

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
</script>
<template>
  <form @submit.prevent="login" novalidate class="login">
    <BlackSide
      :route="ROUTES.occurrenceMap.init"
      message="Bem-vindo de volta!"
      father="login"
    />

    <div class="form-inputs" :class="[{ anim: anim.animLogin }]">
      <h1 v-if="windowWidth < 992">Bem-vindo!</h1>
      <h2>Insira suas credênciais</h2>
      <EmailInput class="login" :erro="loginFailed" />
      <PasswordInput class="login" :erro="loginFailed" />
      <AlertText :position="'login'" :texto="errorText" />

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

      <LinkAuth class="recover-password" :route="ROUTES.auth.recover" :text="'Esqueceu a senha?'" />
      <LinkAuth :route="ROUTES.auth.register" :text="'Não tem uma conta?'" anim="register" />
    </div>
  </form>
</template>

<style scoped lang="scss">
@use './assets/auth.scss';

.remember-container {
  grid-row: 16 / 19;
  grid-column: 1 / 31;
  width: var(--component-width);
  justify-self: center;
  align-self: center;
  display: flex;
  justify-content: left;
  align-items: center;

  .remember-label {
    font-size: var(--text-md);
    user-select: none;
    color: var(--color-gray-dark);
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
      width: calc(var(--icon-size) / 1.3);
      height: calc(var(--icon-size) / 1.3);
      border: 2px solid var(--color-gray-dark);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-white);
      transition: all 0.2s ease-in-out;
      position: relative;
    }

    .custom-checkbox::after {
      content: '';
      width: 0.5rem;
      height: 1rem;
      border: solid var(--color-white);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) scale(0);
      opacity: 0;
      transition:
        transform 0.2s ease,
        opacity 0.2s ease;
      position: absolute;
    }

    input[type='checkbox']:checked + .custom-checkbox {
      background-color: var(--color-gray-dark);
    }

    input[type='checkbox']:checked + .custom-checkbox::after {
      transform: rotate(45deg) scale(0.7) translateY(-1px) translateX(-1px);
      opacity: 1;
    }

    .remember-text {
      font-size: var(--text-md);
      color: var(--color-gray-dark);
    }
  }
}

@media (min-width: 576px) {
  .remember-container {
    grid-row: 17 / 18;
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
    animation: rightToLeft 1s ease;
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
