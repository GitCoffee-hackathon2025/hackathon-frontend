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

  // Classe
  import { RecoverProgress } from '@/views/Auth/utils/ProceedRecover'

  // resetData
  import resetData from '@/utils/resetData'
  import type { Steps } from '@/store/TypesStore'

  // --- Estado reativo local
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

  // Erro de exibição
  const errorText = ref('')

  // obter stores e requisitions
  const router = useRouter()
  const user = UserStore()
  const anim = AnimStore()
  const tokenReq = TokenRequisitions()
  const userReq = UserRequisitions()

  // Instanciar a classe
  const recover = new RecoverProgress(recoverPasswordSteps, errors, errorText.value, {
    router,
    userStore: user,
    tokenReq,
    userReq,
    animStore: anim,
  })

  // subtitle da instância
  const subtitle = recover.subtitle

  // Funções
  const nextStep = async () => {
    await recover.nextStep()
    errorText.value = recover.errorText
  }

  const backStep = () => {
    recover.backStep()
    errorText.value = recover.errorText
  }

  // Debug: logs para verificar se os dados estão chegando
  console.log('🟢 [FRONT] UserStore inicial:', {
    email: user.email,
    emailToken: user.emailToken,
    password: user.password
  })

  onMounted(() => {
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
        
        <!-- Os componentes usam v-model que atualiza o userStore diretamente -->
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
          >
          <button type="button" v-if="recoverPasswordSteps.current == 2 || recoverPasswordSteps.current == 3" @click="backStep">
            Voltar
          </button>
          <button
            :style="
              recoverPasswordSteps.current == 4 ? { backgroundColor: 'var(--color-green)' } : {}
            "
            :disabled="anim.isLoading"
          >
            {{ recoverPasswordSteps.current == 4 ? 'Ir para Login' : 'Avançar' }}
          </button>
        </div>
      </div>
    </form>
  </template>

  <style scoped lang="scss">
  @use './assets/auth.scss';
  </style>