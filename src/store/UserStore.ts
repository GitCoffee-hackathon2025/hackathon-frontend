import { defineStore } from 'pinia'
import { ref } from 'vue'

export const UserStore = defineStore('User data', () => {
  // Dados do usuário para registro
  const name = ref<string>('')
  const email = ref<string>('')
  const password = ref<string>('')
  const birthday = ref<Date | null>(null)
  const idUser = ref<number>();
  // Estado de autenticação
  const emailToken = ref<number>()
  const isAuthenticated = ref<boolean>(false)
  const authToken = ref<number>()
  const currentUser = ref<null>(null)

  //Informações quando logado
  const isLogged = ref(false)
  const nameLogged = ref<string>('')
  const emailLogged = ref<string>('')
  const birthdayLogged = ref<Date | null>(null)

  // Função de logout
  const doLogout = (): void => {
    authToken.value = undefined
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
      authToken.value = Number(token)
      currentUser.value = JSON.parse(userData)
      isAuthenticated.value = true
    }
  }

  // Limpar dados da store
  const clearUserData = (): void => {
    name.value = ''
    email.value = ''
    password.value = ''
    birthday.value = null
  }

  return {
    // Dados do usuário
    name,
    email,
    password,
    birthday,
    idUser,
    
    //Informações logado
    nameLogged,
    emailLogged,
    birthdayLogged,
    isLogged,

    // Estado de autenticação
    emailToken,
    isAuthenticated,
    authToken,
    currentUser,

    // Funções
    doLogout,
    checkAuth,
    clearUserData,
  }
})
