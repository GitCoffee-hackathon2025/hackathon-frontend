<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDataUserStore } from '@/store/dataUserStore'

const dataUserStore = useDataUserStore()

// Declaração única das variáveis (remover a duplicação)
const diaNascimento = ref<string>('')
const mesNascimento = ref<string>('')
const anoNascimento = ref<string>('')

// Watch para atualizar a data completa na store
watch([diaNascimento, mesNascimento, anoNascimento], ([dia, mes, ano]) => {
  if (dia && mes && ano) {
    // Criar objeto Date (mês é 0-indexed, por isso mes - 1)
    const dataCompleta = new Date(Number(ano), Number(mes) - 1, Number(dia))
    
    // Validar se a data é válida
    if (!isNaN(dataCompleta.getTime())) {
      dataUserStore.userDateBirth = dataCompleta
    } else {
      dataUserStore.userDateBirth = null
    }
  } else {
    dataUserStore.userDateBirth = null
  }
})

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const anos = computed(() => {
  const anoAtual = new Date().getFullYear()
  const lista: number[] = []
  for (let i = anoAtual; i >= 1900; i--) {
    lista.push(i)
  }
  return lista
})

// Cálculo correto de dias no mês
const diasNoMes = computed(() => {
  if (!mesNascimento.value || !anoNascimento.value) {
    return Array.from({ length: 31 }, (_, i) => i + 1)
  }

  const mes = Number(mesNascimento.value)
  const ano = Number(anoNascimento.value)
  
  // Fevereiro: verificar se é ano bissexto
  if (mes === 2) {
    const isBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0)
    return Array.from({ length: isBissexto ? 29 : 28 }, (_, i) => i + 1)
  }
  
  // Meses com 30 ou 31 dias
  const dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return Array.from({ length: dias[mes - 1] }, (_, i) => i + 1)
})

// Resetar dia selecionado se for maior que os dias do mês
watch([mesNascimento, anoNascimento], () => {
  const diaAtual = Number(diaNascimento.value)
  const diasDisponiveis = diasNoMes.value
  
  if (diaAtual && diaAtual > diasDisponiveis.length) {
    diaNascimento.value = ''
  }
})
</script>

<template>
  <div class="datanascimento">
    <select v-model="diaNascimento">
      <option disabled value="">Dia</option>
      <option v-for="dia in diasNoMes" :key="dia" :value="dia.toString()">
        {{ dia.toString().padStart(2, '0') }}
      </option>
    </select>

    <select v-model="mesNascimento">
      <option disabled value="">Mês</option>
      <option v-for="(mes, index) in meses" :key="index" :value="(index + 1).toString()">
        {{ mes }}
      </option>
    </select>

    <select v-model="anoNascimento">
      <option disabled value="">Ano</option>
      <option v-for="ano in anos" :key="ano" :value="ano.toString()">
        {{ ano }}
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

    transition:
      border 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
    }
  }
}
</style>