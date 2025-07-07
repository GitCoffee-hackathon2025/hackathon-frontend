<script setup lang="ts">

</script>

<template>
 <nav class="container-nav">
    <span class="fa-solid fa-bars"></span>
    <span class="fa-solid fa-user"></span>
    <span class="fa-solid fa-gear"></span>
    <h2>reclame</h2>
 </nav>
</template>

<style scoped>
.container-nav{
  background-color: black;
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
