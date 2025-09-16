<script setup lang="ts">
import type { Option } from '@/store/TypesStore'
import {
  defineProps,
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  reactive,
  watch,
  nextTick,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const routeInfo = useRoute()

const currentRoute = computed(() => routeInfo.name) //Se não tiver rota, significa que está na página principal e aparecerá a lista da class "opcoes"

//Lista de opcôes como as de 'Conta', 'Termos e Privacidade' e 'Histórico de denúncias'. Cada objeto dentrodo array tem, os ícones, link e texto que aparece no link.
const props = defineProps({
  options: {
    type: Array<Option>,
    require: true,
  },
  route: {
    type: String,
    required: true,
  },
  defaultRoute: {
    type: String,
    requeired: true,
  },
})

//Pega o título da rota no seu meta
const title = computed(() => {
  const m = routeInfo.matched[routeInfo.matched.length - 1]
  return (m && m.meta?.titulo) ?? ''
})

//Pega a largura da tela
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

function updateScreenWidth() {
  screenWidth.value = window.innerWidth

  //Se a tela for maior que 992px e for a rota principal de usuário, muda para a rota 'defaultRoute' por padrão para que quando a tela redimensione não fique vazio abaixo da navegação de "opcoes"
  if (screenWidth.value >= 992 && currentRoute.value == props.route) {
    router.push({ name: props.defaultRoute })
  }
}
//Atualizar os componentes quando a tela redimensionar durante o uso do site
onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
  if (screenWidth.value >= 992 && currentRoute.value == props.route) {
    router.push({ name: props.defaultRoute })
  }
})

watch(currentRoute, () => {
  if (screenWidth.value >= 992 && routeInfo.name == props.route) {
    router.push({ name: props.defaultRoute })
  }
})

onBeforeUnmount(() => window.removeEventListener('resize', updateScreenWidth))

//Scroll dentro do painel quando está em alguma página como "/usuario/conta"
const scrollRef = ref<HTMLElement | null>(null) //Div que tem o scroll mais pro final do template
const scrollPosition = ref(0)
const topLimitVisible = ref(false)
const bottomLimitVisible = ref(true)

const updateScroll = () => {
  if (scrollRef.value) {
    scrollPosition.value =
      scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight // Calcula quanto falta para alcançar o máximo do scroll

    topLimitVisible.value = scrollRef.value.scrollTop > 0 ? true : false //Se a ditância percorrida pelo scroll for zero significa que está no início, então o degradê não aparece.

    bottomLimitVisible.value = !(scrollPosition.value < 1) ? true : false //Se a distância para alcançar o máximo for menor que 1, o degradê desaparece
  }
}

type ListItem = {
  element: HTMLElement | null
  route: string
}

const refs = reactive<Record<string, ListItem>>({})
const currentRouteWidth = ref<number | undefined>(0)
const leftDistance = ref(0)
const gapSize = ref(0)
async function calculatePosition() {
  // garante que o DOM tenha sido atualizado pelo Vue
  await nextTick()

  let gapCount = 0
  let distance = 0

  // tenta ler o gap real do container (ul.opcoes)
  const gapPx = 40 // fallback

  for (const key in refs) {
    const el = refs[key].element
    if (!el) continue

    if (currentRoute.value === refs[key].route) {
      // define o tamanho do elemento atual
      currentRouteWidth.value = el.offsetWidth ?? 0
      // para de somar aqui (só a esquerda da rota)
      break
    }
    gapCount += 1
    // soma os que estão à esquerda
    distance += el.offsetWidth
  }

  leftDistance.value = distance

  gapSize.value = gapCount * gapPx
}

// roda quando a rota muda E imediatamente no mount
watch(
  currentRoute,
  async () => {
    await nextTick()
    calculatePosition()
  },
  { immediate: true },
)

//Atualiza a classe do item quando a rota muda
const routeClass = (link: string) => {
  const current = String(currentRoute.value ?? '')
  const target = String(link ?? '')
  return current === target ? 'currentRouteLi' : 'hiddenRouteLi'
}

import { UserStore } from '@/store/UserStore'
const user = UserStore()

const rediretLogin = computed(() => {
  if (currentRoute.value == 'user.account' || currentRoute.value == 'user.historic') {
    if (!user.isLogged) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
})
</script>

<template>
  <div class="panel">
    <!-- Caso for um disposotivo móvel e estiver na página principal de qualquer que seja a rota, as opções ficam ocultas-->
    <nav v-if="currentRoute == props.route || screenWidth >= 992">
      <!--  -->
      <div
        class="currentRoute"
        :style="{
          left: 'calc(' + (leftDistance + gapSize) + 'px + var(--icon-size) / 100 ) ',
          width: 'calc(' + (currentRouteWidth ?? 0) + 'px + var(--icon-size) ) ',
        }"
      ></div>
      <ul class="options">
        <li
          v-for="(option, index) in props.options"
          :key="index"
          :ref="
            (el) =>
              (refs[option.refKey] = {
                element: el as HTMLElement | null,
                route: option.link,
              })
          "
          :class="routeClass(option.link)"
        >
          <router-link :to="{ name: option.link }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 38 38"
              fill="none"
              v-html="option.icon"
            ></svg>
            <p v-text="option.text"></p>
            <!-- Caso for um disposotivo móvel muito pequeno e um desktop, o icone de flecha fica oculto-->
            <svg
              v-if="screenWidth >= 355 && screenWidth <= 992"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="24"
              viewBox="0 0 14 24"
              fill="none"
              class="arrow"
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
    </nav>
    <!-- Div da rota aparece apenas se estiver em alguma rota, pra não poluir página principal -->
    <div class="route" v-if="currentRoute != props.route">
      <!-- Caso for um desktop, o link com flecha e título da rota ficam ocultos, ja que a navegação de opções vai estar visivel -->
      <router-link v-if="screenWidth <= 992" :to="{ name: props.route }" class="back">
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
        <h1>{{ title }}</h1>
      </router-link>
      <button v-if="currentRoute == 'user.account' && !rediretLogin">
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" fill="none">
          <path
            d="M2.77778 25C2.01389 25 1.36019 24.7282 0.816667 24.1847C0.273148 23.6412 0.000925926 22.987 0 22.2222V2.77778C0 2.01389 0.272222 1.36019 0.816667 0.816667C1.36111 0.273148 2.01481 0.000925926 2.77778 0H12.5V2.77778H2.77778V22.2222H12.5V25H2.77778ZM18.0556 19.4444L16.1458 17.4306L19.6875 13.8889H8.33333V11.1111H19.6875L16.1458 7.56944L18.0556 5.55556L25 12.5L18.0556 19.4444Z"
          />
        </svg>
      </button>
      <Transition name="slide-top" v-if="!rediretLogin" appear>
        <div v-if="topLimitVisible" class="slide-top">
          <!-- Reutilização do svg de seta apenas rotacionando ele para que a seta direcione para cima-->
          <svg
            style="transform: rotate(180deg)"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 23 23"
          >
            <path
              fill="currentColor"
              d="M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z"
            />
          </svg>
        </div>
      </Transition>
      <div class="scroll" ref="scrollRef" @scroll="updateScroll">
        <div class="limit top" v-if="!rediretLogin">
          <Transition name="slide-top" appear>
            <div v-if="topLimitVisible" class="slide-top">
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <path fill="currentColor" d="" />
              </svg>
            </div>
          </Transition>
        </div>
        <router-view v-if="!rediretLogin"></router-view>
        <div class="redirect" v-else>
          <router-link :to="{ name: 'auth.login' }">Entre com uma conta.</router-link>
          <div class="user-notLogged">
            <p>?</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-0.5 -0.5 25 25"
              fill="none"
              width="25"
              height="25"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M4.47222 6.325C4.47222 4.64751 5.21265 3.03872 6.53061 1.85255C7.84857 0.666382 9.63612 0 11.5 0C13.3639 0 15.1514 0.666382 16.4694 1.85255C17.7874 3.03872 18.5278 4.64751 18.5278 6.325C18.5278 8.00249 17.7874 9.61128 16.4694 10.7975C15.1514 11.9836 13.3639 12.65 11.5 12.65C9.63612 12.65 7.84857 11.9836 6.53061 10.7975C5.21265 9.61128 4.47222 8.00249 4.47222 6.325ZM0 19.55C0 18.025 0.673113 16.5625 1.87126 15.4841C3.06941 14.4058 4.69445 13.8 6.38889 13.8H16.6111C18.3055 13.8 19.9306 14.4058 21.1287 15.4841C22.3269 16.5625 23 18.025 23 19.55V23H0L0 19.55Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <Transition name="slide-down" v-if="!rediretLogin" appear>
        <div v-if="bottomLimitVisible" class="slide-down">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 23 23"
          >
            <path
              fill="currentColor"
              d="M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z"
            />
          </svg>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.panel {
  position: fixed;
  top: 25px;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);

  height: calc(
    100% - (var(--component-height) + 25px + 25px) - 30px
  ); //Cálculo que leva em conta a altura da barra de navegação, px de fora funcionando como um "gap" para que o painel e a barra de navegação não fiquem coladas. Os px que somam com a altura são os top do painel e o bottom da barra de nanvegação

  width: var(--component-width);
  background-color: var(--color-gray-dark);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 5%;
  border-radius: 8px;
  box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.25);
  position: absolute;

  nav {
    width: 100%;
    height: 100%;
    position: relative;

    ul.options {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;

      //Faz não aparecer o scroll em nenhum navegador
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }

      display: flex;
      flex-direction: column;
      align-items: center;
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
          overflow: hidden;
          text-decoration: none;

          svg {
            //Ícones um pouco maiores que os habituais
            width: calc(var(--icon-size) * 1.6);
            height: calc(var(--icon-size) * 1.6);
            color: var(--color-white);
          }

          p {
            color: var(--color-white);
            font-size: var(--text-md);
          }

          svg.arrow {
            //Margin deixa na extrema direita do link e icone de seta menor que o habitual
            margin: 0 0 0 auto;
            width: var(--icon-size);
            height: calc(var(--icon-size) * 0.7);
          }
        }
      }
    }
  }

  div.route {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    z-index: 4;
    position: relative;

    button {
      position: absolute;
      top: 0;
      right: 0;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      width: auto;
      svg {
        width: var(--icon-size);
        height: var(--icon-size);
        fill: var(--color-red);
      }
    }

    .slide-down {
      position: absolute;
      bottom: calc(var(--component-height) - 20px);
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      padding: 10px;
      background-color: var(--color-white);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 60;
      will-change: transform, opacity;

      svg {
        color: var(--color-gray-dark);
        width: var(--icon-size);
        height: var(--icon-size);
      }
    }

    .slide-top {
      position: absolute;
      top: calc(var(--component-height) - 20px);
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      padding: 10px;
      background-color: var(--color-white);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 60;
      will-change: transform, opacity;

      svg {
        color: var(--color-gray-dark);
        width: var(--icon-size);
        height: var(--icon-size);
      }
    }

    .slide-down-enter-from,
    .slide-down-leave-to {
      transform: translateX(-50%) translateY(140%);
      opacity: 0;
    }

    .slide-down-enter-to,
    .slide-down-leave-from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .slide-down-enter-active,
    .slide-down-leave-active {
      transition:
        transform 400ms cubic-bezier(0.2, 0.9, 0.3, 1),
        opacity 100ms ease-out;
    }

    .slide-top-enter-from,
    .slide-top-leave-to {
      transform: translateX(-50%) translateY(-140%);
      opacity: 0;
    }

    .slide-top-enter-to,
    .slide-top-leave-from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .slide-top-enter-active,
    .slide-top-leave-active {
      transition:
        transform 400ms cubic-bezier(0.2, 0.9, 0.3, 1),
        opacity 100ms ease-out;
    }

    div.scroll {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;

      //Faz não aparecer o scroll em nenhum navegador
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: relative;
      &::-webkit-scrollbar {
        display: none;
      }

      div.redirect {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column-reverse;
        gap: 20px;

        div.user-notLogged {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
          width: fit-content; // para centralizar corretamente

          p {
            position: absolute;
            top: 28%; // centraliza verticalmente
            left: 48%; // centraliza horizontalmente
            transform: translate(-50%, -50%);
            color: white;
            font-size: var(--text-xxl);
            margin: 0;
            pointer-events: none;
          }

          svg {
            fill: var(--color-gray-dark); // interior preto
            stroke: var(--color-white); // contorno branco
            stroke-width: 1px; // espessura da borda
            width: calc(var(--icon-size) * 4);
            height: calc(var(--icon-size) * 4);
          }
        }

        a {
          color: var(--color-white);
        }
      }

      div.limit {
        height: calc(var(--component-height) - 20px); //Um pouco menor que os componentes padrões

        width: 100%;
        position: sticky;

        z-index: 5; //Acima do mapa da barra de pesquisa e botão de denúncia, e abaixo da barra de navegação

        //Px negativo pra evitar bug de pixel
        &.top {
          top: -1px;
          background: linear-gradient(to top, rgba(29, 30, 28, 0), rgb(29, 30, 28));
        }
        &.bottom {
          bottom: -1px;
          background: linear-gradient(to bottom, rgba(29, 30, 28, 0), rgb(29, 30, 28));
        }
      }
    }

    a.back {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      text-decoration: none;
      color: var(--color-white);
      position: relative;
      svg {
        width: var(--icon-size);
        height: var(--icon-size);
      }

      h1 {
        font-weight: normal;
        font-size: var(--text-lg);
      }
    }
  }
}

//Adaptação para desktops
@media (min-width: 992px) {
  div.panel {
    height: 80%;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    nav {
      height: clamp(40px, 10%, 70px);

      div.currentRoute {
        position: absolute;
        background-color: var(--color-white);
        z-index: 99;

        height: 100%;
        bottom: 0;

        border-radius: 8px;

        transition:
          left 0.3s ease-in-out,
          width 0.3s ease-in-out;
      }

      ul.options {
        flex-direction: row;
        overflow-y: hidden;
        overflow-x: scroll;
        border-bottom: 2px solid var(--color-white);
        padding-bottom: 10px;
        padding-left: calc(var(--icon-size) / 2);
        gap: 40px;

        li {
          z-index: 100;
          width: auto;
          a {
            gap: 5px;
          }
          &.currentRouteLi {
            a {
              svg {
                color: var(--color-gray-dark);
              }

              p {
                color: var(--color-gray-dark);
              }
            }
          }
        }
      }
    }

    div.route {
      height: 85%;
      gap: 0;
    }
  }
}
</style>
