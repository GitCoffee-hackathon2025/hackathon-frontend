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
  
  const getDataBairro = async (idData: number): Promise<any> => {
    console.log("ola")
    const response = await fetch(`http://localhost:3000/reportsByNeighborhood/${idData}`, { method: 'GET' })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Erro HTTP:', response.status, errText)
      throw new Error(`Erro na requisição: ${response.status}`)
    }


    const data = await response.json()
    console.log('Resposta JSON:', data)
    return data
  }

  return { setMap, selectedData, selectBairro, clearBairro, getDataBairro }
})