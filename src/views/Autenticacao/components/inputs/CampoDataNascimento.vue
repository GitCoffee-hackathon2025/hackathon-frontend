<!-- Feito  rápidamente com chatgpt, necessário análise -->

<script setup lang="ts">
import { ref, computed } from 'vue'

const diaNascimento = ref<string | number>('')
const mesNascimento = ref<string | number>('')
const anoNascimento = ref<string | number>('')

const meses = [
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

const anos = computed(() => {
  const anoAtual = new Date().getFullYear()
  const lista = []
  for (let i = anoAtual; i >= 1900; i--) {
    lista.push(i)
  }
  return lista
})

const diasNoMes = computed(() => {
  if (!diasNoMes.value || !anoNascimento.value) return Array.from({ length: 31 }, (_, i) => i + 1)

  const days = new Date(Number(anoNascimento.value), Number(mesNascimento.value), 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})

// fazer com que fevereiro tenha apenas 28 dias
</script>

<template>
  <div class="datanascimento">
    <select v-model="diaNascimento">
      <option disabled value="">Dia</option>
      <option v-for="dia in diasNoMes" :key="dia" :value="dia">
        {{ dia }}
      </option>
    </select>

    <select v-model="mesNascimento">
      <option disabled value="">Mês</option>
      <option v-for="(mes, index) in meses" :key="index" :value="index + 1">
        {{ mes }}
      </option>
    </select>

    <select v-model="anoNascimento">
      <option disabled value="">Ano</option>
      <option v-for="ano in anos" :key="ano" :value="ano">
        {{ ano }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.datanascimento {
  grid-column: 1 / 31;
  grid-row: 6 / 10;
  justify-self: center;
  align-self: center;
  width: var(--largura-componentes);
  height: var(--altura-componentes);
  display: flex;
  justify-content: space-between;

  select {
    width: 30%;
    height: 100%;
    border: none;
    border-radius: 0.6rem;
    background: var(--cinza-claro);
    color: var(--cinza);
    padding: 0 1rem;
    font-size: var(--texto-pequeno);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="%23999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;

    transition:
      border 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
    }
  }
}
</style>
