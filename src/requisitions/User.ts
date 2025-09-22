import { SecurityClient } from './../security/cryptoEngine/SecurityClient';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
// store/UserRequisitions.ts
import { defineStore } from 'pinia'
import { UserStore } from '@/store/UserStore'
import  AuthClient  from '@/security/cryptoEngine/AuthClient'
import type { CreateUserDTO, LoginUser } from '@/store/TypesStore'



export interface UserData {
  id: number;
  email: string;
  name: string;
  dateBirth?: string; // ajuste conforme retornado pelo backend
}

export interface RecoverResponse {
  success: boolean;
  tokens: {
    refresh: string;
    access: string;
  };
  user: UserData;
}

export const UserRequisitions = defineStore('User requisitions', () => {

  async function recover(dataError?: { inputErro?: Uppercase<string>[] }): Promise<boolean> {
  try {
    // AuthClient.deleteRefreshTokenCookie();
    if (dataError?.inputErro && !dataError?.inputErro?.includes('TOKEN')) {
      throw new Error('Input error not related to token');
    }
    
    const securityClient = new SecurityClient();
    await securityClient.init();
    const token = await AuthClient.getRefreshTokenCookie();

    const res = await fetch(`http://localhost:3000/auth/tokens`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(await securityClient.encode({}, true)),
    });

    const json = await res.json();
    console.log('Resposta do servidor:', json);
    
    if (!res.ok) return false;

    const { tokens, user } = json as RecoverResponse;
    
    // Usar os dados do usuário que vieram diretamente do backend
    const user_store = UserStore();
    user_store.idUser = user.id;
    user_store.name = user.name;
    user_store.email = user.email// Armazenar todos os dados do usuário
    user_store.birthday = user.dateBirth ? new Date(user.dateBirth) : null;
    user_store.isLogged = true
    console.log('ID do usuário:', user.id);
    console.log('Dados completos do usuário:', user);
    console.log('Id do user na store', user_store.idUser);
    console.log('Refresh token:', tokens.refresh);
    console.log('Access token:', tokens.access);
    console.log(user_store.name, "Esse é o nome da lenda")
    // Limpar e atualizar tokens
    AuthClient.deleteRefreshTokenCookie();
    await AuthClient.setAccessToken(tokens.access);
    await AuthClient.setRefreshTokenCookie(tokens.refresh);
    
    return true;
  } catch (error) {
    console.error('Erro no recover:', error);
    return false;
  }
}

    async function login(req: LoginUser) {
  try {
    const user = UserStore()
    console.log('🔐 Iniciando processo de login...')
    const securityClient = new SecurityClient()
    await securityClient.init()
    const encoded = await securityClient.encode(req, true)

    console.log('📤 Dados criptografados enviados:', encoded)

    const res = await fetch(`http://localhost:3000/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encoded),
    })

    console.log('📬 Status da resposta:', res.status)

    // Primeiro, verificar o status antes de tentar parsear JSON
    if (!res.ok) {
      console.log('❌ Erro HTTP:', res.status)

      // Tentar obter a resposta como texto primeiro
      const errorText = await res.text()
      let errorMessage = `Erro ${res.status}`

      try {
        // Tentar parsear como JSON se possível
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch {
        // Se não for JSON, usar o texto puro
        errorMessage = errorText || errorMessage
      }

      return {
        success: false,
        errorText: errorMessage
      }
    }

    // Se status for OK, então processar como JSON
    let json
    try {
      const responseText = await res.text()
      console.log('📥 Resposta textual:', responseText)

      json = JSON.parse(responseText)
      console.log('📊 Resposta JSON:', json)
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', parseError)
      return {
        success: false,
        errorText: 'Resposta do servidor inválida'
      }
    }

    // Verificar se a estrutura esperada existe
    if (!json.data) {
      console.error('❌ Dados ausentes na resposta:', json)
      return {
        success: false,
        errorText: 'Estrutura de resposta inválida'
      }
    }

    const decodedData = await securityClient.decode(json.data)
    console.log('🔓 Dados descriptografados:', decodedData)

    // Verificar se os dados do usuário estão presentes
    if (!decodedData.dataUser) {
      console.error('❌ dataUser ausente nos dados descriptografados')
      return {
        success: false,
        errorText: 'Dados do usuário não recebidos'
      }
    }

    try {
      await AuthClient.setAccessToken(json.tokens.access)
      await AuthClient.setRefreshTokenCookie(json.tokens.refresh)
      console.log('✅ Tokens armazenados com sucesso')
    } catch (tokenError) {
      console.error('❌ Erro ao armazenar tokens:', tokenError)
      return {
        success: false,
        errorText: 'Erro ao processar tokens de autenticação'
      }
    }

    // ✅ Acessar os dados corretamente
    user.emailLogged = decodedData.dataUser.email
    user.birthdayLogged = decodedData.dataUser.dateBirth // ← Note: dateBirth, não birthday
    user.nameLogged = decodedData.dataUser.name
    user.isLogged = true

    console.log('👤 Dados do usuário atualizados:', {
      email: user.emailLogged,
      birthday: user.birthdayLogged,
      name: user.nameLogged,
      isLogged: user.isLogged
    })

    console.log('✅ Login realizado com sucesso')
    return {
      success: true,
      message: 'Login realizado com sucesso',
      userData: decodedData.dataUser,
      tokens: json.tokens // Usar tokens da resposta original, não os descriptografados
    }
  } catch (err) {
    console.error('💥 Erro no processo de login:', err)
    return {
      success: false,
      errorText: err instanceof Error ? err.message : 'Erro de conexão. Tente novamente.'
    }
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
      const text = await res.text()
console.log('📜 Resposta crua do servidor:', text)

let json
try {
  json = JSON.parse(text)
} catch {
  throw new Error('⚠️ Resposta não é JSON válido')
}
console.log('📥 Resposta JSON do servidor:', json)

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


  return { login, register, recover }
})
