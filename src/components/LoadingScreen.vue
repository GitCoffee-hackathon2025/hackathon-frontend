<template>
  <div class="loading-overlay" role="status" aria-live="polite" aria-label="Carregando">
    <div class="loader">
      <div class="ring" aria-hidden="true">
        <div class="dot" aria-hidden="true"></div>
      </div>
      <div class="label">Carregando...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Controle de visibilidade no pai: v-if / v-show
</script>

<style scoped lang="scss">
/* variáveis: ajuste aqui para tamanho/espessura */

$loader-size: 60px; /* diâmetro total do anel */
$ring-thickness: 10px; /* espessura do anel */
$spin-duration: 1s;

/* overlay com blur de fundo (se quiser blurar o que estiver atrás) */
.loading-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

}

/* container central */
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  transform: translateZ(0); /* composição para suavizar animações */
}

/* anel: o gradiente e o recorte estão no ::before */
.ring {
  width: $loader-size;
  height: $loader-size;
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 50%;
  /* fundo transparente; o efeito vem do ::before */animation: spin $spin-duration linear infinite;
}

/* pseudo-elemento que produz o gradiente e é recortado em 'anel' via mask */
.ring::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  /* gradiente conic — ajuste as cores conforme seu tema */
  background: conic-gradient(
    from 270deg,
    var(--color-gray-dark) 0%,
    rgb(104, 105, 103) 25%,
    rgb(150, 151, 149) 50%,
    var(--color-white) 75%,
    var(--color-white) 100%
  );

  /* cortamos o miolo com uma máscara radial.
     - transparent (centro) => transparente
     - black (fora) => opaco (visível)
     Assim obtemos um anel. */
  -webkit-mask: radial-gradient(
    circle at center,
    transparent calc(50% - var(--ring-thickness) - 1px),
    rgba(0, 0, 0, 1) calc(50% - var(--ring-thickness) + 1px)
  );
  mask: radial-gradient(
    circle at center,
    transparent calc(50% - $ring-thickness),
    black calc(50% - $ring-thickness + 1px)
  );

  /* animamos apenas o pseudo-elemento (o .dot NÃO gira) */
  transform-origin: center center;

  will-change: transform;
}

/* ponto branco — posicionado acima do anel e NÃO roda (porque a animação está no ::before) */
.dot {
  position: absolute;
  top: calc(50%);
  transform: translateY(-50%);
  left: 0;

  width: calc(50% - $ring-thickness - 2px);
  height: calc(50% - $ring-thickness - 1px);
  border-radius: 50%;
  background: var(--color-white);
  z-index: 3;

  filter: blur(0.2px);
}

/* rótulo */
.label {
  color: var(--color-white);
  font-size: var(--text-md);
}

/* rotação */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
