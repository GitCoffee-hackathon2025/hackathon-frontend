<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NeighborhoodStore } from '@/store/NeighborhoodStore'
import L from 'leaflet'

const search = ref('')
const neighborhoods = ref<any[]>([])
const sugestions = ref<any[]>([])
const neighborhoodStore = NeighborhoodStore()

onMounted(async () => {
  try {
    const res = await fetch('/geojson/JoinvilleNeighborhoods.geojson')
    const data = await res.json()
    neighborhoods.value = data.features || []
  } catch (err) {
    console.error('Erro ao carregar bairros:', err)
  }
})

const filterSugestions = () => {
  const term = search.value.toLowerCase()
  if (term.length < 2) {
    sugestions.value = []
    return
  }
  sugestions.value = neighborhoods.value
    .filter((f) => f.properties?.nome_bairr?.toLowerCase().includes(term))
    .slice(0, 5)
}

const searchNeighborhood = () => {
  if (!search.value.trim()) return

  const found = neighborhoods.value.find((f) =>
    f.properties?.nome_bairr?.toLowerCase().includes(search.value.toLowerCase()),
  )

  if (found) {
    neighborhoodStore.selectNeighborhood(found.properties)
    sugestions.value = []
    
    if (neighborhoodStore.mapInstance) {
      const bounds = L.geoJSON(found).getBounds()
      neighborhoodStore.mapInstance.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 17,
        duration: 0.4,
        easeLinearity: 0.25,
      })
    }
    
    const bairroId = found.properties?.id_bairro;
    neighborhoodStore.getDataNeighborhood(bairroId);

    search.value = ''
  } else {
    neighborhoodStore.clearNeighborhood()
    alert('Bairro não encontrado!')
  }
}

const selectSugestion = (sug: any) => {
  search.value = sug.properties.nome_bairr
  searchNeighborhood()
}
</script>

<template>
  <div class="container-search">
    <div class="search-and-suggestions-wrapper">
      <div class="search-bar">
        <button class="search-button" @click="searchNeighborhood">
          <svg
            width="24"
            height="23"
            viewBox="0 0 24 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.2"
              d="M19.2067 9.75688C19.2067 11.5029 18.6794 13.2098 17.6916 14.6615C16.7038 16.1133 15.2998 17.2449 13.6571 17.913C12.0145 18.5812 10.2069 18.7561 8.46305 18.4154C6.71919 18.0748 5.11736 17.234 3.86011 15.9993C2.60286 14.7647 1.74667 13.1917 1.39979 11.4792C1.05292 9.76667 1.23095 7.99162 1.91136 6.37849C2.59178 4.76535 3.74403 3.38658 5.2224 2.41653C6.70077 1.44647 8.43886 0.928711 10.2169 0.928711C11.3974 0.928711 12.5664 1.15706 13.6571 1.60072C14.7478 2.04437 15.7389 2.69465 16.5736 3.51442C17.4084 4.33419 18.0706 5.3074 18.5224 6.37849C18.9742 7.44957 19.2067 8.59755 19.2067 9.75688Z"
              fill="#1D1E1C"
            />
            <path
              d="M23.439 21.4921L17.8137 15.9679C19.4473 14.0438 20.2627 11.5753 20.0902 9.07587C19.9177 6.57645 18.7705 4.23857 16.8874 2.54859C15.0043 0.858607 12.5302 -0.0533575 9.97981 0.00241529C7.42942 0.0581881 4.9991 1.0774 3.19446 2.84803C1.38982 4.61866 0.349793 7.00437 0.290745 9.50885C0.231697 12.0133 1.15817 14.4438 2.87744 16.2945C4.5967 18.1453 6.97637 19.2738 9.5214 19.4455C12.0664 19.6171 14.5809 18.8185 16.5416 17.216L22.167 22.7413C22.2505 22.8233 22.3497 22.8884 22.4588 22.9328C22.5679 22.9772 22.6849 23 22.803 23C22.9211 23 23.0381 22.9772 23.1472 22.9328C23.2564 22.8884 23.3555 22.8233 23.439 22.7413C23.5226 22.6593 23.5888 22.5619 23.634 22.4547C23.6792 22.3476 23.7025 22.2327 23.7025 22.1167C23.7025 22.0007 23.6792 21.8858 23.634 21.7787C23.5888 21.6715 23.5226 21.5741 23.439 21.4921ZM2.12643 9.75725C2.12643 8.18581 2.60095 6.64966 3.48998 5.34305C4.37902 4.03644 5.64263 3.01807 7.12104 2.4167C8.59945 1.81534 10.2262 1.65799 11.7957 1.96457C13.3652 2.27114 14.8068 3.02786 15.9384 4.13904C17.0699 5.25022 17.8405 6.66594 18.1526 8.20719C18.4648 9.74844 18.3046 11.346 17.6922 12.7978C17.0799 14.2496 16.0428 15.4905 14.7123 16.3636C13.3818 17.2366 11.8175 17.7026 10.2173 17.7026C8.07218 17.7003 6.01562 16.8624 4.49881 15.3729C2.982 13.8833 2.12881 11.8638 2.12643 9.75725Z"
              fill="#1D1E1C"
            />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Pesquise seu bairro..."
          class="search-input"
          v-model="search"
          @input="filterSugestions"
          @keyup.enter="searchNeighborhood"
        />
      </div>

      <ul v-if="sugestions.length" class="suggestions-list">
        <li v-for="(sug, index) in sugestions" :key="index" @click="selectSugestion(sug)">
          {{ sug.properties.nome_bairr }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container-search {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: var(--component-width);
  height: var(--component-height);
  display: flex;
  align-items: center;
  justify-content: center; // Centraliza a barra de pesquisa
  gap: 10px; // Pode remover ou manter, dependendo do design
}

.search-and-suggestions-wrapper {
  position: relative;
  width: 100%; // Ajustado para ocupar a largura total
}

.search-bar {
  height: var(--component-height);
  display: flex;
  align-items: center;
  background: var(--color-white);
  border-radius: 100px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: var(--text-md);
  background: transparent;
  padding: 12px 15px 12px 6px;
  box-sizing: border-box;
  color: var(--color-gray-dark);
  width: 100%;

  &::placeholder {
    color: var(--color-gray-dark);
    font-size: var(--text-md);
  }
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 6px 12px 12px;

  svg {
    width: var(--icon-size);
    height: var(--icon-size);
    fill: var(--color-gray-dark);
  }
}

.suggestions-list {
  position: absolute;
  top: calc(var(--component-height) + 10px);
  left: 0;
  width: 100%;
  background: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 4px 0;
  margin: 0;
  max-height: 220px;
  overflow-y: auto;
  z-index: 1000001;
}

.suggestions-list li {
  padding: 12px 16px;
  cursor: pointer;
  font-size: var(--text-md);
  color: var(--color-gray-dark);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

@media (min-width: 992px) {
  .container-search {
    top: 3vh;
    left: calc(30px + 70px + 5vw);
    transform: none;
    justify-content: flex-start; // Alinha à esquerda na versão desktop
  }

  .search-and-suggestions-wrapper {
    width: 80%;
  }
}
</style>