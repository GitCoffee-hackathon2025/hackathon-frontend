// stores/report.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { findBairroByCoordinates } from "@/utils/geocoding"

export const useReportStore = defineStore("report", () => {
  const reportContent = ref<string>("")
  const reportType = ref<string>("")
  const reportDate = ref<string>("") 
  const reportLocal = ref<string>("")
  const reportCoordinates = ref<{ lat: number; lng: number } | null>(null)
  const reportBairro = ref<string>("") // Nova propriedade para o nome do bairro

  // Função para definir as coordenadas e buscar o bairro
  const setReportCoordinates = async (coords: { lat: number; lng: number }) => {
    reportCoordinates.value = coords
    
    // Buscar o nome do bairro baseado nas coordenadas
    const bairroName = await findBairroByCoordinates(coords.lat, coords.lng)
    if (bairroName) {
      reportBairro.value = bairroName
      reportLocal.value = bairroName // Opcional: preencher também o local com o nome do bairro
    }
  }

  // função para enviar relatório
  const sendReport = async (userId: number) => {
    try {
      const response = await fetch("http://localhost:3000/reports/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      if (!response.ok) {
        throw new Error(`Erro ao enviar relatório: ${response.status}`)
      }

      const data = await response.json()
      console.log("Relatório enviado com sucesso:", data)
      return data
    } catch (error) {
      console.error("Erro no envio:", error)
      throw error
    }
  }

  return {
    reportContent,
    reportType,
    reportDate,
    reportLocal,
    reportCoordinates,
    reportBairro,
    setReportCoordinates,
    sendReport,
  }
})