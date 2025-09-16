// utils/geocoding.ts
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson'

let cachedGeoJson: FeatureCollection | null = null

// Função para carregar o GeoJSON (com cache)
async function loadGeoJson(): Promise<FeatureCollection | null> {
  if (cachedGeoJson) return cachedGeoJson

  const response = await fetch('/geojson/JoinvilleNeighborhoods.geojson')
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

// Função principal para encontrar ID e nome do bairro pelas coordenadas
export async function findNeighborhoodByCoordinates(
  lat: number,
  lng: number,
): Promise<{ id: number; name: string } | null> {
  try {
    const geoJson = await loadGeoJson()
    if (!geoJson) return null

    for (const feature of geoJson.features) {
      const geomType = feature.geometry.type
      if (geomType === 'Polygon') {
        if (pointInPolygon([lng, lat], feature.geometry.coordinates)) {
          const id = feature.properties?.id_bairro ?? null
          const name = feature.properties?.nome_bairr ?? null
          if (id !== null && name !== null) return { id, name }
        }
      } else if (geomType === 'MultiPolygon') {
        for (const polygon of feature.geometry.coordinates) {
          if (pointInPolygon([lng, lat], polygon)) {
            const id = feature.properties?.id_bairro ?? null
            const name = feature.properties?.nome_bairr ?? null
            if (id !== null && name !== null) return { id, name }
          }
        }
      }
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar bairro:', error)
    return null
  }
}
