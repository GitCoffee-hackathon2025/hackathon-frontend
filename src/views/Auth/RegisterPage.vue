<script setup lang="ts">
// Vue / reatividade / router
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Componentes
import EmailInput from '@/views/Auth/components/inputs/EmailInput.vue'
import BirthdayInput from '@/views/Auth/components/inputs/BirthdayInput.vue'
import LinkAuth from '@/views/Auth/components/LinkAuth.vue'
import AlertText from '@/views/Auth/components/AlertText.vue'
import BlackSide from '@/views/Auth/components/BlackSide.vue'
import PasswordInput from '@/views/Auth/components/inputs/PasswordInput.vue'
import NameInput from '@/views/Auth/components/inputs/NameInput.vue'
import CodeInput from '@/views/Auth/components/inputs/CodeInput.vue'
import StepBar from '@/views/Auth/components/StepBar.vue'
import OperationSuccess from '@/views/Auth/components/OperationSuccess.vue'

// Rotas
import { ROUTES } from '@/router/routes'

// Stores / requisitions / animações
import { UserStore } from '@/store/UserStore'
import { AnimStore } from '@/store/AnimStore'
import { TokenRequisitions } from '@/requisitions/Token'
import { UserRequisitions } from '@/requisitions/User'

// Classe (a versão refatorada que lhe enviei anteriormente)
import { RegisterProgress } from '@/views/Auth/utils/ProceedRegister'

// resetData: chamar dentro do ciclo de vida (não no topo do módulo)
import resetData from '@/utils/resetData'
import type { Steps } from '@/store/TypesStore'

// --- Estado reativo local (assegure que os tipos TypesStore concordem)
const registerSteps = reactive<Steps>({
  current: 4,
  qtd: 5,
})

const errors = reactive({
  date: true,
  digits: true,
  email: true,
  password: true,
  name: true,
} as { date: boolean; digits: boolean; email: boolean; password: boolean; name: boolean })

// Mentemos erro de exibição como ref para a template
const errorText = ref('')

// obter stores e requisitions dentro do setup
const router = useRouter()
const user = UserStore()
const anim = AnimStore()
const tokenReq = TokenRequisitions()
const userReq = UserRequisitions()

// Instanciar a classe passando DEPENDÊNCIAS (injeção) — evita chamadas fora do contexto
const register = new RegisterProgress(registerSteps, errors, '', {
  router,
  userStore: user,
  tokenReq,
  userReq,
  animStore: anim,
})

// subtitle exposto diretamente da instância (ComputedRef)
const subtitle = register.subtitle

// Funções que a template consome (sincronizam errorText com a instância)
const nextStep = async () => {
  await register.nextStep()
  // sincronizar mensagem de erro que a classe mantém
  errorText.value = register.errorText
}

const backStep = () => {
  register.backStep()
  errorText.value = register.errorText
}

// resetData: garantir execução em mount e limpar ao desmontar
onMounted(() => {
  // se resetData.setup() altera estado global, execute aqui
  if (typeof resetData.setup === 'function') resetData.setup()
})
</script>

<template>
  <form @submit.prevent="nextStep" novalidate>


    <BlackSide
      :route="ROUTES.occurrenceMap.init"
      message="Cadastre-se e contribua!"
      father="register"
    />
    <StepBar :steps="registerSteps" class="register-bar" />
    <div class="form-inputs" :class="[{ anim: anim.animRegister }]">
      <h2>{{ subtitle }}</h2>
      <BirthdayInput v-if="registerSteps.current == 3" />
      <EmailInput class="register" v-if="registerSteps.current == 1" :error="!errors.email" />
      <CodeInput
       :error="errors.digits"
        v-if="
          registerSteps.current == 2
        "
      />
      <PasswordInput v-if="registerSteps.current == 4" class="register" :error="!errors.password"/>

      <NameInput
        v-if="registerSteps.current == 3"
        class="register"
      />
      <AlertText :text="errorText" />
      <OperationSuccess message="Cadastro realizado com sucesso!" v-if="registerSteps.current == 5" />
      <div class="form-actions">
        <button v-if="registerSteps.current != 1" @click="backStep" type="button">
          Voltar
        </button>
        <button
          @click="anim.animLogin = true"
          :style="registerSteps.current == 5 ? { backgroundColor: 'var(--color-green)' } : {}"
        >
          {{ registerSteps.current == 5 ? 'Confirmar' : 'Avançar' }}
        </button>
      </div>
      <LinkAuth
        :text="'Ja tem tem uma conta?'"
        :route="ROUTES.auth.login"
        v-if="registerSteps.current == 1"
        anim="login"
      />
    </div>
  </form>
</template>

<style lang="scss">
@use './assets/auth.scss';

//
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
