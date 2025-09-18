<script setup lang="ts">
// Vue / reatividade / router
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Componentes
import EmailInput from '@/views/Auth/components/inputs/EmailInput.vue'
import AlertText from '@/views/Auth/components/AlertText.vue'
import BlackSide from '@/views/Auth/components/BlackSide.vue'
import PasswordInput from '@/views/Auth/components/inputs/PasswordInput.vue'
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
import { RecoverProgress } from '@/views/Auth/utils/ProceedRecover'

// resetData: chamar dentro do ciclo de vida (não no topo do módulo)
import resetData from '@/utils/resetData'
import type { Steps } from '@/store/TypesStore'

// --- Estado reativo local (assegure que os tipos TypesStore concordem)
const recoverPasswordSteps = reactive<Steps>({
  current: 1,
  qtd: 4,
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
const register = new RecoverProgress(recoverPasswordSteps, errors, '', {
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
  <form @submit.prevent="nextStep" novalidate class="login">
    <BlackSide
      message="Recupere seu acesso!"
      father="recover"
    />
    <StepBar :steps="recoverPasswordSteps" class="recover-bar" />
    <div class="form-inputs">
      <h2 v-if="recoverPasswordSteps.current != 4">{{ subtitle }}</h2>
      <OperationSuccess
        message="Senha recuperada com sucesso!"
        v-if="recoverPasswordSteps.current == 4"
      />
      <EmailInput class="recover-password" v-if="recoverPasswordSteps.current == 1" />
      <CodeInput v-if="recoverPasswordSteps.current == 2" :error="errors.digits" />
      <PasswordInput v-if="recoverPasswordSteps.current == 3" class="recover" />
      <AlertText :text="errorText" :position="'recover-password'" />
      <div class="form-actions">
        <router-link
          @click="anim.animLogin = false"
          :to="{ name: ROUTES.auth.login }"
          v-if="recoverPasswordSteps.current == 1"
          >Cancelar</router-link
        ><button type="button" v-if="recoverPasswordSteps.current == 2" @click="backStep">
          Voltar
        </button>
        <button
          :style="
            recoverPasswordSteps.current == 4 ? { backgroundColor: 'var(--color-green)' } : {}
          "
        >
          {{ recoverPasswordSteps.current == 4 ? 'Confirmar' : 'Avançar' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use './assets/auth.scss';
</style>
