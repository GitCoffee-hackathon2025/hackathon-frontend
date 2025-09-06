// stores/report.ts
import { defineStore } from "pinia"
import { ref } from "vue"

export const useReportStore = defineStore("report", () => {
  const reportContent = ref<string>("")
  const reportType = ref<string>("")
  const reportDate = ref<string>("") 
  const reportLocal = ref<string>("")

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
    sendReport,
  }
})
