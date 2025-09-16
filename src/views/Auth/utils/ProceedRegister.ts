// RegisterProgress.ts
import { computed, type ComputedRef } from 'vue'
import type { Router } from 'vue-router'
import type { CreateUserDTO, tokenSendOrVerify, Steps, InputsInError } from '@/store/TypesStore'
import { ROUTES } from '@/router/routes'

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

    // computed: só vai atualizar se registerSteps for REATIVO (reactive / store)
    this.subtitle = computed(() => {
      if (this.registerSteps.current == 5) return ''
      if (this.registerSteps.current == 4) return 'Insira uma senha forte'
      if (this.registerSteps.current == 3) return 'Preencha todos os campos'
      if (this.registerSteps.current == 2) return 'Digite o código enviado ao seu email'
      return 'Insira seu email'
    })
  }

  // nextStep agora usa `this.` e tratamento de erros adequado
  public nextStep = async (): Promise<void> => {
    const { animStore, tokenReq, userReq, router } = this.deps
    animStore.isLoading = true

    try {
      // passo final: redireciona para login
      if (this.registerSteps.current == 5) {
        router.push({ name: ROUTES.auth.login }) // ou ROUTES.auth.login se preferir constante
        return
      }

      // passo 4: criar usuário no backend
      if (this.registerSteps.current == 4) {
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

        const res = await userReq.register(req)

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

      // passo 3: validações locais antes de avançar ao passo 4
      if (this.registerSteps.current == 3) {
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

      // passo 2: verificar token enviado por email
      if (this.registerSteps.current == 2) {
        const req: tokenSendOrVerify = {
          email: this.deps.userStore.email,
          type: 'EMAIL_VERIFICATION',
          code: this.deps.userStore.emailToken,
        }
        const res = await tokenReq.toVerify(req)

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

      // passo 1: enviar token para o email
      const req: tokenSendOrVerify = {
        email: this.deps.userStore.email,
        code: this.deps.userStore.emailToken,
        type: 'EMAIL_VERIFICATION',
      }
      const res = await tokenReq.send(req)
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
    } catch (err) {
      // log e mensagem genérica sem vazar detalhes do erro do backend
      console.error('RegisterProgress.nextStep error:', err)
      this.errorText = 'Erro inesperado. Tente novamente.'
    } finally {
      animStore.isLoading = false
    }
  }

  public backStep = (): void => {
    // usar this.registerSteps para consistência
    if (this.registerSteps.current == 4) {
      this.errorText = ''
      this.registerSteps.current = 3
      return
    } else if (this.registerSteps.current == 3) {
      this.errorText = ''
      this.registerSteps.current = 1

      return
    } else if (this.registerSteps.current == 2) {
      this.errorText = ''
      this.registerSteps.current = 1
      return
    }
  }
}
