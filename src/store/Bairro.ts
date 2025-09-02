import { defineStore } from 'pinia'
import { ref } from 'vue'
import type L from 'leaflet'

export const useBairroStore = defineStore('bairro', () => {
  const selectedData = ref<Record<string, any> | null>(null)
  const mapInstance = ref<L.Map | null>(null)
  const bairroReports = ref<any[]>([]) // Array para os reports
  const loading = ref(false)

  function setMap(map: L.Map) {
    mapInstance.value = map
  }

  function selectBairro(data: Record<string, any>) {
    selectedData.value = data
    // Buscar reports quando um bairro é selecionado
    if (data.id) {
      getDataBairro(data.id)
    }
  }

  function clearBairro() {
    selectedData.value = null
    bairroReports.value = [] // Limpa os reports
  }
  
  const getDataBairro = async (idData: number): Promise<any> => {
    console.log("Buscando reports do bairro para o ID:", idData)
    loading.value = true
    bairroReports.value = [] // Limpa reports anteriores
    
    try {
      const response = await fetch(`http://localhost:3000/reportsByNeighborhood/${idData}`, { 
        method: 'GET' 
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const result = await response.json()
      console.log('Resposta COMPLETA da API:', result)
      
      // Processa os dados para extrair apenas o que precisamos
      if (result.success && result.data && Array.isArray(result.data)) {
        console.log('Dados dos reports recebidos:', result.data)
        
        // Para cada report, criar objeto com informações básicas
        const reportsData = result.data.map((report: any, index: number) => {
          console.log(`Report ${index}:`, report)
          console.log(`id_user no report ${index}:`, report.id_user)
          console.log(`Tipo do id_user:`, typeof report.id_user)
          
          // Verifica se id_user existe e não é null/undefined
          const hasUserId = report.id_user !== null && 
                           report.id_user !== undefined && 
                           report.id_user !== '';
          
          // Define o nome do usuário baseado no id_user
          const userName = hasUserId 
            ? `Usuário #${report.id_user}` 
            : 'Usuário anônimo';
          
          console.log(`UserName definido para report ${index}:`, userName)
          
          return {
            content: report.content_report,
            userName: userName,
            userId: hasUserId ? report.id_user : null,
            // Adiciona todos os dados para debug
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