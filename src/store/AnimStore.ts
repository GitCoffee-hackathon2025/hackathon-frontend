import { defineStore } from 'pinia'
import { ref } from 'vue'

export const AnimStore = defineStore('', () => {
  const animLogin = ref(false)
  const animRegister = ref(false)
  const isLoading = ref(false)

  return { animLogin, animRegister, isLoading }
})
