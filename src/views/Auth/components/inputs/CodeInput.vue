<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

import { UserStore } from '@/store/UserStore'
const user = UserStore()

const digits = 6
const otp = ref<string[]>(Array(digits).fill(''))
const inputs = ref<(HTMLInputElement | null)[]>(Array(digits).fill(null))

const countArray = computed(() => Array.from({ length: digits }))

onMounted(() => {
  setTimeout(() => inputs.value[0]?.focus(), 0)
})

watch(otp.value, () => {
  user.emailToken = Number(otp.value.join(''))
})

function onInput(index: number, event: Event) {
  const el = event.target as HTMLInputElement
  const digit = el.value.replace(/\D/g, '').slice(0, 1)
  otp.value[index] = digit
  if (digit && index < digits - 1) {
    inputs.value[index + 1]?.focus()
    inputs.value[index + 1]?.select()
  }
}

function onKeyDown(index: number, event: KeyboardEvent) {
  const k = event.key
  if (k === 'Backspace') {
    if (otp.value[index]) {
      otp.value[index] = ''
    } else if (index > 0) {
      inputs.value[index - 1]?.focus()
      otp.value[index - 1] = ''
    }
  } else if (k === 'ArrowLeft' && index > 0) {
    inputs.value[index - 1]?.focus()
  } else if (k === 'ArrowRight' && index < digits - 1) {
    inputs.value[index + 1]?.focus()
  } else if (/^\d$/.test(k)) {
  } else if (k.length === 1) {
    event.preventDefault()
  }

  if (
    index === digits - 1 &&
    !(k === 'ArrowRight') &&
    !(k === 'ArrowLeft') &&
    !(k === 'Backspace')
  ) {
    setTimeout(() => inputs.value[index]?.select(), 0)
  }
}
function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  const nums = text.replace(/\D/g, '').slice(0, digits).split('')
  nums.forEach((n, i) => (otp.value[i] = n))
  const next = nums.length < digits ? nums.length : digits - 1
  inputs.value[next]?.focus()
}

function onFocus(index: number) {
  setTimeout(() => inputs.value[index]?.select(), 0)
}

const props = defineProps({
  error: {
    type: Boolean,
    required: true,
  },
})
</script>
<template>
  <div class="otp-container">
    <input
      v-for="(n, i) in countArray"
      :key="i"
      :ref="(el) => (inputs[i] = el)"
      class="otp-box"
      type="text"
      inputmode="numeric"
      maxlength="1"
      v-model="otp[i]"
      @input="onInput(i, $event)"
      @keydown="onKeyDown(i, $event)"
      @paste="onPaste"
      @focus="onFocus(i)"
    />
  </div>
</template>

<style scoped lang="scss">
.otp-container {
  max-width: var(--component-width);
  height: calc(var(--component-height) * 1.9);
  grid-column: 1 / 31;
  grid-row: 1 / 25;
  display: flex;

  justify-content: space-evenly;
  justify-self: center;
  align-self: center;
  flex-wrap: wrap;

  .otp-box {
    font-size: var(--text-xl);
    width: 15%;
    height: 100%;
    text-align: center;
    font-weight: bold;
    border-radius: 0.8rem;
    background: var(--color-gray-light);
    outline: none;
    border: none;
    font-family: monospace;
    color: var(--color-gray-dark);
    caret-color: transparent;

    &::selection {
      background: transparent;
      color: inherit;
    }
    &::-moz-selection {
      background: transparent;
      color: inherit;
    }

    &:focus {
      outline: 1px solid var(--color-black);
    }
  }
}

@media (min-width: 992px) {
  .otp-container {
    grid-row: 1 / 27;
    height: calc(var(--component-height) * 1.7);
    .otp-box {
      width: 14%;
    }
  }
}
</style>
