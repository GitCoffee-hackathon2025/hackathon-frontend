<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <p>Para fazer uma ocorrência <br> primeiro selecione a localização no mapa.</p>
      <div class="buttons">
        <button @click="emit('confirm')">Ok</button>
        <button @click="emit('cancel')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: rgb(26, 25, 25);
  padding: 24px;
  border-radius: 14px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: white;
  animation: fadeInUp 0.6s ease-in-out;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  /* Garantir que o conteúdo não ultrapasse os limites */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-content p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  text-align: center;
  white-space: wrap;
  
  max-width: 100%;
  
  
  text-align: justify;
  text-justify: inter-word;
}


.buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.buttons button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 100px;
  font-size: 1rem;
  flex: 1;
  max-width: 120px;
}

.buttons button:first-child {
  background: #27ae60;
  color: white;
}

.buttons button:first-child:hover {
  background: #219653;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.buttons button:last-child {
  background: #7f8c8d;
  color: white;
}

.buttons button:last-child:hover {
  background: #636e72;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(127, 140, 141, 0.3);
}

.buttons button:active {
  transform: translateY(0);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsividade para telas menores */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-content {
    padding: 20px;
    max-width: 100%;
  }
  
  .modal-content p {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .buttons {
    gap: 10px;
  }
  
  .buttons button {
    padding: 10px 20px;
    min-width: 90px;
    font-size: 0.9rem;
  }
}

/* Para textos muito longos em dispositivos muito pequenos */
@media (max-width: 360px) {
  .modal-content p {
    font-size: 0.95rem;
  }
  
  .buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .buttons button {
    max-width: 100%;
    width: 100%;
  }
}
</style>