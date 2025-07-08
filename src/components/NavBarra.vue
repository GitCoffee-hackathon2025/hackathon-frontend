<script setup lang="ts">
import {ref} from 'vue'
 const isExpanse = ref<boolean>(false)
 function toggleBar() {
  isExpanse.value = !isExpanse.value
 }
</script>

<template>
 <nav :class="['container-nav', {isExpanse}]">
  <div class="icons">
    <span class="fa-solid fa-bars" @click="toggleBar"></span>
    <span class="fa-solid fa-user"></span>
    <span class="fa-solid fa-gear"></span>
  </div>
 </nav>
</template>

<style scoped>
.container-nav{
   background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;       
  height: 100vh;
  width: 4.6vw;
  .icons{
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 6rem;
    margin-top: 2vw;
  }
  span{
    font-size: 2rem;
    
  }
}
.container-nav.isExpanse{
  width:  20vw;
  align-items: left;
  transition: .5s ease-in-out;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
