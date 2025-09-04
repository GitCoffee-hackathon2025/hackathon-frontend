import { defineStore } from 'pinia'
import { ref } from 'vue'
import type L from 'leaflet'

export const useBairroStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, any> | null>(null)
  const mapInstance = ref<L.Map | null>(null)
  const bairroReports = ref<any[]>([])
  const loading = ref(false)

  function setMap(map: L.Map) {
    mapInstance.value = map
  }

  function selectBairro(data: Record<string, any>) {
    selectedData.value = data
    if (data.id) {
      getDataBairro(data.id)
    }
  }

  function clearBairro() {
    selectedData.value = null
    bairroReports.value = []
  }

  const getDataBairro = async (idData: number): Promise<any> => {
    console.log("Buscando reports do bairro para o ID:", idData)
    loading.value = true
    bairroReports.value = []

    try {
      const response = await fetch(`http://localhost:3000/reportsByNeighborhood/${idData}`, { 
        method: 'GET' 
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const result = await response.json()
      console.log('Resposta COMPLETA da API:', result)

      if (result.success && result.data && Array.isArray(result.data)) {
        console.log('Dados dos reports recebidos:', result.data)

        // Agora pega direto user e type
        const reportsData = result.data.map((report: any, index: number) => {
          return {
            id: report.id_report,
            content: report.content_report,
            neighborhoodId: report.id_neighborhood,
            user: report.user 
              ? { id: report.user.id_user, name: report.user.name }
              : { id: null, name: 'Usuário anônimo' },
            type: report.type 
              ? { id: report.type.id_type_report, name: report.type.name_type_report }
              : { id: null, name: 'Tipo não informado' },
            _fullData: report
          }
        })

        bairroReports.value = reportsData
        console.log('Reports processados:', bairroReports.value)
      } else {
        console.log('Nenhum dado encontrado ou formato inválido')
        bairroReports.value = []
      }
    } catch (error) {
      console.error('Erro ao buscar reports:', error)
      bairroReports.value = []
    } finally {
      loading.value = false
    }
  }

  return { 
    setMap, 
    selectedData, 
    bairroReports,
    loading,
    selectBairro, 
    clearBairro, 
    getDataBairro
  }
})
