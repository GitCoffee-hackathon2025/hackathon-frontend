<script setup lang="ts">
import { useBairroStore } from '@/store/Bairro'
import { onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import DadosBairro from '@/views/MapadeDenuncias/components/DadosBairros.vue'
import NavBarra from '@/components/NavBarra.vue'
import BarraPesquisa from '@/views/MapadeDenuncias/components/BarraPesquisa.vue'

let map: L.Map | null = null

const bairroStore = useBairroStore()

const bounds: L.LatLngBoundsExpression = [
  [-26.4, -49.0],
  [-26.1, -48.7],
]

onMounted(() => {
  map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12,
    maxZoom: 20,
    zoomControl: false,
  }).setView([-26.3045, -48.8487], 12)

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
          opacity: 0.1,
          fillOpacity: 0.02,
          fillColor: '#5c8ef2',
        },
        onEachFeature: (feature, layer) => {
          layer.on('mouseover', function () {
            //muda o estilo apos o cara passar o mouse pro cima
            this.setStyle({
              fillOpacity: 0.05,
              weight: 1,
              opacity: 0.5,
            })
          })

          layer.on('mouseout', function () {
            //volta ao estilo padrao apos tirar o mouse
            this.setStyle({
              fillOpacity: 0.02,
              weight: 1,
              color: '#f2f2f2',
              opacity: 0.1,
            })
          })

          layer.on('click', async (e) => {
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
})
</script>

<template>
  <NavBarra />
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
