<!-- Feito  rápidamente com chatgpt, necessário análise -->

<script setup lang="ts">
import { ref, watch } from 'vue'

const DIGITOS = 6
const otp = ref<string[]>(Array(DIGITOS).fill(''))
const inputs = ref<(HTMLInputElement | null)[]>([])

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const valor = input.value.replace(/\D/g, '').slice(0, 1)
  otp.value[index] = valor

  if (valor && index < DIGITOS - 1) {
    inputs.value[index + 1]?.focus()
  }
}

function onKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

function onPaste(event: ClipboardEvent) {
  const texto = event.clipboardData?.getData('text') || ''
  const numeros = texto.replace(/\D/g, '').slice(0, DIGITOS).split('')
  numeros.forEach((num, i) => {
    otp.value[i] = num
    if (inputs.value[i]) {
      inputs.value[i]!.value = num
    }
  })
  const next = numeros.length < DIGITOS ? numeros.length : DIGITOS - 1
  inputs.value[next]?.focus()
}

const codigoFinal = ref('')
watch(otp, () => {
  codigoFinal.value = otp.value.join('')
})
</script>

<template>
  <div class="otp-container" @paste="onPaste">
    <input
      v-for="(_, i) in DIGITOS"
      :key="i"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="otp-box"
      ref="inputs"
      v-model="otp[i]"
      @input="onInput(i, $event)"
      @keydown="onKeyDown(i, $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.otp-container {
  display: flex;
  gap: 2.1rem;
  justify-content: center;
  justify-self: center;
  align-self: center;
  .otp-box {
    width: 4.2rem;
    height: 5.5rem;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    border-radius: 0.8rem;
    background: var(--cinza-claro);
    outline: none;
    border: none;
    font-family: monospace;
    color: var(--cinza);

    &:focus {
      outline: 1px solid var(--preto);
    }
  }
}
</style>
