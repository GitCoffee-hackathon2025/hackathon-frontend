import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBairroStore = defineStore('bairro', () => {
  const selectedId = ref<string | null>(null)

  function selectBairro(id: string) {
    selectedId.value = id
  }

  function clearBairro() {
    selectedId.value = null
  }

  return { selectedId, selectBairro, clearBairro }
})
