<template>
  <div >
    <div>
      <select v-model="diaNascimento">
        <option v-for="dia in diasNoMes" :key="dia" :value="dia">
          {{ dia }}
        </option>
      </select>

      <select v-model="mesNascimento">
        <option v-for="(mes, index) in meses" :key="index" :value="index + 1">
          {{ mes }}
        </option>
      </select>

      <select v-model="anoNascimento">
        <option v-for="ano in anos" :key="ano" :value="ano">
          {{ ano }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const diaNascimento = ref<number>()
const mesNascimento = ref()
const anoNascimento = ref<number>()

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
  if (!diasNoMes.value || !anoNascimento.value)
    return Array.from({ length: 31 }, (_, i) => i + 1)

  const days = new Date(anoNascimento.value, mesNascimento.value, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})

// fazer com que fevereiro tenha apenas 28 dias
</script>
