// store/UserRequisitions.ts
import { defineStore } from 'pinia'
import { UserStore } from '@/store/UserStore'
import { SecurityClient } from '@/security/cryptoEngine/SecurityClient'
import type { CreateUserDTO, LoginUser } from '@/store/TypesStore'


const user = UserStore()


export const UserRequisitions = defineStore('User requisitions', () => {
 
  async function login(req: LoginUser) {
    try {
      const securityClient = new SecurityClient()
      await securityClient.init()
      const encoded = await securityClient.encode(req, true)
     
      const res = await fetch(`${import.meta.env.VITE_REQ}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encoded),
      })
     
      const json = await res.json()
      if (!res.ok) {
        return { success: false, errorText: json.message || json.error }
      }
     
      const data = await securityClient.decode(json)
      user.emailLogged = data.email
      user.birthdayLogged = data.birthday
      user.nameLogged = data.name
      user.isLogged = true


      return { success: true, message: 'Login realizado com sucesso' }
    } catch (err) {
      console.error('Erro no login:', err)
      return { success: false, errorText: 'Erro de conexão. Tente novamente.' }
    }
  }


  async function register(req: CreateUserDTO) {
    try {
      const securityClient = new SecurityClient()
      await securityClient.init()
      console.log('SecurityClient initialized')
      console.log('Register request:', req)
      const encoded = await securityClient.encode(req)
      console.log('Encoded object:', encoded)
      const res = await fetch(`${import.meta.env.VITE_REQ}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encoded),
      })


      if (!res.ok) {
       
        const errorData = await res.json()
        return { success: false, errorText: errorData.message || errorData.error }
      }


      return { success: true }
    } catch (err) {
      console.error('Erro no registro:', err)
      return { success: false, errorText: 'Erro de conexão. Tente novamente.' }
    }
  }


  return { login, register }
})
