<script setup lang="ts">
import { useBairroStore } from '../store/Bairro'
const bairroStore = useBairroStore()

function fechar() {
  bairroStore.clearBairro()
}
</script>

<template>
  <div v-if="bairroStore.selectedId" class="detalhes-container">
    <div class="detalhes-content">
      <button class="close-button" @click="fechar">×</button>
      <h2>Detalhes do Bairro</h2>
      <p class="bairro-id">ID: {{ bairroStore.selectedId }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detalhes-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  width: 300px;
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;

  .detalhes-content {
    padding: 16px;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0 8px;
    &:hover {
      color: #333;
    }
  }

  h2 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1.2rem;
    color: #333;
  }

  .bairro-id {
    margin: 0;
    color: #555;
    font-size: 1rem;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .detalhes-container {
    width: 90%;
    left: 5%;
    bottom: 10px;
  }
}
</style>