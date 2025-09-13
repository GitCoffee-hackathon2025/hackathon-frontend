<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, reactive, nextTick } from 'vue'
import { useRoute } from 'vue-router'

//Atualiza dinâmcamente a rota
const routeInfo = useRoute()
//Ajuda o v-for ser renderizado sempre que a rota mudar por conta da função classeDaRota
const currentRoutel = computed(() => routeInfo.path.split('/')[1] || '')

//Atualiza a classe do item quando a rota muda
const routeClass = (nome: string) =>
  currentRoutel.value === nome ? 'current-route' : 'hidden-route'

//Atualizar os componentes quando a tela redimensionar durante o uso do site
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

//Variável id para poder cancelar os settimeout
let resizeTimer: number | null = null

//Atualiza a largura da tela
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth

  //Se settimeout já estiver em funcionamento, ele cancela
  if (resizeTimer) {
    window.clearTimeout(resizeTimer)
  }
  //e inicia outro settimeoout para atualizar o tamanho dos p's
  resizeTimer = window.setTimeout(() => {
    updateBackgroundPWidth()

    //Reseta a vaiável de id do settimeout para poder criar outro settimeout quando a tela redimensionar novamente
    resizeTimer = null
  }, 100)
}

const navExpand = ref(false)
//Expande e recolhe a nav se for uma tela maior ou igual que 992px (desktop)
const expandNav = () => {
  if (windowWidth.value >= 992) navExpand.value = true
}
const collapseNav = () => {
  if (windowWidth.value >= 992) navExpand.value = false
}

//Elementos p de cada item
const refs = reactive<Record<string, HTMLElement | null>>({})
const widthBackgroundP = reactive<Record<string, string>>({})

const varNameBackgroundP = (defaultNavItem: string) => `--size-${defaultNavItem}`

const updateBackgroundPWidth = () => {
  //Sincroniza o DOM com a atualização dos tamanhos dos p's, os p's são atualizados antes do último frame do naveggador atualizar
  requestAnimationFrame(() => {
    //Atualiza cada tamanho no objeto reativo tamanhos
    for (const key in refs) {
      const el = refs[key]
      if (el) {
        const value = `${el.scrollWidth}px`
        widthBackgroundP[key] = value
        document.documentElement.style.setProperty(
          varNameBackgroundP(key === 'info' ? 'information' : key),
          value,
        )
      } else {
        // fallback seguro
        const fallback = '0px'
        widthBackgroundP[key] = fallback
        document.documentElement.style.setProperty(
          varNameBackgroundP(key === 'info' ? 'information' : key),
          fallback,
        )
      }
    }
  })
}

//Executa sempre o componente é montado
onMounted(async () => {
  //Espera todo o DOM ser atualizado para calcular os tamanhos
  await nextTick()

  //Logo que o DOM é atualizado, os tamanhos dos p's são calculados
  updateBackgroundPWidth()

  //Listener permanece ativo enquanto o componente é montado, esse listener escuta um redimensionamento da tela e atualiza a variável 'largura' que mede a largura da tela com a função atualizarLargura
  window.addEventListener('resize', updateWindowWidth, { passive: true })
})

//Executa sempre o componente é desmontado
onBeforeUnmount(() => {
  //Listener é removido quando o componente é desmontado
  window.removeEventListener('resize', updateWindowWidth)

  //Se for desmontado enquanto estava acontecendo um settimeout ele cancela e anula a variável de id do settiemout
  if (resizeTimer) {
    window.clearTimeout(resizeTimer)
    resizeTimer = null
  }
})

type navItem = {
  link: string
  icon: string
  text: string
  default: string
  refKey: string
}

//Esses dois tipos são a mesma coisa kkkkkk, é um array com as opcões de página da nav
const navItemArray: navItem[] | Array<navItem> = [
  {
    link: 'configuracoes',
    icon: `<path d="M8.35323 23L7.89552 19.32C7.6476 19.2242 7.41416 19.1092 7.19522 18.975C6.97629 18.8408 6.76154 18.6971 6.551 18.5437L3.14677 19.9812L0 14.5187L2.94652 12.2762C2.92745 12.1421 2.91791 12.0129 2.91791 11.8887V11.1124C2.91791 10.9875 2.92745 10.8579 2.94652 10.7237L0 8.48125L3.14677 3.01875L6.551 4.45625C6.76078 4.30292 6.9801 4.15917 7.20896 4.025C7.43781 3.89083 7.66667 3.77583 7.89552 3.68L8.35323 0L14.6468 0L15.1045 3.68C15.3524 3.77583 15.5862 3.89083 15.8059 4.025C16.0256 4.15917 16.24 4.30292 16.449 4.45625L19.8532 3.01875L23 8.48125L20.0535 10.7237C20.0726 10.8579 20.0821 10.9875 20.0821 11.1124V11.8875C20.0821 12.0125 20.063 12.1421 20.0249 12.2762L22.9714 14.5187L19.8246 19.9812L16.449 18.5437C16.2392 18.6971 16.0199 18.8408 15.791 18.975C15.5622 19.1092 15.3333 19.2242 15.1045 19.32L14.6468 23H8.35323ZM11.5572 15.525C12.6634 15.525 13.6074 15.1321 14.3893 14.3463C15.1712 13.5604 15.5622 12.6117 15.5622 11.5C15.5622 10.3883 15.1712 9.43958 14.3893 8.65375C13.6074 7.86792 12.6634 7.475 11.5572 7.475C10.432 7.475 9.48302 7.86792 8.71025 8.65375C7.93748 9.43958 7.55148 10.3883 7.55224 11.5C7.553 12.6117 7.93939 13.5604 8.71139 14.3463C9.4834 15.1321 10.432 15.525 11.5572 15.525Z" />`,
    text: 'Configurações',
    default: 'settings',
    refKey: 'config',
  },
  {
    link: 'usuario',
    icon: `<path d="M4.47222 6.325C4.47222 4.64751 5.21265 3.03872 6.53061 1.85255C7.84857 0.666382 9.63612 0 11.5 0C13.3639 0 15.1514 0.666382 16.4694 1.85255C17.7874 3.03872 18.5278 4.64751 18.5278 6.325C18.5278 8.00249 17.7874 9.61128 16.4694 10.7975C15.1514 11.9836 13.3639 12.65 11.5 12.65C9.63612 12.65 7.84857 11.9836 6.53061 10.7975C5.21265 9.61128 4.47222 8.00249 4.47222 6.325ZM0 19.55C0 18.025 0.673113 16.5625 1.87126 15.4841C3.06941 14.4058 4.69445 13.8 6.38889 13.8H16.6111C18.3055 13.8 19.9306 14.4058 21.1287 15.4841C22.3269 16.5625 23 18.025 23 19.55V23H0L0 19.55Z" />`,
    text: 'Usuário',
    default: 'user',
    refKey: 'usuario',
  },
  {
    link: 'mapa-de-denuncias',
    icon: `<path fill-rule="evenodd" clip-rule="evenodd" d="M0.278555 1.39533C-7.61615e-08 1.94222 0 2.65778 0 4.08889L0 4.87344L22.9872 2.783C22.9629 2.15944 22.8978 1.74289 22.7214 1.39533C22.4764 0.914496 22.0855 0.523561 21.6047 0.278555C21.0578 -7.61615e-08 20.3422 0 18.9111 0L4.08889 0C2.65778 0 1.94222 -7.61615e-08 1.39533 0.278555C0.914496 0.523561 0.523561 0.914496 0.278555 1.39533ZM23 5.34878L16.7836 5.91356L19.9857 22.9936C20.7422 22.977 21.2162 22.9195 21.6047 22.7214C22.0855 22.4764 22.4764 22.0855 22.7214 21.6047C23 21.0578 23 20.3422 23 18.9111V5.34878ZM17.388 23L14.2268 6.14611L0 7.43922L0 18.9111C0 20.3422 -7.61615e-08 21.0578 0.278555 21.6047C0.523561 22.0855 0.914496 22.4764 1.39533 22.7214C1.94222 23 2.65778 23 4.08889 23H17.388ZM12.1389 15.3717C12.1389 18.1291 9.40444 20.0662 8.21228 20.7805C8.04746 20.8794 7.85887 20.9316 7.66667 20.9316C7.47446 20.9316 7.28587 20.8794 7.12106 20.7805C5.92889 20.0662 3.19444 18.1291 3.19444 15.3704C3.19444 12.6653 5.36156 10.8611 7.66667 10.8611C10.0523 10.8611 12.1389 12.6653 12.1389 15.3717Z"/><path d="M7.66547 16.6107C8.37117 16.6107 8.94325 16.0387 8.94325 15.333C8.94325 14.6273 8.37117 14.0552 7.66547 14.0552C6.95978 14.0552 6.3877 14.6273 6.3877 15.333C6.3877 16.0387 6.95978 16.6107 7.66547 16.6107Z" />`,
    text: 'Denúncias',
    default: 'map',
    refKey: 'mapa',
  },
  {
    link: 'sobre-o-site',
    icon: `<path d="M11.5 0C17.8514 0 23 5.14855 23 11.5C23 17.8514 17.8514 23 11.5 23C5.14855 23 0 17.8514 0 11.5C0 5.14855 5.14855 0 11.5 0ZM11.4885 9.2H10.35C10.0569 9.20033 9.77496 9.31256 9.56183 9.51377C9.34869 9.71499 9.22043 9.99 9.20325 10.2826C9.18607 10.5752 9.28127 10.8633 9.4694 11.0881C9.65753 11.3129 9.92439 11.4573 10.2155 11.492L10.35 11.5V17.2385C10.35 17.8365 10.8031 18.331 11.385 18.3931L11.5115 18.4H12.075C12.3169 18.4 12.5526 18.3238 12.7486 18.1821C12.9446 18.0404 13.091 17.8406 13.1669 17.6109C13.2428 17.3813 13.2444 17.1336 13.1714 16.903C13.0984 16.6724 12.9546 16.4707 12.7604 16.3266L12.65 16.2541V10.3615C12.65 9.7635 12.1969 9.269 11.615 9.2069L11.4885 9.2ZM11.5 5.75C11.195 5.75 10.9025 5.87116 10.6868 6.08683C10.4712 6.30249 10.35 6.595 10.35 6.9C10.35 7.205 10.4712 7.49751 10.6868 7.71317C10.9025 7.92884 11.195 8.05 11.5 8.05C11.805 8.05 12.0975 7.92884 12.3132 7.71317C12.5288 7.49751 12.65 7.205 12.65 6.9C12.65 6.595 12.5288 6.30249 12.3132 6.08683C12.0975 5.87116 11.805 5.75 11.5 5.75Z" />`,
    text: 'Informações',
    default: 'information',
    refKey: 'info',
  },
]
</script>

<template>
  <header>
    <nav :class="{ 'nav-expanded': navExpand }" @mouseenter="expandNav" @mouseleave="collapseNav">
      <ul>
        <li
          v-for="(navItem, index) in navItemArray"
          :key="index"
          :class="[routeClass(navItem.link), navItem.default]"
          :style="{
            [varNameBackgroundP(navItem.default)]: widthBackgroundP[navItem.refKey] ?? '0px',
          }"
        >
          <router-link :to="'/' + navItem.link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 23"
              fill="none"
              v-html="navItem.icon"
            ></svg>
            <!-- Coloca cada p renderizado pelo for, como um valor de uma chave no objeto reativo refs, usando opcao.refKey para dar nome a essa chave -->
            <p :ref="(el) => (refs[navItem.refKey] = el as HTMLElement | null)">
              {{ navItem.text }}
            </p>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
/* --- Variáveis SCSS para valores repetidos / estáticos --- */
$bottom-mobile: 25px;
$left-desktop: 30px;
$nav-padding-horizontal: 12px;

$border-radius: 8px;
$box-shadow: 0 0 7px 0 var(--shadow-default);

$li-padding-mobile: 5px;
$li-padding-tablet: 10px;
$li-padding-desktop: 8px;

$gap-current-route-mobile: 8px;

$anim-medium: 0.3s;
$anim-long: 0.5s;
$anim-texto: 1.5s;

$nav-width-collapsed: 70px;
$nav-width-expanded: 230px;

$navbar-collapsed-width: 50px;
$navbar-expanded-width: 250px;

$icon-size: var(--icon-size);

$size-user: var(--size-user);
$size-map: var(--size-map);
$size-info: var(--size-information);
$size-config: var(--size-settings);

/* --- Estilos (preservando as CSS custom properties já usadas no teu componente) --- */
header {
  nav {
    position: fixed;
    bottom: $bottom-mobile;
    left: 50%;
    transform: translateX(-50%);

    height: var(--component-height);
    width: var(--component-width);
    padding: 0 $nav-padding-horizontal;
    box-sizing: border-box;

    background: var(--color-gray-dark);
    box-shadow: $box-shadow;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: $border-radius;
    overflow: hidden;
    z-index: 6;

    font-size: var(--text-sm);

    ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;

      li {
        border-radius: 5px;
        max-width: $icon-size;
        max-height: $icon-size;
        display: flex;
        align-items: center;
        padding: $li-padding-mobile;

        a {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-decoration: none;
          gap: 0;
          transition: gap $anim-medium ease-in-out;

          svg {
            width: $icon-size;
            height: $icon-size;
          }

          p {
            white-space: nowrap;
            transition: width $anim-medium;
          }
        }

        &.hidden-route {
          a {
            p {
              width: 0;
              opacity: 0;
              pointer-events: none;
              color: var(--color-white);
            }
            svg {
              animation: changeWhiteIcon 0.8s forwards ease-in-out;
            }
          }
        }

        &.current-route {
          a {
            gap: $gap-current-route-mobile;
            transition: gap $anim-medium ease-in-out;
            svg {
              animation: changeGrayDarkIcon $anim-long forwards ease-in-out;
            }
            p {
              width: 0;
              animation: textoAparece $anim-texto forwards ease-in-out;
              color: var(--color-gray-dark);
            }
          }
        }

        &.user {
          max-width: calc($size-user + $icon-size + 8px + 5px);
        }
        &.map {
          max-width: calc($size-map + $icon-size + 8px + 5px);
        }
        &.information {
          max-width: calc($size-info + $icon-size + 8px + 5px);
        }
        &.settings {
          max-width: calc($size-config + $icon-size + 8px + 5px);
        }

        &.current-route.user {
          animation: increasesBar 0.7s forwards ease-in-out 0.3s;
          max-width: calc($size-user + $icon-size + 8px + 5px);
        }
        &.current-route.map {
          animation: increasesBar 0.6s forwards ease-in-out 0.3s;
        }
        &.current-route.information {
          animation: increasesBar 0.5s forwards ease-in-out 0.3s;
        }
        &.current-route.settings {
          animation: increasesBar 0.4s forwards ease-in-out 0.3s;
        }

        &.hidden-route.user {
          animation: decreasesBar 0.3s ease-in-out;
        }
        &.hidden-route.map,
        &.hidden-route.information,
        &.hidden-route.settings {
          animation: decreasesBar 0.2s ease-in-out;
        }
      } /* li */
    } /* ul */
  } /* nav */
} /* header */

/* Keyframes (mesma lógica que o original) */
@keyframes changeGrayDarkIcon {
  0% {
    fill: var(--color-white);
    opacity: 1;
  }
  25% {
    fill: var(--color-white);
    opacity: 0.5;
  }
  50% {
    fill: var(--color-gray-dark);
    opacity: 0;
  }
  75% {
    opacity: 0.5;
    fill: var(--color-gray-dark);
  }
  100% {
    opacity: 1;
    fill: var(--color-gray-dark);
  }
}
@keyframes changeWhiteIcon {
  0% {
    fill: var(--color-gray-dark);
    opacity: 1;
  }
  25% {
    fill: var(--color-gray-dark);
    opacity: 0.5;
  }
  50% {
    opacity: 0;
    fill: var(--color-white);
  }
  75% {
    opacity: 0.5;
    fill: var(--color-white);
  }
  100% {
    opacity: 1;
    fill: var(--color-white);
  }
}
@keyframes increasesBar {
  0% {
    width: $navbar-collapsed-width;
    height: $icon-size;
  }
  100% {
    width: $navbar-expanded-width;
    height: $icon-size;
    background-color: var(--color-white);
  }
}
@keyframes decreasesBar {
  0% {
    background-color: var(--color-white);
    width: $navbar-expanded-width;
    height: $icon-size;
  }
  100% {
    width: $navbar-collapsed-width;
    height: $icon-size;
  }
}
@keyframes textoAparece {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* MEDIA QUERIES */
@media (min-width: 576px) {
  header nav ul li {
    padding: $li-padding-tablet;
  }
}

@media (min-width: 992px) {
  header {
    nav {
      position: fixed;
      bottom: 50%;
      left: $left-desktop;
      transform: translateY(50%);

      width: $nav-width-collapsed;
      height: 94vh;
      padding: 20px calc(35px - ($icon-size / 2) - 8px);
      box-sizing: border-box;

      transition: width $anim-medium ease-in-out;

      ul {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 20px;

        li {
          padding: $li-padding-desktop;

          //Joga o ícone de informação pra baixo da nav
          &.information {
            margin: auto 0 0 0;
          }
          a {
            gap: $gap-current-route-mobile;
          }

          &.settings,
          &.user,
          &.information,
          &.map,
          &.current-route.settings,
          &.current-route.user,
          &.current-route.map,
          &.current-route.information {
            max-width: $icon-size;
            max-height: $icon-size;
            transition: max-width 0.3s ease-in-out;
          }

          &.current-route {
            a {
              p {
                opacity: 0;
                color: var(--color-white);
                width: 0;
                pointer-events: none;
                animation:
                  textoAparece 0s,
                  changeGrayDarkText 0s;
              }
            }
          }

          &.hidden-route {
            a {
              p {
                opacity: 0;
                width: 0;
                pointer-events: none;
                animation: changeWhiteText 0s;
              }
            }
          }
        }
      }

      /* --- navExpandida: EXCLUSIVAMENTE dentro do breakpoint desktop --- */
      &.nav-expanded {
        width: $nav-width-expanded;
        transition: width $anim-medium ease-in-out;

        ul {
          li {
            &.current-route.user {
              max-width: calc($size-user + $icon-size + 8px + 5px);
            }
            &.current-route.map {
              max-width: calc($size-map + $icon-size + 8px + 5px);
            }
            &.current-route.information {
              max-width: calc($size-info + $icon-size + 8px + 5px);
            }
            &.current-route.settings {
              max-width: calc($size-config + $icon-size + 8px + 5px);
            }

            &.current-route {
              transition: max-width $anim-medium ease-in-out;
              a {
                p {
                  animation: changeGrayDarkText 0.5s ease-in-out;
                  opacity: 1;
                  color: var(--color-gray-dark);
                  pointer-events: all;
                }
              }
            }

            &.hidden-route {
              a {
                p {
                  animation: changeWhiteText 0.8s ease-in-out;
                  opacity: 1;
                  pointer-events: all;
                }
              }
            }
          } /* li */
        } /* ul */
      } /* &.nav-expanded (desktop) */
    } /* nav */
  }
} /* media 992 */

@keyframes changeWhiteText {
  0% {
    color: var(--color-gray-dark);
    opacity: 1;
  }
  25% {
    color: var(--color-gray-dark);
    opacity: 0.5;
  }
  50% {
    opacity: 0;
    color: var(--color-white);
  }
  75% {
    opacity: 0.5;
    color: var(--color-white);
  }
  100% {
    opacity: 1;
    color: var(--color-white);
  }
}
@keyframes changeGrayDarkText {
  0% {
    color: var(--color-white);
    opacity: 1;
  }
  25% {
    opacity: 0.5;
    color: var(--color-white);
  }
  50% {
    opacity: 0;
    color: var(--color-gray-dark);
  }
  75% {
    opacity: 0.5;
    color: var(--color-gray-dark);
  }
  100% {
    opacity: 1;
    color: var(--color-gray-dark);
  }
}
</style>
