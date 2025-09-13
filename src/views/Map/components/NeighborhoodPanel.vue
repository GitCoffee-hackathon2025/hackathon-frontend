<script setup lang="ts">
import { NeighborhoodStore } from '@/store/NeighborhoodStore'
import { storeToRefs } from 'pinia'

const neighborhoodStore =NeighborhoodStore()
const { selectedData, neighbohoodReports, loading } = storeToRefs(neighborhoodStore)

function fechar() {
  neighborhoodStore.clearNeighborhood()
}
</script>

<template>
  <div v-if="selectedData" class="details-container">
    <div class="details-content">
      <button class="close-button" @click="fechar">×</button>
      <h2>Reports do Bairro</h2>

      <!-- Use campos genéricos ou ajuste conforme sua API -->
      <p>
        <strong
          >Bairro:
          {{
            [selectedData.nome, selectedData.name, selectedData.nome_bairro, selectedData.id].find(
              (neighborhoodName) => neighborhoodName !== '' && neighborhoodName != null,
            ) ?? 'Bairro não informado'
          }}
        </strong>
      </p>

      <!-- Loading state -->
      <div v-if="loading" class="loading">Carregando reports...</div>

      <!-- Exibir reports do bairro -->
      <div v-else class="reports-container">
        <h3>Reports ({{ neighbohoodReports.length }})</h3>

        <div v-if="neighbohoodReports.length">
          <div v-for="report in neighbohoodReports" :key="report.id" class="report-item">
            <p class="report-user">
              <strong>{{ report.user.name }}</strong> —
              <span class="report-type">{{ report.type.name }}</span>
            </p>
            <p class="report-content">
              {{ report.content }}
            </p>
            <p v-if="report.coordenadas" class="report-coords">
              <small>Coordenadas: {{ report.coordenadas }}</small>
            </p>
            <p class="report-date">
              <small>{{ new Date(report.created_at).toLocaleDateString('pt-BR') }}</small>
            </p>
          </div>
        </div>

        <div v-else class="no-data">Nenhum report disponível para este bairro.</div>
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
  width: 340px;
  max-width: 90vw;
  height: 90vh;
  background: var(--color-gray-dark);
  border-radius: 8px;
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease forwards;

  .details-content {
    flex: 1;
    padding: 16px;
    position: relative;
    color: var(--color-white);
    overflow-y: auto;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    color: var(--color-white);

    &:hover {
      color: var(--color-gray-light, #ddd);
    }
  }

  h2 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.1rem;
    margin: 12px 0;
    border-bottom: 1px solid var(--color-gray-light);
    padding-bottom: 4px;
  }

  .loading {
    text-align: center;
    margin: 20px 0;
    color: #aaa;
  }

  .reports-container {
    margin-top: 10px;
  }

  .report-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 12px;

    .report-user {
      font-size: 0.9rem;
      margin-bottom: 6px;
      color: var(--cinza-claro);
    }

    .report-type {
      font-style: italic;
      font-size: 0.85rem;
      color: #bbb;
    }

    .report-content {
      font-size: 0.95rem;
      line-height: 1.4;
      color: #f1f1f1;
      margin-bottom: 8px;
    }

    .report-coords,
    .report-date {
      font-size: 0.8rem;
      color: #888;
      margin: 2px 0;
    }
  }

  .no-data {
    text-align: center;
    margin: 12px 0;
    font-size: 0.9rem;
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
    top: auto;
    bottom: 20px;
    right: 20px;
    transform: none;
    height: auto;
    max-height: 80vh;
    width: 90%;
    max-width: 500px;
  }
}
</style>
