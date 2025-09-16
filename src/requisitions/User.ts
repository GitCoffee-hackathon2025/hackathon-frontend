import { defineStore } from 'pinia'
import type { LoginUser, UpdateUserBody, UpdateType, UpdateUserParams } from '@/store/TypesStore'

import { UserStore } from '@/store/UserStore'
const user = UserStore()

import { SecurityClient } from '@/security/cryptoEngine/SecurityClient'

export const UserRequisitions = defineStore('User requisitions', () => {
  async function login(req: LoginUser) {
    try {
      const securityClient = new SecurityClient()
      await securityClient.init()
      const res = await fetch(`${import.meta.env.VITE_REQ}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(await securityClient.encode(req, true)),
      })

      const json = await res.json()

      if (!res.ok) {
        const errorData = json
        return {
          success: false,
          message: errorData.message,
        }
      }

      const data = await securityClient.decode(json)

      user.emailLogged = data.email
      user.birthdayLogged = data.birthday
      user.nameLogged = data.name
      user.isLogged = true

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

  async function register(req: {
    params: UpdateUserParams
    body: { user: UpdateUserBody; type: UpdateType }
  }) {
    try {
    } catch (err) {}
  }

  return { login, register }
})
