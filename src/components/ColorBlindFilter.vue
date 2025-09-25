<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="position: absolute; width: 0; height: 0"
    aria-hidden="true"
  >
    <!-- Deuteranopia -->
    <filter id="deuteranopia">
      <feColorMatrix
        type="matrix"
        values="0.367 0.861 -0.228 0 0
                0.280 0.673 0.047 0 0
               -0.012 0.043 0.969 0 0
                0     0     0     1 0"
      />
    </filter>

    <!-- Protanopia -->
    <filter id="protanopia">
      <feColorMatrix
        type="matrix"
        values="0.566 0.433 0.000 0 0
                0.558 0.442 0.000 0 0
                0.000 0.242 0.758 0 0
                0     0     0     1 0"
      />
    </filter>

    <!-- Tritanopia -->
    <filter id="tritanopia">
      <feColorMatrix
        type="matrix"
        values="0.95  0.05  0    0 0
                0     0.433 0.567 0 0
                0     0.475 0.525 0 0
                0     0     0     1 0"
      />
    </filter>
  </svg>
</template>

<style scoped lang="scss">
svg{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100000000000000000000;
}
</style>
