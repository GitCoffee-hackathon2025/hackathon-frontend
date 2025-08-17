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
      <h2>Detalhes do Bairro</h2>
      <p v-if="bairroStore.selectedData.nome_bairr">
        {{ bairroStore.selectedData.nome_bairr }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detalhes-container {
  position: fixed;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 300px;
  max-width: 90vw;
  height: 94vh;
  background: var(--cinza);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.25);
  z-index: 100000000000000;
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
    font-size: var(--texto-grande);
  }

  .bairro-id {
    font-size: var(--texto-medio);
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
    width: 90%;
    max-width: 500px;
  }
}
</style>
