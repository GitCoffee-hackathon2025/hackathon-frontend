<script setup lang="ts">
import { useBairroStore } from '@/store/Bairro'
import { storeToRefs } from 'pinia'

const bairroStore = useBairroStore()
const { selectedData, bairroReports, loading } = storeToRefs(bairroStore)

function fechar() {
  bairroStore.clearBairro()
}
</script>

<template>
  <div v-if="selectedData" class="detalhes-container">
    <div class="detalhes-content">
      <button class="close-button" @click="fechar">×</button>
      <h2>Reports do Bairro</h2>
      
      <!-- Use campos genéricos ou ajuste conforme sua API -->
      <p v-if="selectedData.nome">
        <strong>Bairro:</strong> {{ selectedData.nome }}
      </p>
      <p v-else-if="selectedData.name">
        <strong>Bairro:</strong> {{ selectedData.name }}
      </p>
      <p v-else-if="selectedData.nome_bairro">
        <strong>Bairro:</strong> {{ selectedData.nome_bairro }}
      </p>
      <p v-else>
        <strong>Bairro:</strong> {{ selectedData.id }}
      </p>
      
      <!-- Loading state -->
      <div v-if="loading" class="loading">
        Carregando reports...
      </div>
      
      <!-- Exibir reports do bairro -->
      <div v-else class="reports-container">
        <h3>Reports ({{ bairroReports.length }})</h3>
        
        <div v-if="bairroReports.length">
          <div v-for="report in bairroReports" :key="report.id" class="report-item">
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
        
        <div v-else class="no-data">
          Nenhum report disponível para este bairro.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detalhes-container {
  position: fixed;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 340px;
  max-width: 90vw;
  height: 90vh;
  background: var(--cinza);
  border-radius: 8px;
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease forwards;

  .detalhes-content {
    flex: 1;
    padding: 16px;
    position: relative;
    color: var(--branco);
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
    color: var(--branco);

    &:hover {
      color: var(--cinza-claro, #ddd);
    }
  }

  h2 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.1rem;
    margin: 12px 0;
    border-bottom: 1px solid var(--cinza-claro);
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

    .report-coords, .report-date {
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
  .detalhes-container {
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