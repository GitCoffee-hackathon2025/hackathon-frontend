// RegisterProgress.ts
import { computed, type ComputedRef } from 'vue'
import { UserRequisitions } from '@/requisitions/User'
import type { Router } from 'vue-router'
import type { CreateUserDTO, tokenSendOrVerify, Steps, InputsInError } from '@/store/TypesStore'
import { ROUTES } from '@/router/routes'
const userRequistions = UserRequisitions()
export interface RegisterProgressDeps {
  router: Router
  userStore: any
  tokenReq: any
  userReq: any
  animStore: any
}


/**
 * Classe que encapsula a máquina de passos do registro.
 * Requisitos: passar objetos reativos (ex: registerSteps = reactive({...})) para que `subtitle` reaja.
 */
export class RegisterProgress {
  registerSteps: Steps
  errors: InputsInError
  errorText: string
  subtitle: ComputedRef<string>
  private deps: RegisterProgressDeps


  constructor(
    registerSteps: Steps,
    errors: InputsInError,
    errorText: string,
    deps: RegisterProgressDeps,
  ) {
    this.registerSteps = registerSteps
    this.errors = errors
    this.errorText = errorText
    this.deps = deps


    this.subtitle = computed(() => {
      switch (this.registerSteps.current) {
        case 5: return ''
        case 4: return 'Insira uma senha forte'
        case 3: return 'Preencha todos os campos'
        case 2: return 'Digite o código enviado ao seu email'
        default: return 'Insira seu email'
      }
    })
  }


  public nextStep = async (): Promise<void> => {
    const { animStore, tokenReq, userReq, router } = this.deps
    animStore.isLoading = true


    try {
      // PASSO 5: redireciona para login
      if (this.registerSteps.current === 5) {
        router.push({ name: ROUTES.auth.login })
        return
      }


      // PASSO 4: criar usuário no backend
      if (this.registerSteps.current === 4) {
        if (!this.deps.userStore.birthday) {
          this.errorText = 'Data de nascimento obrigatória.'
          this.errors.date = false
          return
        }


        const req: CreateUserDTO = {
          dateBirth: this.deps.userStore.birthday,
          email: this.deps.userStore.email,
          name: this.deps.userStore.name,
          password: this.deps.userStore.password,
        }


        const res = await userRequistions.register(req) || { success: false, errorText: 'Erro inesperado.' }


        if (res.success) {
          this.errors.date = true
          this.errors.digits = true
          this.errors.email = true
          this.errors.password = true
          this.registerSteps.current = 5
          this.errorText = ''
        } else {
          this.errorText = res.errorText || 'Erro ao registrar usuário.'
          this.errors.digits = !!res.success
        }
        return
      }


      // PASSO 3: validação local antes de avançar
      if (this.registerSteps.current === 3) {
        if (!this.deps.userStore.birthday) {
          this.errorText = 'Data de nascimento obrigatória.'
          this.errors.date = false
          return
        }
        if (!this.deps.userStore.name) {
          this.errorText = 'Nome completo obrigatório.'
          this.errors.name = false
          return
        }
        this.registerSteps.current = 4
        this.errorText = ''
        return
      }


      // PASSO 2: verificar token enviado por email
      if (this.registerSteps.current === 2) {
        const req: tokenSendOrVerify = {
          email: this.deps.userStore.email,
          type: 'EMAIL_VERIFICATION',
          code: this.deps.userStore.emailToken,
        }


        const res = await tokenReq.toVerify(req) || { success: false, errorText: 'Erro inesperado.' }


        if (res.success) {
          this.registerSteps.current = 3
          this.errorText = ''
          this.errors.date = true
          this.errors.digits = true
          this.errors.email = true
          this.errors.password = true
        } else {
          this.errorText = res.errorText || 'Código inválido.'
          this.errors.digits = !!res.success
        }
        return
      }


      // PASSO 1: enviar apenas o email
      if (this.registerSteps.current === 1) {
        const req: Omit<tokenSendOrVerify, 'code'> = {
          email: this.deps.userStore.email,
          type: 'EMAIL_VERIFICATION',
        }


        const res = await tokenReq.send(req) || { success: false, errorText: 'Erro inesperado.' }


        if (res.success) {
          this.registerSteps.current = 2
          this.errorText = ''
          this.errors.date = true
          this.errors.digits = true
          this.errors.email = true
          this.errors.password = true
        } else {
          this.errorText = res.errorText || 'Erro ao enviar código.'
          this.errors.email = !!res.success
        }
        return
      }


    } catch (err) {
      console.error('RegisterProgress.nextStep error:', err)
      this.errorText = 'Erro inesperado. Tente novamente.'
    } finally {
      animStore.isLoading = false
    }
  }


  public backStep = (): void => {
    if (this.registerSteps.current === 4) {
      this.errorText = ''
      this.registerSteps.current = 3
      return
    } else if (this.registerSteps.current === 3 || this.registerSteps.current === 2) {
      this.errorText = ''
      this.registerSteps.current = 1
      return
    }
  }
}
