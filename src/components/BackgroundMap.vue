<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CoordinatesMap } from '@/store/CoordinatesMap'
const coordinatesMap = CoordinatesMap()

let map: L.Map | null = null

onMounted(() => {
  map = L.map('map', {
    center: [coordinatesMap.coordinates.lat, coordinatesMap.coordinates.lng], // ajuste para o centro desejado
    zoom: coordinatesMap.center, // nível de zoom inicial
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false,
    attributionControl: true,
  })

  L.tileLayer(
    'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=HlsnsLtJMqieYXmvcLv4imuKCeL2kbOnsAhQZKOI7rH5lqBaXSdme8VeUr9gDuGe',
    {
      attribution:
        '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 0,
      maxZoom: 22,
    },
  ).addTo(map)

  if (map) {
    if (map.dragging) map.dragging.disable()
    if ((map as any).touchZoom) (map as any).touchZoom.disable?.()
    if ((map as any).doubleClickZoom) (map as any).doubleClickZoom.disable?.()
    if ((map as any).scrollWheelZoom) (map as any).scrollWheelZoom.disable?.()
    if ((map as any).boxZoom) (map as any).boxZoom.disable?.()
    if ((map as any).keyboard) (map as any).keyboard.disable?.()
    if ((map as any).tap) (map as any).tap.disable?.()
    map.getContainer().style.cursor = 'default'
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div id="map" class="only-map"></div>
</template>

<style scoped>
.only-map {
  z-index: 0;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.leaflet-container {
  font:
    12px/1.5 'Helvetica Neue',
    Arial,
    Helvetica,
    sans-serif;
}
</style>
