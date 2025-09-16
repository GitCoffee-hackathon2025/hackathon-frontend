<script setup lang="ts">
import { computed } from 'vue'

import type { Steps } from '@/store/TypesStore'
import type { PropType } from 'vue'

const props = defineProps({
  steps: {
    type: Object as PropType<Steps>,
    required: true,
  },
})

const { steps } = props

const stepPercent = (i: number) => {
  if (steps.qtd <= 1) return 100
  return ((i - 1) / (steps.qtd - 1)) * 100
}

const progressPercent = computed(() => {
  if (steps.qtd <= 1) return 100
  return Math.round(((steps.current - 1) / (steps.qtd - 1)) * 100 * 10) / 10 + 0.1
})
</script>

<template>
  <div class="progress-simple anim">
    <div class="progress-track"></div>
    <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    <div class="progress-steps">
      <div
        v-for="i in steps.qtd"
        :key="i"
        :class="['green-circle', { active: progressPercent >= stepPercent(i) }]"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.progress-simple {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 6px;
  z-index: 2000;
  pointer-events: none;
  .progress-track {
    position: absolute;
    inset: 0;
    background: var(--color-white);
    border-radius: 4px;
  }
  .progress-fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 0%;
    transition: width 300ms ease;
    background: var(--color-green);
    border-radius: 4px;
    z-index: 1;
  }
  .progress-steps {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    pointer-events: none;

    .green-circle {
      width: var(--icon-size);
      height: var(--icon-size);
      border-radius: 50%;
      box-sizing: border-box;
      transition:
        background-color 180ms ease,
        border-color 180ms ease,
        transform 180ms ease;
      transform: translateZ(0);
      background: var(--color-white);
      &.active {
        background: var(--color-green);
        border-color: var(--color-green);
        transform: scale(1.05);
      }
    }
  }
}

@media (min-width: 992px) {
  .progress-simple {
    width: 45vw;
    top: 30%;
    z-index: 1;
    &.register-bar {
      left: 2.5vw;
      transform: translateX(0);
    }
    &.recover-bar {
      left: 52.5vw;
      transform: translateX(0);
    }

    &.anim {
      animation: leftToRight 1s ease;
    }

    @keyframes leftToRight {
      0% {
        transform: translateX(-100vw);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
}
</style>
