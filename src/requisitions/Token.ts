import { defineStore } from 'pinia'
import type { tokenSendOrVerify } from '@/store/TypesStore'

export const TokenRequisitions = defineStore('Token requisitions', () => {
  async function send(req: tokenSendOrVerify) {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/email/sendtoken`, {
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

  async function toVerify(req: tokenSendOrVerify) {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/email/verification`, {
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

  return { toVerify, send }
})
