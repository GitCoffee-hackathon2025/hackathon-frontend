import { defineStore } from 'pinia'
import { ref } from 'vue'

export const CoordinatesMap = defineStore('CoordinatesMap', () => {
  const coordinates = ref<{ lat: number; lng: number }>({ lat: -26.3045, lng: -48.8487 })
  const center = ref(12)

  return { coordinates, center }
})
