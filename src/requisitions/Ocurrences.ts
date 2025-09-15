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
      occurrenceLocal.value = neighborhoodName
    }
  }

  // função para enviar relatório
 const sendoccurrence = async () => {
  try {
    const dateValue = occurrenceDate.value;
    if (!dateValue) {
      console.error("Data inválida:", dateValue);
      return;
    }

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.error("Data inválida:", date);
      return;
    }

    const isoDate = date.toISOString();

    const res = await fetch(`${import.meta.env.VITE_REQ}/occurrences/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: occurrenceContent.value,
        type: occurrenceType.value,
        date: isoDate,
        local: occurrenceLocal.value,
        coordinates: occurrenceCoordinates.value,
        bairro: occurrenceNeighborhood.value,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erro na requisição:", errorData);
      return {
        success: false,
        errorText: errorData.error,
        type: errorData.type,
      };
    }

    const data = await res.json();
    console.log('Relatório enviado com sucesso:', data);
    return data;
  } catch (err) {
    console.error("Erro de conexão ou outro erro inesperado:", err);
    return {
      success: false,
      errorText: 'Erro de conexão. Tente novamente.',
    };
  }
};


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
