<template>
  <!-- Created with Inkscape (http://www.inkscape.org/) -->

  <svg
      class="logo"
      width="1000mm"
      height="1000mm"
      viewBox="0 0 1000 1000"
      version="1.1"
      id="svg1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg">
    <path
        class="strait"
        d="M 124.94488,126.00322 785.22168,145.05319 420.03426,299.69301 697.50328,463.61154 870.01164,881.6533 507.00304,726.66899 109.00833,819.14999 211.2606,520.76146 507.00304,726.66899 420.03426,299.69301 124.94488,126.00322 v 0 0"
        id="path2" />

    <circle
        class="system green"
        id="path1"
        cx="420.03427"
        cy="299.69302"
        r="83.815727" />
    <circle
        class="system red"
        id="path1-5"
        cx="785.22168"
        cy="145.05319"
        r="83.815727" />
    <circle
        class="system blue"
        id="path1-7"
        cx="124.94488"
        cy="126.00322"
        r="83.815727" />
    <circle
        class="system cyan"
        id="path1-9"
        cx="120.71156"
        cy="824.50305"
        r="83.815727" />
    <circle
        class="system pink"
        id="path1-2"
        cx="507.00305"
        cy="726.66901"
        r="83.815727" />
    <circle
        class="system purple"
        id="path1-58"
        cx="697.5033"
        cy="463.61154"
        r="83.815727" />
    <circle
        class="system yellow"
        id="path1-58-8"
        cx="211.2606"
        cy="520.76147"
        r="83.815727" />
    <circle
        class="system orange"
        id="path1-1"
        cx="870.01166"
        cy="881.65332"
        r="83.815727" />
  </svg>
</template>

<style scoped>

.logo {
  height: 2rem;
  width: 2rem;
}
/****************************************************************************************************
 * Start of styles from base svg file.  Move from base svg into this block so Vuejs doesn't choke. **
 ****************************************************************************************************/
.strait {
  fill:none;
  fill-opacity:1;
  stroke: var(--color-stroke-map);
  stroke-width:15;
  stroke-dasharray:none;
  stroke-opacity:1;
}
.system {
  fill-opacity: 1;
  stroke: var(--color-stroke-map);
  stroke-width: 5;
  stroke-dasharray: none;
  stroke-opacity: 1
}
.system.red {
  fill: #ff1a1a;
}
.system.green {
  fill: #00e900;
}
.system.blue {
  fill: var(--color-fill-map-blue, #1a1aff);
}
.system.cyan {
  fill: #1ae6ff;
}
.system.pink {
  fill: #ff1ae8;
}
.system.purple {
  fill: #c919ff;
}
.system.yellow {
  fill: #ffe11a;
}
.system.orange {
  fill: #ffba1a;
}
@media (prefers-color-scheme: dark) {
  .strait, .system {
    stroke: var(--color-stroke-map);
    stroke-width: 15;
  }
  .system.blue {
    fill: var(--color-fill-map-blue, #1111ff);
  }
}
/**************************************
 * End of styles from base svg file. **
 **************************************/

</style>
<script setup lang="ts">
</script>