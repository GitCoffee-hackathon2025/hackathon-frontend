<script setup lang="ts">
import type Opcao from '@/store/ClasseOpcoes'
import { defineProps, computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const rota = useRoute()

const rotaAtual = computed(() => rota.path.split('/')[2])
const rotaCaptalizada = computed(() => {
  if (!rotaAtual.value) return ''
  return rotaAtual.value.charAt(0).toUpperCase() + rotaAtual.value.slice(1).toLowerCase()
})
const props = defineProps({
  opcoes: {
    type: Array<Opcao>,
    require: true,
  },
})

const largura = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const atualizarLargura = () => (largura.value = window.innerWidth)
onMounted(() => window.addEventListener('resize', atualizarLargura))
onBeforeUnmount(() => window.removeEventListener('resize', atualizarLargura))
</script>

<template>
  <div class="painel">
    <ul class="opcoes" v-if="!rotaAtual || largura >= 992">
      <li v-for="(opcao, index) in props.opcoes" :key="index">
        <router-link :to="opcao.link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 35 35"
            fill="currentColor"
            v-html="opcao.icone"
          ></svg>
          <p v-text="opcao.texto"></p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="24"
            viewBox="0 0 14 24"
            fill="none"
            class="seta"
          >
            <path
              d="M2 22L12 12L2 2"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
        ></router-link>
      </li>
    </ul>
    <div class="rota">
      <router-link v-if="rotaAtual && largura <= 992" to="/usuario" class="voltar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="21"
          viewBox="0 0 35 21"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.27812 10.2101L10.5875 14.4613C10.7487 14.6095 10.878 14.7882 10.9676 14.9867C11.0573 15.1852 11.1055 15.3995 11.1094 15.6169C11.1133 15.8342 11.0728 16.05 10.9903 16.2516C10.9078 16.4531 10.7849 16.6362 10.6291 16.7899C10.4734 16.9435 10.2878 17.0647 10.0835 17.1461C9.87921 17.2275 9.66039 17.2675 9.44011 17.2636C9.21982 17.2598 9.00257 17.2122 8.80132 17.1238C8.60007 17.0353 8.41895 16.9078 8.26875 16.7488L1.15937 9.73531L0 8.59158L1.15937 7.44784L8.26875 0.434385C8.57976 0.148495 8.99111 -0.00714589 9.41614 0.000252154C9.84118 0.0076502 10.2467 0.17751 10.5473 0.474045C10.8479 0.770581 11.0201 1.17064 11.0276 1.58994C11.0351 2.00924 10.8773 2.41504 10.5875 2.72185L6.27812 6.97309H27.8906C29.7761 6.97309 31.5844 7.712 32.9177 9.02728C34.251 10.3426 35 12.1265 35 13.9865C35 15.8466 34.251 17.6305 32.9177 18.9458C31.5844 20.2611 29.7761 21 27.8906 21H23.5156C23.0805 21 22.6632 20.8295 22.3555 20.526C22.0479 20.2224 21.875 19.8108 21.875 19.3815C21.875 18.9523 22.0479 18.5406 22.3555 18.2371C22.6632 17.9335 23.0805 17.763 23.5156 17.763H27.8906C28.9059 17.763 29.8796 17.3651 30.5975 16.6569C31.3154 15.9487 31.7188 14.9881 31.7188 13.9865C31.7188 12.985 31.3154 12.0244 30.5975 11.3162C29.8796 10.6079 28.9059 10.2101 27.8906 10.2101H6.27812Z"
          />
        </svg>
        <h1>{{ rotaCaptalizada }}</h1>
      </router-link>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
.painel {
  position: fixed;
  top: 25px;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  height: 80%;
  width: var(--largura-componentes);
  background-color: var(--cinza);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 8px;
  box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.25);

  ul.opcoes {
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 15px;
    li {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;

      a {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        text-decoration: none;
        svg {
          width: calc(var(--tamanho-icones) * 1.5);
          height: calc(var(--tamanho-icones) * 1.5);
          color: var(--branco);
        }

        p {
          color: var(--branco);
          font-size: var(--texto-gg);
        }

        svg.seta {
          margin: 0 0 0 auto;
          width: var(--tamanho-icones);
          height: calc(var(--tamanho-icones) * 0.7);
        }
      }
    }
  }

  div.rota {
    a.voltar {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      text-decoration: none;
      color: var(--branco);

      svg {
        width: var(--tamanho-icones);
        height: var(--tamanho-icones);
      }

      h1 {
        font-weight: normal;
        font-size: var(--texto-gg);
      }
    }
  }
}

@media (min-width: 992px) {
  .painel {
    height: 80vh;
    width: 70%;
    top: 50%;
    bottom: 25px;
    left: 50%;
    transform: translate(-50%, -50%);

    ul.opcoes {
      flex-direction: row;
      overflow-y: hidden;
      overflow-x: scroll;
      border-bottom: 1px solid var(--branco);
      padding-bottom: 10px;
    }
  }
}
</style>
