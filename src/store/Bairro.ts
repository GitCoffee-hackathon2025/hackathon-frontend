import { defineStore } from 'pinia'
import { ref } from 'vue'
import type L from 'leaflet'

export const useBairroStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, any> | null>(null)
  const mapInstance = ref<L.Map | null>(null) 

  function setMap(map: L.Map) {
    mapInstance.value = map
  }

  function selectBairro(data: Record<string, any>) {
    selectedData.value = data
  }

  function clearBairro() {
    selectedData.value = null
  }

  return { selectedData, mapInstance, setMap, selectBairro, clearBairro }
})