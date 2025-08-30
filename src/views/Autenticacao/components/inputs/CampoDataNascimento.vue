<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDataUserStore } from '@/store/dataUserStore'

const dataUserStore = useDataUserStore()

// Estados locais
const dia = ref('')
const mes = ref('')
const ano = ref('')

// Meses disponíveis
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

// Lista de anos (do atual até 1900)
const anos = computed(() => {
  const atual = new Date().getFullYear()
  return Array.from({ length: atual - 1899 }, (_, i) => (atual - i).toString())
})

// Dias do mês dinâmicos
const diasNoMes = computed(() => {
  if (!mes.value || !ano.value) return Array.from({ length: 31 }, (_, i) => i + 1)

  const m = Number(mes.value)
  const a = Number(ano.value)

  if (m === 2) {
    const bissexto = (a % 4 === 0 && a % 100 !== 0) || (a % 400 === 0)
    return Array.from({ length: bissexto ? 29 : 28 }, (_, i) => i + 1)
  }

  const diasMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return Array.from({ length: diasMes[m - 1] }, (_, i) => i + 1)
})

// Zerar dia inválido ao trocar mês/ano
watch([mes, ano], () => {
  if (dia.value && Number(dia.value) > diasNoMes.value.length) {
    dia.value = ''
  }
})

// Atualizar a store sempre que todos os campos forem válidos
watch([dia, mes, ano], ([d, m, a]) => {
  if (d && m && a) {
    const data = new Date(Number(a), Number(m) - 1, Number(d))
    dataUserStore.userDateBirth = isNaN(data.getTime()) ? null : data
  } else {
    dataUserStore.userDateBirth = null
  }
})
</script>

<template>
  <div class="datanascimento">
    <select v-model="dia">
      <option disabled value="">Dia</option>
      <option v-for="d in diasNoMes" :key="d" :value="d.toString()">
        {{ d.toString().padStart(2, '0') }}
      </option>
    </select>

    <select v-model="mes">
      <option disabled value="">Mês</option>
      <option v-for="(nome, i) in meses" :key="i" :value="(i+1).toString()">
        {{ nome }}
      </option>
    </select>

    <select v-model="ano">
      <option disabled value="">Ano</option>
      <option v-for="a in anos" :key="a" :value="a">
        {{ a }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.datanascimento {
  grid-column: 1 / 31;
  grid-row: 8 / 12;
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
    font-size: var(--texto-m);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="%23999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: calc(var(--tamanho-icones) - 2.5vw);
    transition: border 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      outline: none;
    }
  }
}
</style>
