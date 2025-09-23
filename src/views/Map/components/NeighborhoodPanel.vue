<script setup lang="ts">
import { NeighborhoodStore } from '@/store/NeighborhoodStore'
import { storeToRefs } from 'pinia'
import OccurrenceChart from './OccurenceChart.vue'

// Adicione a emissão de evento aqui
const emit = defineEmits(['view-occurrence-details'])

const neighborhoodStore = NeighborhoodStore()
const { selectedData, neighborhoodoccurrences, loading } = storeToRefs(neighborhoodStore)

function fechar() {
  neighborhoodStore.clearNeighborhood()
}

// Nova função para emitir o evento
function handleOccurrenceClick(occurrenceId: number) {
  emit('view-occurrence-details', occurrenceId)
}
</script>

<template>
  <div v-if="selectedData" class="details-container">
    <div class="details-content">
      <button class="close-button" @click="fechar">×</button>
      <h2>Ocorrências do Bairro</h2>

      <div v-if="loading" class="loading">Carregando ocorrências...</div>

      <div v-else class="occurrences-container">
        <OccurrenceChart :occurrences="neighborhoodoccurrences" />

        <h3>Ocorrências ({{ neighborhoodoccurrences.length }})</h3>

        <div v-if="neighborhoodoccurrences.length">
          <div
            v-for="occurrence in neighborhoodoccurrences"
            :key="occurrence.id"
            class="occurrence-item"
            @click="handleOccurrenceClick(occurrence.id)"
          >
            <p class="occurrence-user">
              <strong>Anônimo</strong> —
              <span class="occurrence-type">{{ occurrence.type.name }}</span>
            </p>
            <p class="occurrence-content">
              {{ occurrence.content }}
            </p>
            <p v-if="occurrence.coordenadas" class="occurrence-coords">
              <small>Coordenadas: {{ occurrence.coordenadas }}</small>
            </p>
            <p class="occurrence-date">
              <small>{{ new Date(occurrence.created_at).toLocaleDateString('pt-BR') }}</small>
            </p>
          </div>
        </div>
        <div v-else class="no-data">Nenhuma ocorrência disponível para este bairro.</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.details-container {
  position: fixed;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 420px; // <-- aumentei a largura
  max-width: 95vw; // pra não ultrapassar a viewport
  height: 90vh;
  background: var(--color-gray-dark);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease forwards;

  .details-content {
    flex: 1;
    padding: 20px; // mais espaço interno
    position: relative;
    color: var(--color-white);
    overflow-y: scroll;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
  }

  .details-content::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.6rem; // botão maior
    cursor: pointer;
    color: var(--color-white);

    &:hover {
      color: var(--color-gray-light, #ddd);
    }
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 1.5rem; // título mais destacado
  }

  h3 {
    font-size: 1.2rem;
    margin: 16px 0;
    border-bottom: 1px solid var(--color-gray-light);
    padding-bottom: 6px;
  }

  .loading {
    text-align: center;
    margin: 20px 0;
    color: #aaa;
  }

  .occurrences-container {
    margin-top: 14px;
  }

  .occurrence-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 14px;
    cursor: pointer; 
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .occurrence-user {
      font-size: 0.95rem;
      margin-bottom: 6px;
      color: var(--cinza-claro);
    }

    .occurrence-type {
      font-style: italic;
      font-size: 0.9rem;
      color: #bbb;
    }

    .occurrence-content {
      font-size: 1rem;
      line-height: 1.45;
      color: #f1f1f1;
      margin-bottom: 8px;

      display: -webkit-box;
      -webkit-line-clamp: 3;  
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

      white-space: pre-wrap;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    .occurrence-coords,
    .occurrence-date {
      font-size: 0.8rem;
      color: #888;
      margin: 2px 0;
    }
  }

  .no-data {
    text-align: center;
    margin: 14px 0;
    font-size: 1rem;
    color: #aaa;
  }
}

@keyframes slideIn {
  from {
    transform: translate(120%, -50%);
    opacity: 0;
  }
  to {
    transform: translate(0, -50%);
    opacity: 1;
  }
}

@media (max-width: 992px) {
  .details-container {
    top: 45%;
    right: 20px;
    left: 20px;
    width: auto;
    height: 85vh;
    animation: slideInMobile 0.3s ease forwards;
  }

  @keyframes slideInMobile {
    from {
      transform: translateY(120%);
      opacity: 0;
    }
    to {
      transform: translateY(-50%);
      opacity: 1;
    }
  }
}
</style>
