import { defineStore } from 'pinia'
import { ref } from 'vue'
import type L from 'leaflet'

export const NeighborhoodStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, any> | null>(null)
  const mapInstance = ref<L.Map | null>(null)

  const neighbohoodReports = ref<any[]>([])
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
    neighbohoodReports.value = []
  }



  const getDataNeighborhood = async (idData: number): Promise<any> => {
    // console.log("Buscando reports do bairro para o ID:", idData)
    loading.value = true
    neighbohoodReports.value = []

    try {
      const response = await fetch(`http://localhost:3000/reportsByNeighborhood/${idData}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const result = await response.json()
      // console.log('Resposta COMPLETA da API:', result)

      if (result.success && result.data && Array.isArray(result.data)) {
        // console.log('Dados dos reports recebidos:', result.data)

        // CORREÇÃO: Mapeamento correto baseado na estrutura da resposta
        const reportsData = result.data.map((report: any) => {
          return {
            id: report.id,
            content: report.content,
            coordinates: report.coordenadas,
            created_at: report.created_at,
            user: report.user
              ? { id: report.user.id, name: report.user.name }
              : { id: null, name: 'Usuário anônimo' },
            type: report.type
              ? { id: report.type.id, name: report.type.name }
              : { id: null, name: 'Tipo não informado' },
            _fullData: report, // Mantém todos os dados originais
          }
        })

        neighbohoodReports.value = reportsData
        // console.log('Reports processados:', bairroReports.value)
      } else {
        // console.log('Nenhum dado encontrado ou formato inválido')
        neighbohoodReports.value = []
      }
    } catch (err) {
      console.error('Erro ao buscar reports:', err)
      neighbohoodReports.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    setMap,
    selectedData,
    neighbohoodReports,
    loading,
    selectNeighborhood,
    clearNeighborhood,
    getDataNeighborhood,
    mapInstance
  }
})
