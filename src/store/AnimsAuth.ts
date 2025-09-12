import { defineStore } from 'pinia'
import { ref } from 'vue'

export const AnimsAuthStore = defineStore('', () => {
  const animLogin = ref(false)
  const animRegister = ref(false)

  return {animLogin, animRegister}
})
