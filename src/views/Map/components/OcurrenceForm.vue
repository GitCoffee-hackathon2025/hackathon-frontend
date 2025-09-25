<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { ocurrenceRequisitions } from '@/requisitions/Ocurrences' // Ajuste o caminho conforme necessário

const emit = defineEmits(['close'])


const ocurrenceReq = ocurrenceRequisitions()
const message = ref('')

// Tipos de ocorrência mais completos
const occurrenceTypes = [
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
  { id: 13, name: 'Tráfico de drogas' },
  { id: 14, name: 'Outro' }
]

// Focar no marcador quando o componente for montado
onMounted(() => {
  if (ocurrenceReq.occurrenceCoordinates && window.map) {
    const { lat, lng } = ocurrenceReq.occurrenceCoordinates
    window.map.flyTo([lat, lng], 16, {
      duration: 1,
      easeLinearity: 0.25
    })
  }
})

async function sendOcurrence() {
  try {
    console.log('Enviando ocorrência:', {
      type: ocurrenceReq.occurrenceType,
      date: ocurrenceReq.occurrenceDate,
      content: ocurrenceReq.occurrenceContent,
      coordinates: ocurrenceReq.occurrenceCoordinates,

      neighborhood: ocurrenceReq.occurrenceNeighborhood
    })
    const result = await ocurrenceReq.sendOccurrence()

    if (result.success) {
      message.value = 'Relatório enviado com sucesso!'

      // Fechar o formulário após envio bem-sucedido
      setTimeout(() => {
        emit('close')
        window.location.reload()
      }, 1500)
    } else {
      message.value = result.errorText || 'Ocorreu um erro ao enviar.'
    }
  } catch (error: any) {
    message.value = error.message || 'Ocorreu um erro ao enviar.'
  }
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div class="form-sidebar">
    <div class="sidebar-header">
      <h2>Criar Ocorrência</h2>
      <button class="close-btn" @click="handleClose">×</button>
    </div>

    <div class="sidebar-content">
      <!-- Localização (pré-preenchida com o bairro) -->
      <div class="form-group">
        <label>Bairro:</label>
        <input
  type="text"
  v-model="ocurrenceReq.occurrenceLocal"
  class="form-input"
  :placeholder="ocurrenceReq.occurrenceNeighborhood?.toString() || 'Local não identificado'"
  readonly
  disabled
>
      </div>

      <!-- Tipo de Ocorrência -->
      <div class="form-group">
        <label>Tipo de Ocorrência:</label>
        <select v-model.number="ocurrenceReq.occurrenceType" class="form-input">
  <option value="" disabled selected>Escolha o tipo de ocorrência</option>
  <option v-for="type in occurrenceTypes" :key="type.id" :value="type.id">
    {{ type.name }}
  </option>
</select>

      </div>

      <!-- Data -->
      <div class="form-group">
        <label>Data do ocorrido:</label>
        <input
          type="date"
          v-model="ocurrenceReq.occurrenceDate"
          class="form-input"
        />
      </div>

      <!-- Descrição -->
      <div class="form-group">
        <label>Descrição:</label>
        <textarea
          v-model="ocurrenceReq.occurrenceContent"
          class="form-textarea"
          placeholder="Descreva detalhadamente o que aconteceu..."
        ></textarea>
      </div>

      <!-- Coordenadas (apenas para visualização) -->
      <div class="form-group" v-if="ocurrenceReq.occurrenceCoordinates">
        <label>Coordenadas:</label>
        <div class="coordinates-display">
          Lat: {{ ocurrenceReq.occurrenceCoordinates.lat.toFixed(6) }},
          Lng: {{ ocurrenceReq.occurrenceCoordinates.lng.toFixed(6) }}
        </div>
      </div>

      <!-- Mensagem de status -->
      <div v-if="message" class="message" :class="{
        error: message.includes('erro') || message.includes('Erro'),
        success: message.includes('sucesso')
      }">
        {{ message }}
      </div>

      <!-- Botão de enviar -->
      <button class="submit-btn" @click="sendOcurrence" :disabled="!ocurrenceReq.occurrenceType">
        Enviar Ocorrência
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  max-width: 100%;
  height: 100vh;
  background: rgb(26, 25, 25);
  color: white;
  z-index: 1000;
 box-shadow :  var(--shadow-default);
  animation: slideInRight 0.3s ease-out;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #2c3e50;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #e74c3c;
}

.sidebar-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-input,
.form-textarea,
select {
  width: 100%;
  box-sizing: border-box;
}


.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #ecf0f1;
}

.location-note {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #95a5a6;
  font-style: italic;
}

.coordinates-display {
  padding: 10px;
  background: #34495e;
  border-radius: 5px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #bdc3c7;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #34495e;
  border-radius: 5px;
  background: #2c3e50;
  color: white;
  font-size: 1rem;

  white-space: pre-wrap;       /* respeita quebra de linha */
  overflow-wrap: break-word;   /* quebra palavras muito longas */
  word-wrap: break-word;       /* fallback */

}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
 box-shadow :  var(--shadow-default);
}

.form-textarea {
  height: 120px;
  resize: vertical;
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
}

.message.error {
  background: #e74c3c;
  color: white;
}

.message.success {
  background: #27ae60;
  color: white;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #219653;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #7f8c8d;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-btn:active {
  transform: translateY(0);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .form-sidebar {
    width: 100%;
  }

  .sidebar-content {
    padding: 15px;
  }

  .form-input,
  .form-textarea {
    padding: 12px;
  }
}
</style>
