<script setup lang="ts">

</script>

<template>
  <svg class="spinner-icon"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="red" />
      </linearGradient>
    </defs>
    <circle id="circle" cx="500" cy="500" r="450" fill="#ffffff" stroke="darkgrey" stroke-width="50"/>
<!--                      <path id="hand" d="M 450,500 L 500,50 L 550,500 L 525,600 L 500,625 L 475,600 Z" fill="#000000ff"/>-->
    <circle id="inner-circle" cx="500" cy="500" r="420" fill="url(#Gradient2)"/>
  </svg>
</template>

<style scoped>
svg {
  animation: 1s infinite linear spinner;
}

@keyframes spinner {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>