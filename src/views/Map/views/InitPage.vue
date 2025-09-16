<script setup lang="ts">
import { NeighborhoodStore } from '@/store/NeighborhoodStore'
import { ocurrenceRequisitions } from '@/requisitions/Ocurrences'
import { onMounted, nextTick, watch, onUnmounted, onBeforeMount, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import L from 'leaflet'
import { markRaw } from 'vue'
import 'leaflet/dist/leaflet.css'
import NeighborhoodPanel from '@/views/Map/components/NeighborhoodPanel.vue'
import { findNeighborhoodByCoordinates } from '@/utils/geocoding'
import ReportButton from '@/views/Map/components/ReportButton.vue'
import LocationModal from '../components/LocationModal.vue'
import OcurrenceForm from '@/views/Map/components/OcurrenceForm.vue'

import { AnimsStore } from '@/store/AnimsStore'
const anims = AnimsStore()

// Tornar o mapa globalmente acessível
declare global {
  interface Window {
    map: L.Map | null;
  }
}

let map: L.Map | null = null
let clickHandler: ((e: L.LeafletMouseEvent) => void) | null = null
let selectionMarker: L.Marker | null = null

const neighborhoodStore = NeighborhoodStore()
const ocurrenceReq = ocurrenceRequisitions()
const route = useRoute()
const router = useRouter()
const showLocationModal = ref(false)
const showLocationButtons = ref(false)
const showFormSidebar = ref(false)

// Computed property para determinar se o botão deve ser mostrado
const shouldShowReportButton = computed(() => {
  return !route.path.includes('selecionar-localizacao') && 
         !showFormSidebar.value && 
         !neighborhoodStore.selectedData
})

const bounds: L.LatLngBoundsExpression = [
  [-26.4, -49.0],
  [-26.1, -48.7],
]

// Criar ícone personalizado para o marcador
const createCustomIcon = () => {
  return L.divIcon({
    className: 'pulsating-marker',
    html: `
      <div class="pulse-container">
        <div class="pulse-ring"></div>
        <div class="pulse-ring"></div>
        <div class="pulse-ring"></div>
        <div class="marker-center">
          <div class="marker-dot"></div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

// Função para focar no marcador selecionado
const focusOnSelectedLocation = () => {
  if (selectionMarker && map) {
    const latlng = selectionMarker.getLatLng()
    map.flyTo(latlng, 16, {
      duration: 1,
      easeLinearity: 0.25
    })
  }
}

// Função para ativar modo de seleção de localização
const enableLocationSelection = () => {
  if (!map) return

  map.getContainer().style.cursor = 'default'

  map.eachLayer((layer) => {
    if (layer instanceof L.GeoJSON) {
      layer.on('mouseover', () => {
        if (clickHandler && !showFormSidebar.value) {
          map!.getContainer().style.cursor = 'crosshair'
        }
      })
      layer.on('mouseout', () => {
        if (clickHandler && !showFormSidebar.value) {
          map!.getContainer().style.cursor = 'default'
        }
      })
    }
  })

  clickHandler = async (e: L.LeafletMouseEvent) => {
    // Não permitir seleção se o formulário estiver aberto
    if (showFormSidebar.value) return

    const { lat, lng } = e.latlng

    const neighborhoodName = await findNeighborhoodByCoordinates(lat, lng)

    if (!neighborhoodName) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          'Selecione um local dentro dos bairros disponíveis.',
        )
        .openOn(map!)
      return
    }

    await ocurrenceReq.setOccurrenceCoordinates({ lat, lng })

    if (selectionMarker) {
      map?.removeLayer(selectionMarker)
    }

    selectionMarker = L.marker([lat, lng], {
      icon: createCustomIcon(),
    }).addTo(map!)

    showLocationButtons.value = true
  }

  map.on('click', clickHandler)
}

// Função para desativar modo de seleção de localização
const disableLocationSelection = () => {
  if (!map) return

  map.getContainer().style.cursor = ''

  if (clickHandler) {
    map.off('click', clickHandler)
    clickHandler = null
  }

  map.eachLayer((layer) => {
    if (layer instanceof L.GeoJSON) {
      layer.off('mouseover')
      layer.off('mouseout')
    }
  })

  if (selectionMarker) {
    map.removeLayer(selectionMarker)
    selectionMarker = null
  }
  
  showLocationButtons.value = false
}

// Continuar para o formulário
const continueToForm = () => {
  showFormSidebar.value = true
  showLocationButtons.value = false
  focusOnSelectedLocation() // Focar no local selecionado
  
  // Desativar interação com o mapa quando o formulário estiver aberto
  if (map) {
    map.getContainer().style.cursor = 'default'
    map.dragging.disable()
    map.touchZoom.disable()
    map.doubleClickZoom.disable()
    map.scrollWheelZoom.disable()
    map.boxZoom.disable()
    map.keyboard.disable()
  }
}

// Voltar para a seleção (remover marcador)
const backToSelection = () => {
  if (selectionMarker && map) {
    map.removeLayer(selectionMarker)
    selectionMarker = null
  }
  showLocationButtons.value = false
}

// Função para fechar o formulário e reativar a seleção
const closeForm = () => {
  showFormSidebar.value = false
  
  // Reativar interação com o mapa
  if (map) {
    map.dragging.enable()
    map.touchZoom.enable()
    map.doubleClickZoom.enable()
    map.scrollWheelZoom.enable()
    map.boxZoom.enable()
    map.keyboard.enable()
  }
  
  // Mostrar botões novamente se ainda tiver um marcador
  if (selectionMarker) {
    showLocationButtons.value = true
  }
}

// Voltar para a página inicial
const backToHome = () => {
  router.push('/')
}

// Observar mudanças na rota
watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('selecionar-localizacao')) {
      showLocationModal.value = true
    } else {
      disableLocationSelection()
      closeForm()
    }
  },
)

const confirmModal = () => {
  showLocationModal.value = false
  enableLocationSelection()
}

const cancelModal = () => {
  showLocationModal.value = false
  router.push('/')
}

onBeforeMount(() => {
  anims.isLoading = true
})

onMounted(() => {
  anims.isLoading = true
  map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12,
    maxZoom: 20,
    zoomControl: false,
  }).setView([-26.3045, -48.8487], 12)

  // Tornar o mapa acessível globalmente
  window.map = map

  neighborhoodStore.setMap(markRaw(map))

  L.tileLayer(
    'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=HlsnsLtJMqieYXmvcLv4imuKCeL2kbOnsAhQZKOI7rH5lqBaXSdme8VeUr9gDuGe',
    {
      attribution:
        '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 0,
      maxZoom: 22,
    },
  ).addTo(map)

  fetch('/geojson/JoinvilleNeighborhoods.geojson')
    .then((res) => res.json())
    .then((data) => {
      L.geoJSON(data, {
        style: {
          color: '#f2f2f2',
          weight: 1,
          opacity: 0.3,
          fillOpacity: 0.03,
          fillColor: '#5c8ef2',
        },
        onEachFeature: (feature, layer) => {
          layer.on('mouseover', function () {
            if (clickHandler && !showFormSidebar.value) {
              map!.getContainer().style.cursor = 'crosshair'
            }

            this.setStyle({
              fillOpacity: 0.05,
              weight: 1,
              opacity: 1,
            })
          })

          layer.on('mouseout', function () {
            if (clickHandler && !showFormSidebar.value) {
              map!.getContainer().style.cursor = 'default'
            }

            this.setStyle({
              fillOpacity: 0.02,
              weight: 1,
              color: '#f2f2f2',
              opacity: 0.1,
            })
          })

          layer.on('click', async (e) => {
            // Não permitir clique se formulário estiver aberto
            if (clickHandler || showFormSidebar.value) return

            map?.flyToBounds(e.target.getBounds(), {
              padding: [50, 50],
              maxZoom: 17,
              duration: 0.4,
              easeLinearity: 0.25,
            })

            await nextTick()
            neighborhoodStore.selectNeighborhood(feature.properties || {})
            const bairroId = feature.properties?.id_bairro
            neighborhoodStore.getDataNeighborhood(bairroId)
          })
        },
      }).addTo(map!)
      anims.isLoading = false
    })
    .catch((err) => console.error('Erro ao carregar GeoJSON:', err))

  if (route.path.includes('selecionar-localizacao')) {
    enableLocationSelection()
  }
})

onUnmounted(() => {
  disableLocationSelection()
  window.map = null
})
</script>

<template>
  <main>
    <!-- Botão de Reportar (agora controlado pela computed property) -->
    <ReportButton v-if="shouldShowReportButton" />
    
    <!-- Botão de Voltar (só aparece na rota de seleção) -->
    <button 
      v-if="route.path.includes('selecionar-localizacao') && !showLocationButtons && !showFormSidebar" 
      class="back-button"
      @click="backToHome"
    >
      Voltar
    </button>
    
    <div class="map-container">
      <div id="map"></div>
      <NeighborhoodPanel />
      
      <!-- Botões de Continuar/Voltar (aparecem apenas durante seleção) -->
      <div v-if="showLocationButtons" class="location-buttons">
        <button class="btn-continue" @click="continueToForm">
          Continuar
        </button>
        <button class="btn-back" @click="backToSelection">
          Voltar
        </button>
      </div>
    </div>

    <!-- Formulário lateral -->
    <OcurrenceForm 
      v-if="showFormSidebar" 
      @close="closeForm"
    />

    <LocationModal
      :show="showLocationModal"
      @confirm="confirmModal"
      @cancel="cancelModal"
    />
  </main>
</template>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

#map {
  width: 100%;
  height: 100%;
  border-radius: 0;
  margin: 0;
  padding: 0;
  touch-action: none;

  .leaflet-control-zoom a {
    font-size: 1.5rem;
    padding: 0.75rem;
  }

  :deep(.pulsating-marker) {
    .pulse-container {
      position: relative;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .marker-center {
      width: 18px;
      height: 18px;
      background-color: #3498db;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      z-index: 10;
      position: relative;
    }

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30px;
      height: 30px;
      border: 2px solid #3498db;
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s infinite;
    }
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0.7;
    }
    70% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
}

.back-button {
  position: fixed;
  bottom: 100px; // mobile first
  right: 15px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  background: #7f8c8d;
  color: white;
  z-index: 1000;
  transition: all 0.2s ease;

  &:hover {
    background: #636e72;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.location-buttons {
  position: fixed;
  bottom: 100px; // mobile first
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 1000;
  animation: fadeInUp 0.6s ease-in-out;
}

.btn-continue,
.btn-back {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-width: 120px;
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.6s ease forwards;
}

.btn-continue {
  background: #27ae60;
  color: white;
  animation-delay: 0.2s;
}

.btn-back {
  background: #7f8c8d;
  color: white;
  animation-delay: 0.4s;
}

.btn-continue:hover,
.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-continue:hover {
  background: #219653;
}

.btn-back:hover {
  background: #636e72;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// -------- MEDIA QUERIES --------

// Tablet
@media (min-width: 768px) {
  #map {
    border-radius: 8px;
  }

  .back-button {
    bottom: 100px;
    right: 20px;
  }

  .location-buttons {
    bottom: 100px;
  }
}

// Desktop
@media (min-width: 992px) {
  .back-button {
    bottom: 40px;
    right: 30px;
    padding: 16px 28px; // aumenta o tamanho
    font-size: 1.1rem;  // texto maior
  }

  .location-buttons {
    bottom: 40px;
    gap: 20px; // aumenta espaço entre os botões
  }

  .btn-continue,
  .btn-back {
    padding: 16px 28px; // aumenta os botões
    font-size: 1rem;
    min-width: 140px; // mais largo
  }
}

// Telas muito grandes
@media (min-width: 1200px) {
  .back-button {
    bottom: 50px;
    right: 50px;
    padding: 18px 32px; // ainda maior
    font-size: 1rem;
  }

  .location-buttons {
    bottom: 50px;
    gap: 75px; // mais espaçamento
  }

  .btn-continue,
  .btn-back {
    padding: 18px 32px;
    font-size: 1.2rem;
    min-width: 180px;
  }
}
</style>
