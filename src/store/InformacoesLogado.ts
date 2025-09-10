import { defineStore } from 'pinia'
import { ref } from 'vue'

export const informacoesLogadoStore = defineStore('bairro', () => {
  const emailLogado = ref<string>('')
  const nomeLogado = ref<string>('')
  const dataNascimentoLogado = ref<string>('')
  const telefoneLogado = ref<string>('')

  const historicoDenuncias = ref<[]>()

  return { emailLogado, nomeLogado, dataNascimentoLogado, telefoneLogado, historicoDenuncias }
})

