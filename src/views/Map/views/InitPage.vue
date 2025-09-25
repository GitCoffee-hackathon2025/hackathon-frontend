<script setup lang="ts">
import { NeighborhoodStore } from '@/store/NeighborhoodStore'
import { ocurrenceRequisitions, OCCURRENCE_TYPES } from '@/requisitions/Ocurrences'
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
import SearchBar from '@/views/Map/components/SearchBar.vue'

import { CoordinatesMap } from "@/store/CoordinatesMap";
const coordinates = CoordinatesMap()

import { UserRequisitions } from '@/requisitions/User'
const user = UserRequisitions()

import OccurrenceDetails from '@/views/Map/components/OccurrenceDetails.vue'

import { AnimStore } from '@/store/AnimStore'
const anims = AnimStore()

declare global {
  interface Window {
    map: L.Map | null
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
const showOccurrenceDetails = ref(false)
const selectedOccurrenceId = ref<number | null>(null)

// Interface para armazenar dados dos marcadores
interface OccurrenceMarkerData {
  marker: L.Marker
  occurrenceTypeId: number
}

const occurrenceMarkers = ref<OccurrenceMarkerData[]>([])
const currentZoom = ref(12) // Zoom inicial
const activeFilters = ref<number[]>([]) // NOVO: Para armazenar os filtros ativos

// Variável para controlar a interatividade do mapa
const isMapInteractive = ref(true)

const shouldShowReportButton = computed(() => {
  return (
    !route.path.includes('report-occurrence') &&
    !showFormSidebar.value &&
    !neighborhoodStore.selectedData &&
    !showOccurrenceDetails.value
  )
})

const bounds: L.LatLngBoundsExpression = [
  [-26.4, -49.0],
  [-26.1, -48.7],
]

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

// **NOVA FUNÇÃO:** Cria um ícone base com tamanho fixo para ser redimensionado via CSS.
const createBaseOccurrenceIcon = (occurrenceTypeId: number) => {
  const colors: Record<number, string> = {
    1: '#e74c3c',
    2: '#c0392b',
    3: '#e74c3c',
    7: '#c0392b',
    9: '#c0392b',
    4: '#f39c12',
    5: '#f1c40f',
    6: '#e67e22',
    8: '#e67e22',
    10: '#3498db',
    11: '#2980b9',
    12: '#27ae60',
    13: '#791F87',
    14: '#95a5a6',
  }
  const color = colors[occurrenceTypeId] || '#95a5a6'

  // Tamanho base (máximo) para o redimensionamento
  const baseSize = 20
  const baseBorder = 3

  return L.divIcon({
    className: 'occurrence-marker-scalable',
    html: `
 <div style="
 background-color: ${color};
 width: ${baseSize}px;
 height: ${baseSize}px;
 border-radius: 50%;
 border: ${baseBorder}px solid white;
 box-shadow: 0 2px 8px rgba(0,0,0,0.3);
 "></div>
 `,
    iconSize: [baseSize, baseSize],
    iconAnchor: [baseSize / 2, baseSize / 2],
  })
}

// **NOVA FUNÇÃO:** Calcula o fator de escala para o zoom.
const getScaleFactor = (zoomLevel: number) => {
  if (zoomLevel <= 13) return 0.4
  if (zoomLevel <= 15) return 0.7
  if (zoomLevel <= 17) return 0.9
  return 1.0
}

// **FUNÇÃO MELHORADA:** Atualiza o tamanho dos marcadores usando `transform: scale()`.
const updateMarkersSize = () => {
  if (!map) return
  const newZoom = map.getZoom()

  if (currentZoom.value === newZoom) {
    return // Evita processar se o zoom não mudou
  }
  currentZoom.value = newZoom

  const scale = getScaleFactor(newZoom)

  occurrenceMarkers.value.forEach((markerData) => {
    // Obtém o elemento HTML do ícone e aplica o redimensionamento.
    const iconElement = markerData.marker.getElement()?.querySelector('div')
    if (iconElement) {
      iconElement.style.transform = `scale(${scale})`
      iconElement.style.transition = 'transform 0.3s ease' // Garante a transição suave
    }
  })
}

// Função modificada para permitir interação com outros marcadores
const openOccurrenceDetails = (occurrenceId: number) => {
  selectedOccurrenceId.value = occurrenceId
  showOccurrenceDetails.value = true

  if (map) {
    map.getContainer().style.cursor = ''
    map.dragging.enable()
    map.touchZoom.enable()
    map.doubleClickZoom.enable()
    map.scrollWheelZoom.enable()
    map.boxZoom.enable()
    map.keyboard.enable()
    isMapInteractive.value = true
  }

  neighborhoodStore.clearNeighborhood()
}

const loadOccurrencesOnMap = async () => {
  if (!map) return

  map.off('zoomend', updateMarkersSize)

  occurrenceMarkers.value.forEach((markerData) => {
    map?.removeLayer(markerData.marker)
  })
  occurrenceMarkers.value = []

  const occurrencesData = await ocurrenceReq.fetchOccurrencesCoordinates()

  if (occurrencesData && occurrencesData.success && occurrencesData.data) {
    occurrencesData.data.forEach((occurrence: any) => {
      try {
        const coords = JSON.parse(occurrence.coordenadas)
        // Usa o NOVO ícone base
        const marker = L.marker([coords.lat, coords.lng], {
          icon: createBaseOccurrenceIcon(occurrence.id_type_occurrence),
        }) // REMOVIDO: .addTo(map!)

        marker.on('click', () => {
          openOccurrenceDetails(occurrence.id_occurrence)
        })

        occurrenceMarkers.value.push({
          marker: marker,
          occurrenceTypeId: occurrence.id_type_occurrence,
        })
      } catch (error) {
        console.error('Erro ao processar ocorrência:', error, occurrence)
      }
    })

    console.log(`Carregadas ${occurrenceMarkers.value.length} ocorrências no mapa`)

    map.on('zoomend', updateMarkersSize)
    updateMarkersSize()
    filterMarkers() // Chama o filtro para exibir os marcadores corretos inicialmente
  }
}

// **CORRIGIDO:** Agora, a função `filterMarkers` também chama `updateMarkersSize`
// para garantir que os novos marcadores visíveis tenham o tamanho correto.
const filterMarkers = () => {
  if (!map) return

  occurrenceMarkers.value.forEach((markerData) => {
    const isVisible =
      activeFilters.value.length === 0 || activeFilters.value.includes(markerData.occurrenceTypeId)
    if (isVisible) {
      markerData.marker.addTo(map)
    } else {
      map.removeLayer(markerData.marker)
    }
  })

  // CHAMADA ADICIONADA: Redimensiona os marcadores após o filtro.
  updateMarkersSize()
}

const focusOnLocation = (coords: { lat: number; lng: number }) => {
  if (map) {
    map.flyTo([coords.lat, coords.lng], 16, {
      duration: 1,
      easeLinearity: 0.25,
    })
    showOccurrenceDetails.value = false
  }
}

const focusOnSelectedLocation = () => {
  if (selectionMarker && map) {
    const latlng = selectionMarker.getLatLng()
    map.flyTo(latlng, 16, {
      duration: 1,
      easeLinearity: 0.25,
    })
  }
}

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
    if (showFormSidebar.value) return

    const { lat, lng } = e.latlng
    const neighborhoodName = await findNeighborhoodByCoordinates(lat, lng)

    if (!neighborhoodName) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent('Selecione um local dentro dos bairros disponíveis.')
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

const continueToForm = () => {
  showFormSidebar.value = true
  showLocationButtons.value = false
  focusOnSelectedLocation()

  if (map) {
    map.getContainer().style.cursor = 'default'
    map.dragging.disable()
    map.touchZoom.disable()
    map.doubleClickZoom.disable()
    map.scrollWheelZoom.disable()
    map.boxZoom.disable()
    map.keyboard.disable()
    isMapInteractive.value = false
  }
}

const backToSelection = () => {
  if (selectionMarker && map) {
    map.removeLayer(selectionMarker)
    selectionMarker = null
  }
  showLocationButtons.value = false
}

const closeForm = () => {
  showFormSidebar.value = false

  if (map) {
    map.dragging.enable()
    map.touchZoom.enable()
    map.doubleClickZoom.enable()
    map.scrollWheelZoom.enable()
    map.boxZoom.enable()
    map.keyboard.enable()
    isMapInteractive.value = true
  }

  if (selectionMarker) {
    showLocationButtons.value = true
  }
}

const closeOccurrenceDetails = () => {
  showOccurrenceDetails.value = false
  selectedOccurrenceId.value = null
}

const backToHome = () => {
  router.push('/')
}

const handleViewDetails = (occurrenceId: number) => {
  selectedOccurrenceId.value = occurrenceId
  showOccurrenceDetails.value = true
  neighborhoodStore.clearNeighborhood()
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('report-occurrence')) {
      showLocationModal.value = true
    } else {
      disableLocationSelection()
      closeForm()
      closeOccurrenceDetails()
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

// NOVO: Adiciona a função para lidar com a atualização dos filtros
const handleFilterUpdate = (filters: number[]) => {
  activeFilters.value = filters
  filterMarkers() // Chama a função de filtro para atualizar o mapa
}

onBeforeMount(() => {
  anims.isLoading = true
})

onMounted(async () => {
  await user.recover()
  anims.isLoading = true
  map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12,
    maxZoom: 20,
    zoomControl: false,
  }).setView([-26.3045, -48.8487], coordinates.center)

  window.map = map
  currentZoom.value = 12

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

      loadOccurrencesOnMap()
    })
    .catch((err) => console.error('Erro ao carregar GeoJSON:', err))

  if (route.path.includes('report-occurrence')) {
    enableLocationSelection()
  }
 anims.isLoading = false

})

onUnmounted(() => {
  disableLocationSelection()
  if (map) {
    map.off('zoomend', updateMarkersSize)
  }
  window.map = null
})
</script>

<template>
  <main>
    <ReportButton v-if="shouldShowReportButton" />

    <button
      v-if="
        route.path.includes('report-occurrence') &&
        !showLocationButtons &&
        !showFormSidebar &&
        !showOccurrenceDetails
      "
      class="back-button"
      @click="backToHome"
    >
      Voltar
    </button>

    <div class="map-container">
      <div id="map"></div>

      <NeighborhoodPanel @view-occurrence-details="handleViewDetails" />

      <div v-if="showLocationButtons" class="location-buttons">
        <button class="btn-continue" @click="continueToForm">Continuar</button>
        <button class="btn-back" @click="backToSelection">Voltar</button>
      </div>
    </div>

    <OcurrenceForm v-if="showFormSidebar" @close="closeForm" />

    <LocationModal :show="showLocationModal" @confirm="confirmModal" @cancel="cancelModal" />

    <OccurrenceDetails
      v-if="showOccurrenceDetails"
      :occurrenceId="selectedOccurrenceId"
      :key="selectedOccurrenceId"
      @close="closeOccurrenceDetails"
      @focusLocation="focusOnLocation"
    />
  </main>

  <SearchBar @filter-updated="handleFilterUpdate" />
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

  // **NOVO SELETOR:** Removemos o "dynamic-marker" e focamos na classe principal.
  :deep(.occurrence-marker-scalable) {
    // Adicione a transição no elemento interno para maior suavidade
    & > div {
      transition: transform 0.3s ease;
      // Garante a aceleração por hardware para evitar o jiggle
      transform: translateZ(0);
    }
  }

  // Não é mais necessário, pois o redimensionamento é feito via JavaScript
  // :deep(.occurrence-marker.dynamic-marker) { ... }

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
  bottom: 100px;
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
  bottom: 100px;
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
    padding: 16px 28px;
    font-size: 1.1rem;
  }

  .location-buttons {
    bottom: 40px;
    gap: 20px;
  }

  .btn-continue,
  .btn-back {
    padding: 16px 28px;
    font-size: 1rem;
    min-width: 140px;
  }
}

// Telas muito grandes
@media (min-width: 1200px) {
  .back-button {
    bottom: 50px;
    right: 50px;
    padding: 18px 32px;
    font-size: 1rem;
  }

  .location-buttons {
    bottom: 50px;
    gap: 75px;
  }

  .btn-continue,
  .btn-back {
    padding: 18px 32px;
    font-size: 1.2rem;
    min-width: 180px;
  }
}
</style>
