<template>
   <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

let map: L.Map | null = null

const bounds: L.LatLngBoundsExpression = [
  [-26.400, -49.000],  
  [-26.100, -48.700]   
]

onMounted(() => {
  map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12,
    maxZoom: 20
  }).setView([-26.3045, -48.8487], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  fetch('/geo/bairros.json')
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, {
          style: {
            color: 'black',    
            weight: 1,
            opacity: 1,
            fillOpacity: 0.4,
            fillColor: 'none'
          },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties?.nome || 'Sem nome')
        }
}).addTo(map!)

    })
    .catch(err => console.error('Erro ao carregar GeoJSON:', err))
})

</script>

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