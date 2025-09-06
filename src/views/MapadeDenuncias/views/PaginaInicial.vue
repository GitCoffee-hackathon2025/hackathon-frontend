<script setup lang="ts">
import { useBairroStore } from '@/store/Bairro'
import { useReportStore } from '@/store/report'
import { onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import { markRaw } from 'vue'
import 'leaflet/dist/leaflet.css'
import DadosBairro from '@/views/MapadeDenuncias/components/DadosBairros.vue'
import BarraPesquisa from '@/views/MapadeDenuncias/components/BarraPesquisa.vue'

let map: L.Map | null = null
let clickHandler: ((e: L.LeafletMouseEvent) => void) | null = null
let selectionMarker: L.Marker | null = null

const bairroStore = useBairroStore()
const reportStore = useReportStore()
const route = useRoute()

const bounds: L.LatLngBoundsExpression = [
  [-26.4, -49.0],
  [-26.1, -48.7],
]

// Função para ativar modo de seleção de localização
const enableLocationSelection = () => {
  if (!map) return
  
  // Alterar cursor para indicar modo de seleção
  map.getContainer().style.cursor = 'crosshair'
  
  // Adicionar evento de clique no mapa
  clickHandler = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    
    // Guardar as coordenadas na store de report (isso agora busca automaticamente o bairro)
    await reportStore.setReportCoordinates({ lat, lng })
    
    // Remover marcador anterior se existir
    if (selectionMarker) {
      map?.removeLayer(selectionMarker)
    }
    
    // Adicionar um marcador no local selecionado
    selectionMarker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    }).addTo(map!)
    
    // Mostrar popup com informações do local selecionado
    const popupContent = reportStore.reportBairro 
      ? `Bairro: ${reportStore.reportBairro}<br>Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      : `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>Bairro não identificado`
    
    selectionMarker.bindPopup(popupContent).openPopup()
    
    console.log('Coordenadas salvas:', reportStore.reportCoordinates)
    console.log('Bairro identificado:', reportStore.reportBairro)
  }
  
  map.on('click', clickHandler)
}

// Função para desativar modo de seleção de localização
const disableLocationSelection = () => {
  if (!map) return
  
  // Restaurar cursor padrão
  map.getContainer().style.cursor = ''
  
  // Remover evento de clique se existir
  if (clickHandler) {
    map.off('click', clickHandler)
    clickHandler = null
  }
  
  // Remover marcador de seleção
  if (selectionMarker) {
    map.removeLayer(selectionMarker)
    selectionMarker = null
  }
}

// Observar mudanças na rota
watch(() => route.path, (newPath) => {
  if (newPath.includes('selecionar-localizacao')) {
    enableLocationSelection()
  } else {
    disableLocationSelection()
  }
})

onMounted(() => {
  map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12,
    maxZoom: 20,
    zoomControl: false,
  }).setView([-26.3045, -48.8487], 12)

  bairroStore.setMap(markRaw(map))

  L.control.zoom({ position: 'topright' }).addTo(map)

  L.tileLayer(
    'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=HlsnsLtJMqieYXmvcLv4imuKCeL2kbOnsAhQZKOI7rH5lqBaXSdme8VeUr9gDuGe',
    {
      attribution:
        '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 0,
      maxZoom: 22,
    },
  ).addTo(map)

  fetch('/geo/bairros.json')
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
            // Se estiver no modo de seleção, não fazer nada
            if (clickHandler) return
            
            // muda o estilo apos o cara passar o mouse pro cima
            this.setStyle({
              fillOpacity: 0.05,
              weight: 1,
              opacity: 1,
            })
          })

          layer.on('mouseout', function () {
            // Se estiver no modo de seleção, não fazer nada
            if (clickHandler) return
            
            // volta ao estilo padrao apos tirar o mouse
            this.setStyle({
              fillOpacity: 0.02,
              weight: 1,
              color: '#f2f2f2',
              opacity: 0.1,
            })
          })

          layer.on('click', async (e) => {
            // Se estiver no modo de seleção, não processar clique no bairro
            if (clickHandler) return
            
            // Dar um zoom brisado no bairro clicado
            map?.flyToBounds(e.target.getBounds(), {
              padding: [50, 50],
              maxZoom: 17,
              duration: 0.4,
              easeLinearity: 0.25,
            })

            await nextTick()
            bairroStore.selectBairro(feature.properties || {})
          })
        },
      }).addTo(map!)
    })
    .catch((err) => console.error('Erro ao carregar GeoJSON:', err))
    
  // Verificar se a rota inicial já é a de seleção de localização
  if (route.path.includes('selecionar-localizacao')) {
    enableLocationSelection()
  }
})

// Limpar eventos quando o componente for desmontado
onUnmounted(() => {
  disableLocationSelection()
})
</script>

<template>
  <main>
    <BarraPesquisa />
    <div class="map-container">
      <div id="map"></div>
      <DadosBairro />
    </div>
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
}

@media (min-width: 768px) {
  #map {
    border-radius: 8px;
  }
}
</style>