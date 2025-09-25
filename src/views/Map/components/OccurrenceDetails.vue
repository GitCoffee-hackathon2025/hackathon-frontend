<template>
  <div class="occurrence-details" :class="{ 'show': showDetails }">
    <div class="details-header">
      <button class="back-button" @click="closeDetails">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
      <h2>Detalhes da Ocorrência</h2>
    </div>

    <div class="details-content" v-if="occurrence">
      <div class="occurrence-type">
        <span
          class="type-badge"
          v-if="occurrence.type"
          :style="{ backgroundColor: getTypeColor(occurrence.type.id) }"
        >
          {{ getOccurrenceTypeName(occurrence.type.id) }}
        </span>
        <span
          class="type-badge"
          v-else
          :style="{ backgroundColor: '#95a5a6' }"
        >
          Desconhecido
        </span>
      </div>

      <div class="occurrence-info">
        <div class="info-item">
          <h3>Descrição</h3>
          <p>{{ occurrence.content || 'Nenhuma descrição fornecida' }}</p>
        </div>

        <div class="info-item" v-if="occurrence.created_at">
          <h3>Data</h3>
          <p>{{ formatDate(occurrence.created_at) }}</p>
        </div>

        <div class="info-item" v-if="occurrence.coordenadas">
          <h3>Localização</h3>
          <p>{{ formatCoordinates(occurrence.coordenadas) }}</p>
          <button class="view-location-btn" @click="focusOnLocation">
            Ver no mapa
          </button>
        </div>
      </div>
    </div>

    <div class="loading-spinner" v-else>
      Carregando detalhes...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OCCURRENCE_TYPES } from '@/requisitions/Ocurrences';

interface Occurrence {
  id: number;
  content: string;
  coordenadas: string;
  created_at: string;
  type: {
    id: number;
    name: string;
  } | null;
}

const props = defineProps<{
  occurrenceId: number | null;
}>();

const emit = defineEmits(['close', 'focusLocation']);

const showDetails = ref(false);
const occurrence = ref<Occurrence | null>(null);

const getOccurrenceTypeName = (typeId: number): string => {
  const type = OCCURRENCE_TYPES.find(t => t.id === typeId);
  return type ? type.name : 'Desconhecido';
};

const getTypeColor = (typeId: number): string => {
  const colors: Record<number, string> = {
    1: '#e74c3c', 2: '#c0392b', 3: '#e74c3c', 7: '#c0392b', 9: '#c0392b',
    4: '#f39c12', 5: '#f1c40f', 6: '#e67e22', 8: '#e67e22',
    10: '#3498db', 11: '#2980b9', 12: '#27ae60', 13: '#95a5a6'
  };
  return colors[typeId] || '#95a5a6';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatCoordinates = (coordsString: string): string => {
  try {
    const coords = JSON.parse(coordsString);
    return `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(6)}`;
  } catch {
    return coordsString;
  }
};

const focusOnLocation = () => {
  if (occurrence.value && occurrence.value.coordenadas) {
    try {
      const coords = JSON.parse(occurrence.value.coordenadas);
      emit('focusLocation', coords);
    } catch (error) {
      console.error('Erro ao processar coordenadas:', error);
    }
  }
};

const closeDetails = () => {
  showDetails.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);
};

// --- Função Corrigida ---
const fetchOccurrenceDetails = async () => {
  if (!props.occurrenceId || typeof props.occurrenceId !== 'number') {
    console.error('ID da ocorrência inválido, não é possível buscar os detalhes.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/occurrences/${props.occurrenceId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes da ocorrência');
    }

    const result = await response.json();

    // Atribui o objeto 'data' da resposta para a variável 'occurrence'
    occurrence.value = result.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    occurrence.value = null; // Garante que a interface de carregamento seja exibida em caso de falha
  }
};

onMounted(() => {
  fetchOccurrenceDetails();
  setTimeout(() => {
    showDetails.value = true;
  }, 10);
});
</script>

<style scoped lang="scss">
.occurrence-details {
  position: fixed;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 420px;
  max-width: 95vw;
  height: 90vh;
  background: rgba(29, 30, 28, 0.9);
  border-radius: 10px;
  box-shadow:  var(--shadow-default);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease forwards;
}

.details-header {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  background: transparent;
  color: var(--color-white, #fff);
  position: relative;

  h2 {
    margin: 0;
    font-size: 1.4rem;
  }
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white, #fff);

  svg {
    width: 26px;
    height: 26px;
  }

  &:hover {
    color: var(--color-gray-light, #ddd);
  }
}

.details-content {
  flex: 1;
  padding: 20px;
  position: relative;
  color: var(--color-white, #fff);
  overflow-y: auto;
}

.occurrence-type {
  margin-bottom: 1.8rem;
}

.type-badge {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow:  var(--shadow-default);
}

.occurrence-info .info-item {
  margin-bottom: 1.4rem;

  h3 {
    margin: 0 0 0.4rem 0;
    font-size: 1.05rem;
    color: var(--color-gray-light, #ddd);
  }

  p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.45;
    color: #f1f1f1;

    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

.view-location-btn {
  margin-top: 0.6rem;
  padding: 0.55rem 1.2rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;

  &:hover {
    background: #2980b9;
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #aaa;
  font-size: 1rem;
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
  .occurrence-details {
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
