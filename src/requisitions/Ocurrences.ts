  import SecurityClient from '@/security/cryptoEngine/SecurityClient'
  import AuthClient from '@/security/cryptoEngine/AuthClient'
  import { defineStore } from 'pinia'
  import { ref } from 'vue'
  import { findNeighborhoodByCoordinates } from '@/utils/geocoding'

  // Tipos de ocorrência baseados na imagem
  export const OCCURRENCE_TYPES = [
    { id: 1, name: 'Acidente de trânsito' },
    { id: 2, name: 'Assalto' },
    { id: 3, name: 'Roubo' },
    { id: 4, name: 'Furto' },
    { id: 5, name: 'Perturbação da paz' },
    { id: 6, name: 'Vandalismo' },
    { id: 7, name: 'Incêndio' },
    { id: 8, name: 'Acidente doméstico' },
    { id: 9, name: 'Assédio' },
    { id: 10, name: 'Desaparecimento' },
    { id: 11, name: 'Problema de infraestrutura' },
    { id: 12, name: 'Animal solto' },
    { id: 13, name: 'Outro' }
  ]

  export const ocurrenceRequisitions = defineStore('occurrence', () => {
    const occurrenceContent = ref<string>('')
    const occurrenceType = ref<number | null>(null)
    const occurrenceDate = ref<string>('')
    const occurrenceLocal = ref<string>('')
    const occurrenceCoordinates = ref<{ lat: number; lng: number } | null>(null)
    const occurrenceNeighborhood = ref<number | null>(null)

    // Função para buscar coordenadas das ocorrências
    const fetchOccurrencesCoordinates = async () => {
      try {
        const securityClient = new SecurityClient()
        await securityClient.init()
        
        const response = await fetch('http://localhost:3000/occurrences/coordenates', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (!response.ok) {
          throw new Error('Erro ao buscar coordenadas')
        }
        
        const data = await response.json()
        
        
        // Decodificar se necessário
        let decodedData
        if (data.header && data.data) {
          decodedData = await securityClient.decode(data)
        } else {
          decodedData = data
        }
        
        // Processar os dados para extrair o id_type_occurrence do objeto type
        if (decodedData && decodedData.success && decodedData.data) {
          decodedData.data = decodedData.data.map((occurrence: any) => ({
            id_occurrence: occurrence.id_occurrence,
            coordenadas: occurrence.coordenadas,
            // Extrair id_type_occurrence do objeto type, se existir
            id_type_occurrence: occurrence.type?.id_type_occurrence || null
          }))
        }
        
        return decodedData
      } catch (error) {
        console.error('Erro ao buscar coordenadas:', error)
        return null
      }
    }

    // Define coordenadas e busca bairro
    const setOccurrenceCoordinates = async (coords: { lat: number; lng: number }, neighborhoodId?: number) => {
      occurrenceCoordinates.value = coords

      if (neighborhoodId) {
        console.log('Definindo bairro por ID:', neighborhoodId)
        occurrenceNeighborhood.value = neighborhoodId
      } else {
        const bairro = await findNeighborhoodByCoordinates(coords.lat, coords.lng)
        if (bairro) {
          occurrenceNeighborhood.value = bairro.id
          occurrenceLocal.value = bairro.name
          console.log('Bairro encontrado:', bairro.name, 'ID:', bairro.id)
        } else {
          console.log('Nenhum bairro encontrado para as coordenadas:', coords)
        }
      }
    }

    // Envia relatório
    const sendOccurrence = async () => {
      console.log('=== sendOccurrence chamado ===')

      try {
        console.log('Valores atuais:')
        console.log('Tipo:', occurrenceType.value)
        console.log('Conteúdo:', occurrenceContent.value)
        console.log('Data:', occurrenceDate.value)
        console.log('Coordenadas:', occurrenceCoordinates.value)
        console.log('Bairro ID:', occurrenceNeighborhood.value)

        if (!occurrenceType.value) {
          console.error('Tipo de ocorrência não selecionado.')
          return { success: false, errorText: 'Selecione um tipo de ocorrência.' }
        }

        if (!occurrenceDate.value) {
          console.error('Data inválida:', occurrenceDate.value)
          return { success: false, errorText: 'Informe uma data válida.' }
        }

        const isoDate = new Date(occurrenceDate.value).toISOString()
        console.log('Data convertida para ISO:', isoDate)

        const securityClient = new SecurityClient()
        console.log('Instanciado SecurityClient')
        await securityClient.init()
        console.log('SecurityClient inicializado')

        const payload = {
          content_occurrence: occurrenceContent.value,
          id_type_occurrence: occurrenceType.value,
          date_occurrence: isoDate,
          coordenadas: JSON.stringify(occurrenceCoordinates.value),
          id_neighborhood: occurrenceNeighborhood.value,
        }

        console.log('Payload pronto para encode:', payload)

        let encoded
        try {
          encoded = await securityClient.encode(payload, true)
          console.log('Encode feito com sucesso:', encoded)
        } catch (err) {
          console.error('Erro no encode:', err)
          return { success: false, errorText: 'Erro ao codificar os dados' }
        }

        const fetchUrl = `http://localhost:3000/occurrences/register`
        console.log('Enviando fetch para o backend em:', fetchUrl)
        console.log('Body do fetch:', JSON.stringify(encoded))

        const res = await fetch(fetchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': await AuthClient.getAccessToken()},
          body: JSON.stringify(encoded),
        })

        console.log('Fetch enviado. Status HTTP:', res.status)
        const text = await res.text()
        console.log('Resposta bruta do backend:', text)

        if (!text) {
          console.warn('Resposta vazia do backend!')
        }

        let responseData: any
        try {
          responseData = JSON.parse(text)
          console.log('Resposta parseada com sucesso:', responseData)
        } catch (err) {
          console.error('Erro ao fazer parse do JSON:', err)
          return { success: false, errorText: 'Resposta inválida do servidor' }
        }

        let decoded: any
        try {
          if (responseData.header && responseData.data) {
            decoded = await securityClient.decode(responseData)
            console.log('Decodificação feita com sucesso:', decoded)
          } else {
            decoded = responseData
            console.log('Não precisava decodificar, usando JSON puro:', decoded)
          }
        } catch (err) {
          console.error('Falha ao decodificar:', err, responseData)
          return { success: false, errorText: 'Erro ao processar a resposta' }
        }


        if (!res.ok) {
          console.error('Resposta HTTP não OK:', decoded)
          return { success: false, errorText: decoded.message || 'Erro desconhecido' }

        }

        console.log('Relatório decodificado final:', decoded)
        return { success: true, data: decoded }

      } catch (err) {
        console.error('Erro de conexão ou inesperado:', err)
        return { success: false, errorText: 'Erro de conexão. Tente novamente.' }
      }
    }

    // Limpar dados do formulário
    const clearFormData = () => {
      occurrenceContent.value = ''
      occurrenceType.value = null
      occurrenceDate.value = ''
      occurrenceLocal.value = ''
      occurrenceCoordinates.value = null
      occurrenceNeighborhood.value = null
    }

    return {
      occurrenceContent,
      occurrenceType,
      occurrenceDate,
      occurrenceLocal,
      occurrenceCoordinates,
      occurrenceNeighborhood,
      setOccurrenceCoordinates,
      sendOccurrence,
      fetchOccurrencesCoordinates,
      clearFormData
    }
  })