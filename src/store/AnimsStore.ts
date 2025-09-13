import { defineStore } from 'pinia'
import { ref } from 'vue'

export const AnimsStore = defineStore('', () => {
  const animLogin = ref(false)
  const animRegister = ref(false)

  return {animLogin, animRegister}
})
