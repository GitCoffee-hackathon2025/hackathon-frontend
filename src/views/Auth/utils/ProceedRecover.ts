import { computed, type ComputedRef } from 'vue'
import type { Router } from 'vue-router'
import type { Steps, InputsInError } from '@/store/TypesStore'
import { ROUTES } from '@/router/routes'
import { RecoverRequisitions } from '@/requisitions/recoverRequisition'

export interface RecoverProgressDeps {
  router: Router
  userStore: any
  tokenReq: any
  userReq: any
  animStore: any
}

/**
 * Classe que encapsula a máquina de passos da recuperação de senha.
 */
export class RecoverProgress {
  recoverSteps: Steps
  errors: InputsInError
  errorText: string
  subtitle: ComputedRef<string>
  private deps: RecoverProgressDeps

  constructor(
    recoverSteps: Steps,
    errors: InputsInError,
    errorText: string,
    deps: RecoverProgressDeps,
  ) {
    this.recoverSteps = recoverSteps
    this.errors = errors
    this.errorText = errorText
    this.deps = deps

    this.subtitle = computed(() => {
      const subtitles = {
        1: 'Digite seu e-mail para recuperação',
        2: 'Verifique seu e-mail e insira o código',
        3: 'Crie uma nova senha',
        4: 'Senha alterada com sucesso!'
      }
      return subtitles[this.recoverSteps.current as keyof typeof subtitles] || ''
    })
  }

  public nextStep = async (): Promise<void> => {
    const { animStore, userStore } = this.deps
    animStore.isLoading = true
    this.errorText = ''

    try {
      // PASSO 4: redireciona para login
      if (this.recoverSteps.current === 4) {
        this.deps.animStore.animLogin = false
        this.deps.router.push({ name: ROUTES.auth.login })
        return
      }

      // PASSO 3: resetar senha
      if (this.recoverSteps.current === 3) {
        await this.handleStep3()
        return
      }

      // PASSO 2: verificar código
      if (this.recoverSteps.current === 2) {
        await this.handleStep2()
        return
      }

      // PASSO 1: enviar código de recuperação
      if (this.recoverSteps.current === 1) {
        await this.handleStep1()
        return
      }

    } catch (err: any) {
      console.error('RecoverProgress.nextStep error:', err)
      this.errorText = err.message || 'Erro inesperado. Tente novamente.'
    } finally {
      animStore.isLoading = false
    }
  }

  private async handleStep1(): Promise<void> {
    const email = this.deps.userStore.email
    
    console.log('🔴 [DEBUG] Email no handleStep1:', email)
    
    // Validação do email
    if (!email || !this.isValidEmail(email)) {
      this.errorText = 'Digite um e-mail válido'
      this.errors.email = false
      return
    }

    console.log('🔴 [DEBUG] Chamando sendRecoveryCode...')
    await RecoverRequisitions.sendRecoveryCode(email)
    
    this.errors.email = true
    this.recoverSteps.current = 2
    this.errorText = ''
  }

  private async handleStep2(): Promise<void> {
    const email = this.deps.userStore.email
    const code = this.deps.userStore.emailToken
    
    console.log('🔴 [DEBUG] Code no handleStep2:', code)
    console.log('🔴 [DEBUG] Email no handleStep2:', email)
    
    // Validação do código
    

    await RecoverRequisitions.verifyRecoveryCode(email, code)
    
    this.errors.digits = true
    this.recoverSteps.current = 3
    this.errorText = ''
  }

  private async handleStep3(): Promise<void> {
    const email = this.deps.userStore.email
    const code = this.deps.userStore.emailToken
    const password = this.deps.userStore.password
    
    console.log('🔴 [DEBUG] Password no handleStep3:', password)
    console.log('🔴 [DEBUG] Email no handleStep3:', email)
    console.log('🔴 [DEBUG] Code no handleStep3:', code)
    
    // Validação da senha
 

    await RecoverRequisitions.resetPassword(email, password, code)
    
    this.errors.password = true
    this.recoverSteps.current = 4
    this.errorText = ''
  }

  public backStep = (): void => {
    if (this.recoverSteps.current === 3) {
      this.errorText = ''
      this.recoverSteps.current = 2
      return
    } else if (this.recoverSteps.current === 2) {
      this.errorText = ''
      this.recoverSteps.current = 1
      return
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}