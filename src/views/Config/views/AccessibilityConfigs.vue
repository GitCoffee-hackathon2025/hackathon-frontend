<script setup lang="ts">
import { useCvdStore } from '@/store/DaltonismStore'
import { storeToRefs } from 'pinia'
const cvd = useCvdStore()
const { mode } = storeToRefs(cvd)
// Array de cores (pode vir até de props se quiser dinamizar ainda mais)
const colors: string[] = [
  '#e74c3c', // 1
  '#c0392b', // 2
  '#e74c3c', // 3
  '#f39c12', // 4
  '#f1c40f', // 5
  '#e67e22', // 6
  '#c0392b', // 7
  '#e67e22', // 8
  '#c0392b', // 9
  '#3498db', // 10
  '#2980b9', // 11
  '#27ae60', // 12
  '#791F87', // 13
  '#95a5a6', // 14
]

// Função para gerar o gradiente CSS com faixas discretas
function generateGradient(colors: string[]): string {
  const step = 100 / colors.length
  return `linear-gradient(to right, ${colors
    .map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`)
    .join(', ')})`
}

// injeta no elemento
const gradient = generateGradient(colors)
</script>

<template>
  <div class="accessibility">
    <label for="daltonismo">Daltonismo:</label>
    <select id="daltonismo" v-model="mode" @change="cvd.setMode(mode)">
      <option value="none">Nenhum</option>
      <option value="protanopia">Protanopia</option>
      <option value="deuteranopia">Deuteranopia</option>
      <option value="tritanopia">Tritanopia</option>
    </select>
  </div>
  <div class="color-bar"></div>
</template>

<style scoped lang="scss">
.accessibility {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  label {
    font-size: var(--text-md);
  }

  select {
    appearance: none; /* remove estilo nativo */
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    font-size: var(--text-md);
    border: none;
    background: rgba(29, 30, 28, 0);
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    cursor: pointer;
    outline: none;

    /* seta personalizada */
    background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='12' viewBox='0 0 20 20' width='12' xmlns='http://www.w3.org/2000/svg'><path d='M5.25 7.5l4.5 4.5 4.5-4.5H5.25z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    option {
      color: var(--color-white);
    }
  }
}
.color-bar {
  width: 100%;
  max-width: 960px;
  height: 48px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  background: v-bind(gradient);
}
</style>
