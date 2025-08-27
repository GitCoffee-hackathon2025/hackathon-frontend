import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Interfaces para tipagem
export interface UserData {
  userName: string
  userEmail: string
  userPassword: string
  userTelefone: string
  userDateBirth: Date | null
}

export interface LoginData {
  userEmail: string
  userPassword: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export const useDataUserStore = defineStore('DataUser', () => {
  // Dados do usuário para registro
  const userName = ref<string>('')
  const userEmail = ref<string>('')
  const userPassword = ref<string>('')
  const userTelefone = ref<string>('')
  const userDateBirth = ref<Date | null>(null)
  
  // Estado de autenticação
  const isAuthenticated = ref<boolean>(false)
  const authToken = ref<string>('')
  const currentUser = ref<any | null>(null)

    watch(userEmail, (newVal, oldVal) => {
    console.log(`userEmail mudou de "${oldVal}" para "${newVal}"`)
  })

  watch(userPassword, (newVal, oldVal) => {
    console.log(`userPassword mudou de "${oldVal}" para "${newVal}"`)
  })
  // Função de registro
  const registerUser = async (): Promise<AuthResponse> => {
    try {
      if (!userName.value || !userEmail.value || !userPassword.value) {
        return {
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        }
      }

      const userData: UserData = {
        userName: userName.value,
        userEmail: userEmail.value,
        userPassword: userPassword.value,
        userTelefone: userTelefone.value,
        userDateBirth: userDateBirth.value
      }

      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || 'Erro ao registrar usuário'
        }
      }

      const result = await response.json()
      
      return {
        success: true,
        message: 'Usuário registrado com sucesso',
        token: result.token,
        user: result.user
      }

    } catch (error) {
      console.error('Erro no registro:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.'
      }
    }
  }

  // Função de login
  const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      
      if (!email || !password) {
        return {
          success: false,
          message: 'Email e senha são obrigatórios'
        }
      }
     

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || 'Erro ao fazer login'
        }
      }

      const result = await response.json()
      
      // Salvar token e dados do usuário
      authToken.value = result.token
      currentUser.value = result.user
      isAuthenticated.value = true
      
      // Salvar no localStorage (opcional)
      localStorage.setItem('authToken', result.token)
      localStorage.setItem('userData', JSON.stringify(result.user))

      return {
        success: true,
        message: 'Login realizado com sucesso',
        token: result.token,
        user: result.user
      }

    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.'
      }
    }
  }

  // Função de logout
  const logoutUser = (): void => {
    authToken.value = ''
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  // Verificar autenticação ao inicializar
  const checkAuth = (): void => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      authToken.value = token
      currentUser.value = JSON.parse(userData)
      isAuthenticated.value = true
    }
  }

  // Limpar dados da store
  const clearUserData = (): void => {
    userName.value = ''
    userEmail.value = ''
    userPassword.value = ''
    userTelefone.value = ''
    userDateBirth.value = null
  }

  return { 
    // Dados do usuário
    userName, 
    userEmail, 
    userPassword, 
    userTelefone, 
    userDateBirth,
    
    // Estado de autenticação
    isAuthenticated,
    authToken,
    currentUser,
    
    // Funções
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    clearUserData
  }
})