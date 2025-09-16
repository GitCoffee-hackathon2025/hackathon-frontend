// utils/geocoding.ts
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson'

let cachedGeoJson: FeatureCollection | null = null

// Função para carregar o GeoJSON (com cache)
async function loadGeoJson(): Promise<FeatureCollection | null> {
  if (cachedGeoJson) {
    return cachedGeoJson
  }

  const response = await fetch('./geojson/JoinvilleNeighborhoods.json')
  cachedGeoJson = await response.json()
  return cachedGeoJson
}

// Função para verificar se um ponto está dentro de um polígono (algoritmo ray casting)
function pointInPolygon(point: [number, number], polygon: number[][][]): boolean {
  const [x, y] = point
  let inside = false

  for (const ring of polygon) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]
      const [xj, yj] = ring[j]

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

      if (intersect) inside = !inside
    }
  }

  return inside
}

// Função principal para encontrar o bairro pelas coordenadas
export async function findNeighborhoodByCoordinates(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const geoJson = await loadGeoJson()

    //console.log('Procurando bairro para coordenadas:', lat, lng)
    //console.log('Total de features no GeoJSON:', geoJson.features.length)

    if (geoJson) {
      // Procurar o bairro que contém as coordenadas
      for (const feature of geoJson.features) {
        if (feature.geometry.type === 'Polygon') {
          const polygon = feature.geometry.coordinates
          if (pointInPolygon([lng, lat], polygon)) {
            const nomeBairro = feature.properties?.nome_bairr || null
            //console.log('Bairro encontrado:', nomeBairro)
            return nomeBairro
          }
        } else if (feature.geometry.type === 'MultiPolygon') {
          for (const polygon of feature.geometry.coordinates) {
            if (pointInPolygon([lng, lat], polygon)) {
              const nomeBairro = feature.properties?.nome_bairr || null
              //console.log('Bairro encontrado:', nomeBairro)
              return nomeBairro
            }
          }
        }
      }
    }

    //console.log('Nenhum bairro encontrado para as coordenadas')
    return null
  } catch (error) {
    console.error('Erro ao buscar bairro:', error)
    return null
  }
}
