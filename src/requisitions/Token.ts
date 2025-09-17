import { defineStore } from 'pinia'
import { SecurityClient } from '@/security/cryptoEngine/SecurityClient'
import type { tokenSendOrVerify } from '@/store/TypesStore'


export const TokenRequisitions = defineStore('Token requisitions', () => {
  async function send(req: tokenSendOrVerify) {
    try {
      const securityClient = new SecurityClient()
      await securityClient.init()


     
      const encode = await securityClient.encode({ email: req.email }, true)


      const res = await fetch(`http://localhost:3000/auth/send-registration-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encode),
      })


      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          errorText: errorData.message || errorData.error, // ✅ Ajuste para message
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
      const securityClient = new SecurityClient()
await securityClient.init()
console.log('SecurityClient initialized');
const encode = await securityClient.encode({ email: req.email, code: req.code }, true)
    console.log('Encoded object:', encode);


const res = await fetch(`http://localhost:3000/auth/verify-registration-code`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(encode),
  credentials: 'include',
})


      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          errorText: errorData.message || errorData.error, // ✅ Ajuste para message
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
