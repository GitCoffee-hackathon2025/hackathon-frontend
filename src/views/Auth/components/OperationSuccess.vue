<script setup lang="ts">
const { message } = defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <div class="icon-success">
      <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1280" viewBox="0 0 1600 1280">
        <path
          fill="currentColor"
          d="M1575 310q0 40-28 68l-724 724l-136 136q-28 28-68 28t-68-28l-136-136L53 740q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295l656-657q28-28 68-28t68 28l136 136q28 28 28 68"
        />
      </svg>
    </div>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped lang="scss">
div {
  grid-row: 1 / 26;
  grid-column: 1 / 31;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  div.icon-success {
    background-color: var(--color-green);
    padding: 30px;
    border-radius: 50%;
    svg {
      color: var(--color-white);
      width: calc(var(--icon-size) * 4);
      height: calc(var(--icon-size) * 4);
    }
  }

  p {
    color: var(--color-gray-dark);
    font-size: var(--text-md);
  }
}
</style>
