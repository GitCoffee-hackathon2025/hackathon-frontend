import { defineStore } from 'pinia'
import { ref } from 'vue'
import type L from 'leaflet'

export const NeighborhoodStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, any> | null>(null)
  const mapInstance = ref<L.Map | null>(null)

  const neighborhoodoccurrences = ref<any[]>([])
  const loading = ref(false)

  function setMap(map: L.Map) {
    mapInstance.value = map
  }

  function selectNeighborhood(data: Record<string, any>) {
    selectedData.value = data

    if (data.id) getDataNeighborhood(data.id)
  }

  function clearNeighborhood() {
    selectedData.value = null
    neighborhoodoccurrences.value = []
  }

  const getDataNeighborhood = async (idData: number): Promise<any> => {
    // console.log("Buscando occurrences do bairro para o ID:", idData)
    loading.value = true
    neighborhoodoccurrences.value = []

    try {
      const response = await fetch(`http://localhost:3000/occurrences/neighborhood/${idData}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const result = await response.json()
      // console.log('Resposta COMPLETA da API:', result)

      if (result.success && result.data && Array.isArray(result.data)) {
        // console.log('Dados dos occurrences recebidos:', result.data)

        // CORREÇÃO: Mapeamento correto baseado na estrutura da resposta
        const occurrencesData = result.data.map((occurrence: any) => {
          return {
            id: occurrence.id,
            content: occurrence.content,
            coordinates: occurrence.coordenadas,
            created_at: occurrence.created_at,
            user: occurrence.user
              ? { id: occurrence.user.id, name: occurrence.user.name }
              : { id: null, name: 'Usuário anônimo' },
            type: occurrence.type
              ? { id: occurrence.type.id, name: occurrence.type.name }
              : { id: null, name: 'Tipo não informado' },
            _fullData: occurrence, // Mantém todos os dados originais
          }
        })

        neighborhoodoccurrences.value = occurrencesData
        // console.log('occurrences processados:', bairrooccurrences.value)
      } else {
        // console.log('Nenhum dado encontrado ou formato inválido')
        neighborhoodoccurrences.value = []
      }
    } catch (err) {
      console.error('Erro ao buscar occurrences:', err)
      neighborhoodoccurrences.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    setMap,
    selectedData,
    neighborhoodoccurrences,
    loading,
    selectNeighborhood,
    clearNeighborhood,
    getDataNeighborhood,
    mapInstance,
  }
})
