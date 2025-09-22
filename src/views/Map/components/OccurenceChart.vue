<script setup lang="ts">
import { ref, watch } from 'vue'
import { use } from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import VChart from "vue-echarts"

// registra módulos do ECharts
use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

interface Occurrence {
  id: number
  type: { id: number; name: string }
}

// props vindas do pai
const props = defineProps<{
  occurrences: Occurrence[]
}>()

// tipos
const occurrenceTypes = [
  { id: 1, name: 'Acidente de trânsito' },
  { id: 2, name: 'Assalto' },
  { id: 3, name: 'Roubo' },
  { id: 4, name: 'Furto' },
  { id: 5, name: 'Perturbação da paz' },
  { id: 6, name: 'Vandalismo' },
  { id: 7, name: 'Incêndio' },
  { id: 8, name: 'Acidente doméstico' },
  { id: 9, name: 'Assédio' },
  { id: 10, name: 'Desaparecimento' },
  { id: 11, name: 'Problema de infraestrutura' },
  { id: 12, name: 'Animal solto' },
  { id: 13, name: 'Outro' }
]

// função de cores
const createOccurrenceIcon = (occurrenceTypeId: number) => {
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
    13: '#95a5a6'
  }
  return colors[occurrenceTypeId] || '#7f8c8d'
}

// categorias manuais (pra poder agrupar)
const categories = [
  { id: 'violencia', name: 'Violência', types: [2,3,4,9] },
  { id: 'problemas_urbanos', name: 'Problemas Urbanos', types: [11] },
  { id: 'acidentes', name: 'Acidentes', types: [1,7,8,10] },
  { id: 'outros', name: 'Outros', types: [5,6,12,13] }
]

// estado
const selectedCategory = ref<string | null>(null)
const option = ref<any>({})

// gera dados
function getCategoryData() {
  if (!selectedCategory.value) {
    // nível categorias
    return categories.map(cat => {
      const count = props.occurrences.filter(o =>
        cat.types.includes(o.type.id)
      ).length
      return {
        value: count,
        name: cat.name
      }
    })
  } else {
    // nível tipos
    const cat = categories.find(c => c.id === selectedCategory.value)
    return occurrenceTypes
      .filter(t => cat?.types.includes(t.id))
      .map(type => {
        const count = props.occurrences.filter(o => o.type.id === type.id).length
        return {
          value: count,
          name: type.name,
          itemStyle: { color: createOccurrenceIcon(type.id) }
        }
      })
  }
}

function updateChart() {
  option.value = {
    tooltip: { 
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}: ${params.value} (${params.percent}%)`
      }
    },
    legend: { bottom: 0, textStyle: { color: '#fff' }, selectedMode: false },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: getCategoryData(),
        focus: 'series',
        label: { show: false }, 
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
        }
      }
    ]
  }
}

watch([() => props.occurrences, selectedCategory], updateChart, { deep: false, immediate: true })

function onChartClick(params: any) {
  if (!selectedCategory.value) {
    const cat = categories.find(c => c.name === params.name)
    if (cat) selectedCategory.value = cat.id
  } else {
    selectedCategory.value = null
  }
}
</script>

<template>
  <VChart :option="option" style="height:300px;" @click="onChartClick" />
</template>
