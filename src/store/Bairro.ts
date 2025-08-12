import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBairroStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, any> | null>(null)

  function selectBairro(data: Record<string, any>) {
    selectedData.value = data
  }

  function clearBairro() {
    selectedData.value = null
  }

  return { selectedData, selectBairro, clearBairro }
})
