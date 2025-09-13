<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { UserStore } from '@/store/UserStore'

const user = UserStore()

// Estados locais
const day = ref('')
const month = ref('')
const year = ref('')

// Meses disponíveis
const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

// Lista de anos (do atual até 1900)
const years = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: current - 1899 }, (_, i) => (current - i).toString())
})

// Dias do mês dinâmicos
const daysInMonth = computed(() => {
  if (!month.value || !year.value) return Array.from({ length: 31 }, (_, i) => i + 1)

  const m = Number(month.value)
  const a = Number(year.value)

  if (m === 2) {
    const leapYear = (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0
    return Array.from({ length: leapYear ? 29 : 28 }, (_, i) => i + 1)
  }

  const lastDayMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return Array.from({ length: lastDayMonth[m - 1] }, (_, i) => i + 1)
})

// Zerar dia inválido ao trocar mês/ano
watch([month, year], () => {
  if (day.value && Number(day.value) > daysInMonth.value.length) {
    day.value = ''
  }
})

// Atualizar a store sempre que todos os campos forem válidos
watch([day, month, year], ([d, m, a]) => {
  if (d && m && a) {
    user.birthday = new Date(Number(a), Number(m) - 1, Number(d))
  } else {
    user.birthday = null
  }
})
</script>

<template>
  <div class="birthday">
    <select v-model="day">
      <option disabled value="">Dia</option>
      <option v-for="d in daysInMonth" :key="d" :value="d.toString()">
        {{ d.toString().padStart(2, '0') }}
      </option>
    </select>

    <select v-model="month">
      <option disabled value="">Mês</option>
      <option v-for="(name, i) in months" :key="i" :value="(i + 1).toString()">
        {{ name }}
      </option>
    </select>

    <select v-model="year">
      <option disabled value="">Ano</option>
      <option v-for="y in years" :key="y" :value="y">
        {{ y }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.birthday {
  grid-column: 1 / 31;
  grid-row: 11 / 15;
  justify-self: center;
  align-self: center;
  width: var(--component-width);
  height: var(--component-height);
  display: flex;
  justify-content: space-between;

  select {
    width: 30%;
    height: 100%;
    border: none;
    border-radius: 0.6rem;
    background: var(--color-gray-light);
    color: var(--color-gray-dark);
    padding: 0 1rem;
    font-size: var(--texto-m);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="%23999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: calc(var(--icon-size) - 2.5vw);
    transition:
      border 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
    }
  }
}
</style>
