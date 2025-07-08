<script setup lang="ts">
import { ref } from 'vue'
const isExpanse = ref<boolean>(false)
function toggleBar() {
  isExpanse.value = !isExpanse.value
}
</script>

<template>
  <nav :class="['container-nav', { isExpanse }]">
    <ul class="icons">
      <li>
        <span class="fa-solid fa-bars" @click="toggleBar"></span>
        <p :class="{ visible: isExpanse }">Bars</p>
      </li>
      <li>
        <span class="fa-solid fa-user"></span>
        <p :class="{ visible: isExpanse }">User</p>
      </li>
      <li>
        <span class="fa-solid fa-gear"></span>
        <p :class="{ visible: isExpanse }">Settings</p>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.container-nav {
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 4.6rem;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
}

.container-nav.isExpanse {
  width: 16rem;
}

.icons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 1.2rem;
  width: 100%;
  gap: 3rem;
  margin-top: 2rem;
}

.icons li {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  position: relative;
}

.icons p {
  color: white;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  white-space: nowrap;
}

.icons p.visible {
  opacity: 1;
  transform: translateX(2rem);
}
  
span {
  font-size: 2rem;
  color: white;
  cursor: pointer;
}
</style>
