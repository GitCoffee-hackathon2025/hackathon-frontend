<script setup lang="ts">
import { useBairroStore } from '@/store/Bairro'

const bairroStore = useBairroStore()

function fechar() {
  bairroStore.clearBairro()
}
</script>

<template>
  <div v-if="bairroStore.selectedData" class="detalhes-container">
    <div class="detalhes-content">
      <button class="close-button" @click="fechar">×</button>
      <h2>Reports do Bairro</h2>
      
      <p v-if="bairroStore.selectedData.nome_bairr">
        <strong>Bairro:</strong> {{ bairroStore.selectedData.nome_bairr }}
      </p>
      
      <!-- Exibir reports do bairro -->
      <div class="reports-container">
        <h3>Reports ({{ bairroStore.bairroReports.length }})</h3>
        
        <div v-if="bairroStore.bairroReports.length">
          <div v-for="(report, index) in bairroStore.bairroReports" :key="index" class="report-item">
            <div class="report-header">
              <strong>Report #{{ index + 1 }}</strong>
              <span class="user-name">por {{ report.userName }}</span>
            </div>
            <div class="report-content">
              {{ report.content }}
            </div>
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
  width: 350px;
  max-width: 90vw;
  height: 94vh;
  background: var(--cinza);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.25);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: Deslizadinha 0.4s ease-in-out forwards;

  .detalhes-content {
    flex: 1;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--branco);
    overflow-y: auto;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--branco);
    padding: 0 8px;
    
    &:hover {
      color: var(--cinza-claro, #ddd);
    }
  }

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.2rem;
    margin: 10px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--cinza-claro);
  }

  .reports-container {
    margin-top: 10px;
  }

  .report-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 15px;
    border-left: 3px solid var(--cinza-claro);
    
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .user-name {
        font-size: 0.85rem;
        color: var(--cinza-claro);
        font-style: italic;
      }
    }
    
    .report-content {
      font-size: 0.95rem;
      line-height: 1.4;
    }
  }

  .no-data {
    padding: 15px;
    text-align: center;
    border-radius: 6px;
    margin: 10px 0;
    background: rgba(100, 100, 100, 0.1);
    color: #aaaaaa;
  }
}

@keyframes Deslizadinha {
  0% {
    transform: translate(120%, -50%);
    opacity: 0;
  }
  100% {
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