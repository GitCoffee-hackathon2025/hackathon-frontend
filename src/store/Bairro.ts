import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBairroStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, unknown> | null>(null)

  function selectBairro(data: Record<string, unknown>) {
    selectedData.value = data
  }

  function clearBairro() {
    selectedData.value = null
  }

  return { selectedData, selectBairro, clearBairro }
})
