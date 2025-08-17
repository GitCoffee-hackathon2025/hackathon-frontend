<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const searchNeighborhood = () => {}
</script>

<template>

    <div class="search-container">
      <div class="search-bar">
        <input
          type="text"
          placeholder="Pesquise seu bairro..."
          class="search-input"
          v-model="searchQuery"
          @keyup.enter="searchNeighborhood"
        />
        <button class="search-button" @click="searchNeighborhood">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
</template>

<style scoped lang="scss">
.search-container {
  position: absolute;
  top: 20px;
  left: 15%;
  transform: translateX(-50%);
  z-index: 1000000;
  width: 90%;
  max-width: 15vw;
}

.search-bar {
  display: flex;
  background: white;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
}

.search-input::placeholder {
  color: #888;
}

.search-button {
  background: none;
  border: none;
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: all 0.2s ease;
}

.search-button:hover {
  color: #333;
}

@media (min-width: 768px) {
  .search-container {
    top: 30px;
  }
}
</style>
