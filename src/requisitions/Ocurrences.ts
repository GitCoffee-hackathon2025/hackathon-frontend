// stores/occurrence.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { findNeighborhoodByCoordinates } from '@/utils/geocoding'

export const ocurrenceRequisitions = defineStore('occurrence', () => {
  const occurrenceContent = ref<string>('')
  const occurrenceType = ref<string>('')
  const occurrenceDate = ref<string>('')
  const occurrenceLocal = ref<string>('')
  const occurrenceCoordinates = ref<{ lat: number; lng: number } | null>(null)
  const occurrenceNeighborhood = ref<string>('') // Nova propriedade para o nome do bairro

  // Função para definir as coordenadas e buscar o bairro
  const setoccurrenceCoordinates = async (coords: { lat: number; lng: number }) => {
    occurrenceCoordinates.value = coords

    // Buscar o nome do bairro baseado nas coordenadas
    const neighborhoodName = await findNeighborhoodByCoordinates(coords.lat, coords.lng)
    if (neighborhoodName) {
      occurrenceNeighborhood.value = neighborhoodName
      occurrenceLocal.value = neighborhoodName // Opcional: preencher também o local com o nome do bairro
    }
  }

  // função para enviar relatório
  const sendoccurrence = async (userId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REQ}/occurrences/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          content: occurrenceContent.value,
          type: occurrenceType.value,
          date: new Date(occurrenceDate.value).toISOString(),
          local: occurrenceLocal.value,
          coordinates: occurrenceCoordinates.value,
          bairro: occurrenceNeighborhood.value, // Incluir nome do bairro no envio
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
      //console.log('Relatório enviado com sucesso:', data)
      return data
    } catch (err) {
      return {
        success: false,
        errorText: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  return {
    occurrenceContent,
    occurrenceType,
    occurrenceDate,
    occurrenceLocal,
    occurrenceCoordinates,
    occurrenceNeighborhood,
    setoccurrenceCoordinates,
    sendoccurrence,
  }
})
