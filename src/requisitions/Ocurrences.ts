// stores/report.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { findBairroByCoordinates } from '@/utils/geoCoding'

export const useReportStore = defineStore('report', () => {
  const reportContent = ref<string>('')
  const reportType = ref<string>('')
  const reportDate = ref<string>('')
  const reportLocal = ref<string>('')
  const reportCoordinates = ref<{ lat: number; lng: number } | null>(null)
  const reportNeighborhood = ref<string>('') // Nova propriedade para o nome do bairro

  // Função para definir as coordenadas e buscar o bairro
  const setReportCoordinates = async (coords: { lat: number; lng: number }) => {
    reportCoordinates.value = coords

    // Buscar o nome do bairro baseado nas coordenadas
    const bairroName = await findBairroByCoordinates(coords.lat, coords.lng)
    if (bairroName) {
      reportNeighborhood.value = bairroName
      reportLocal.value = bairroName // Opcional: preencher também o local com o nome do bairro
    }
  }

  // função para enviar relatório
  const sendReport = async (userId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/reports/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          content: reportContent.value,
          type: reportType.value,
          date: new Date(reportDate.value).toISOString(),
          local: reportLocal.value,
          coordinates: reportCoordinates.value,
          bairro: reportBairro.value, // Incluir nome do bairro no envio
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          errorText: errorData.error,
          type: errorData.type,
        }
      }

      const data = await res.json()
      console.log('Relatório enviado com sucesso:', data)
      return data
    } catch (err) {
      return {
        success: false,
        errorText: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  return {
    reportContent,
    reportType,
    reportDate,
    reportLocal,
    reportCoordinates,
    reportNeighborhood,
    setReportCoordinates,
    sendReport,
  }
})
