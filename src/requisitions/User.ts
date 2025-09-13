import { defineStore } from 'pinia'
import type {
  CreateUserDTO,
  LoginUser,
  UpdateUserBody,
  UpdateUserParams,
  UpdateType,
} from '@/store/TypesStore'

export const UserRequisitions = defineStore('User requisitions', () => {
  async function register(req: CreateUserDTO) {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          errorText: errorData.error,
          type: errorData.type,
        }
      }
      return {
        success: true,
      }
    } catch (err) {
      return {
        success: false,
        errorText: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  async function login(req: LoginUser) {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          message: errorData.message,
        }
      }

      //Processo de salvar informações de usuário nas informações user.*Logged,
      //Autenticação e etc.

      return {
        success: true,
        message: 'Login realizado com sucesso',
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  async function update(req: {
    params: UpdateUserParams
    body: { user: UpdateUserBody; type: UpdateType }
  }) {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/auth/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          errorText: errorData.error,
          type: errorData.type,
        }
      }
      return {
        success: true,
      }
    } catch (err) {
      return {
        success: false,
        errorText: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  return { register, login, update }
})
