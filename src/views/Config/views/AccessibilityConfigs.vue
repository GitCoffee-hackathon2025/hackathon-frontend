<script setup lang="ts">
import { useCvdStore } from '@/store/DaltonismStore';
import { storeToRefs } from 'pinia';
const cvd = useCvdStore()
const { mode } = storeToRefs(cvd) // reactive binding
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
</style>
