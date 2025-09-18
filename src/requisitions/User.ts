// store/UserRequisitions.ts
import { defineStore } from 'pinia'
import { UserStore } from '@/store/UserStore'
import  AuthClient  from '@/security/cryptoEngine/AuthClient'
import { SecurityClient } from '@/security/cryptoEngine/SecurityClient'
import type { CreateUserDTO, LoginUser } from '@/store/TypesStore'


const user = UserStore()


export const UserRequisitions = defineStore('User requisitions', () => {
 
  async function login(req: LoginUser) {
  try {
    console.log('🔐 Iniciando processo de login...')
    const securityClient = new SecurityClient()
    await securityClient.init()
    const encoded = await securityClient.encode(req, true)
   
    console.log('📤 Dados criptografados enviados:', encoded)
    
    const res = await fetch(`${import.meta.env.VITE_REQ}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encoded),
    })
   
    const json = await res.json()
    console.log('📥 Resposta do servidor:', json)
    console.log('📊 Status HTTP:', res.status)
    
    if (!res.ok) {
      console.log('❌ Erro na resposta HTTP')
      return { 
        success: false, 
        errorText: json.message || json.error || `Erro ${res.status}` 
      }
    }
    const decodedData = await securityClient.decode(json.data)
    console.log('🔓 Dados descriptografados:', decodedData)
    
     try {
      await AuthClient.setAccessToken(json.tokens.access);
      await AuthClient.setRefreshTokenCookie(json.tokens.refresh);
      console.log('✅ Tokens armazenados com sucesso no AuthClient');
    } catch (tokenError) {
      console.error('❌ Erro ao armazenar tokens:', tokenError);
      return { 
        success: false, 
        errorText: 'Erro ao processar tokens de autenticação' 
      }
    }
    
    // ✅ Agora acesse os dados corretamente
    user.emailLogged = decodedData.dataUser.email
    user.birthdayLogged = decodedData.dataUser.dateBirth // ← Note: dateBirth, não birthday
    user.nameLogged = decodedData.dataUser.name
    user.isLogged = true

    
    console.log('✅ Login realizado com sucesso')
    return { 
      success: true, 
      message: 'Login realizado com sucesso',
      userData: decodedData.dataUser,
      tokens: decodedData.tokens
    }
  } catch (err) {
    console.error('💥 Erro no processo de login:', err)
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
      const res = await fetch(`http://localhost:3000/auth/register`, {
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
