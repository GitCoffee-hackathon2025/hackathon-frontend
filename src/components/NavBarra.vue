<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rotaAtual = computed(() => route.name || route.path.split('/')[1])
const classeDaRota = (nome: string) => (rotaAtual.value === nome ? 'rotaAtual' : 'rotaEscondida')

const largura = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const atualizarLargura = () => (largura.value = window.innerWidth)
onMounted(() => window.addEventListener('resize', atualizarLargura))
onBeforeUnmount(() => window.removeEventListener('resize', atualizarLargura))

const navExpandida = ref(false)
const expandirNav = () => {
  if (largura.value >= 992) navExpandida.value = true
}
const recolherNav = () => {
  if (largura.value >= 992) navExpandida.value = false
}
</script>

<template>
  <header>
    <nav
      @mouseenter="expandirNav"
      @mouseleave="recolherNav"
      :class="{ navExpandida }"
      role="navigation"
      aria-label="Navegação principal"
      :aria-expanded="navExpandida ? 'true' : 'false'"
      aria-controls="nav-menu-list"
    >
      <ul role="menubar" id="nav-menu-list" aria-label="Menu principal">
        <li tabindex="0" :class="[classeDaRota('configuracoes'), 'configuracoes']" role="none">
          <router-link
            to="/configuracoes"
            role="menuitem"
            :aria-current="rotaAtual === 'configuracoes' ? 'page' : undefined"
            :aria-selected="rotaAtual === 'configuracoes' ? 'true' : 'false'"
            aria-label="Configurações"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
            >
              <path
                d="M8.35323 23L7.89552 19.32C7.6476 19.2242 7.41416 19.1092 7.19522 18.975C6.97629 18.8408 6.76154 18.6971 6.551 18.5437L3.14677 19.9812L0 14.5187L2.94652 12.2762C2.92745 12.1421 2.91791 12.0129 2.91791 11.8887V11.1124C2.91791 10.9875 2.92745 10.8579 2.94652 10.7237L0 8.48125L3.14677 3.01875L6.551 4.45625C6.76078 4.30292 6.9801 4.15917 7.20896 4.025C7.43781 3.89083 7.66667 3.77583 7.89552 3.68L8.35323 0L14.6468 0L15.1045 3.68C15.3524 3.77583 15.5862 3.89083 15.8059 4.025C16.0256 4.15917 16.24 4.30292 16.449 4.45625L19.8532 3.01875L23 8.48125L20.0535 10.7237C20.0726 10.8579 20.0821 10.9875 20.0821 11.1124V11.8875C20.0821 12.0125 20.063 12.1421 20.0249 12.2762L22.9714 14.5187L19.8246 19.9812L16.449 18.5437C16.2392 18.6971 16.0199 18.8408 15.791 18.975C15.5622 19.1092 15.3333 19.2242 15.1045 19.32L14.6468 23H8.35323ZM11.5572 15.525C12.6634 15.525 13.6074 15.1321 14.3893 14.3463C15.1712 13.5604 15.5622 12.6117 15.5622 11.5C15.5622 10.3883 15.1712 9.43958 14.3893 8.65375C13.6074 7.86792 12.6634 7.475 11.5572 7.475C10.432 7.475 9.48302 7.86792 8.71025 8.65375C7.93748 9.43958 7.55148 10.3883 7.55224 11.5C7.553 12.6117 7.93939 13.5604 8.71139 14.3463C9.4834 15.1321 10.432 15.525 11.5572 15.525Z"
              />
            </svg>
            <p>Configurações</p>
          </router-link>
        </li>
        <li tabindex="0" :class="[classeDaRota('usuario'), 'usuario']" role="none">
          <router-link
            to="/usuario"
            role="menuitem"
            :aria-current="rotaAtual === 'usuario' ? 'page' : undefined"
            :aria-selected="rotaAtual === 'usuario' ? 'true' : 'false'"
            aria-label="Usuário"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
            >
              <path
                d="M4.47222 6.325C4.47222 4.64751 5.21265 3.03872 6.53061 1.85255C7.84857 0.666382 9.63612 0 11.5 0C13.3639 0 15.1514 0.666382 16.4694 1.85255C17.7874 3.03872 18.5278 4.64751 18.5278 6.325C18.5278 8.00249 17.7874 9.61128 16.4694 10.7975C15.1514 11.9836 13.3639 12.65 11.5 12.65C9.63612 12.65 7.84857 11.9836 6.53061 10.7975C5.21265 9.61128 4.47222 8.00249 4.47222 6.325ZM0 19.55C0 18.025 0.673113 16.5625 1.87126 15.4841C3.06941 14.4058 4.69445 13.8 6.38889 13.8H16.6111C18.3055 13.8 19.9306 14.4058 21.1287 15.4841C22.3269 16.5625 23 18.025 23 19.55V23H0L0 19.55Z"
              />
            </svg>
            <p>Usuário</p>
          </router-link>
        </li>
        <li tabindex="0" :class="[classeDaRota('mapa-de-denuncias'), 'mapa']" role="none">
          <router-link
            to="/mapa-de-denuncias"
            role="menuitem"
            :aria-current="rotaAtual === 'mapa-de-denuncias' ? 'page' : undefined"
            :aria-selected="rotaAtual === 'mapa-de-denuncias' ? 'true' : 'false'"
            aria-label="Denúncias"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.278555 1.39533C-7.61615e-08 1.94222 0 2.65778 0 4.08889L0 4.87344L22.9872 2.783C22.9629 2.15944 22.8978 1.74289 22.7214 1.39533C22.4764 0.914496 22.0855 0.523561 21.6047 0.278555C21.0578 -7.61615e-08 20.3422 0 18.9111 0L4.08889 0C2.65778 0 1.94222 -7.61615e-08 1.39533 0.278555C0.914496 0.523561 0.523561 0.914496 0.278555 1.39533ZM23 5.34878L16.7836 5.91356L19.9857 22.9936C20.7422 22.977 21.2162 22.9195 21.6047 22.7214C22.0855 22.4764 22.4764 22.0855 22.7214 21.6047C23 21.0578 23 20.3422 23 18.9111V5.34878ZM17.388 23L14.2268 6.14611L0 7.43922L0 18.9111C0 20.3422 -7.61615e-08 21.0578 0.278555 21.6047C0.523561 22.0855 0.914496 22.4764 1.39533 22.7214C1.94222 23 2.65778 23 4.08889 23H17.388ZM12.1389 15.3717C12.1389 18.1291 9.40444 20.0662 8.21228 20.7805C8.04746 20.8794 7.85887 20.9316 7.66667 20.9316C7.47446 20.9316 7.28587 20.8794 7.12106 20.7805C5.92889 20.0662 3.19444 18.1291 3.19444 15.3704C3.19444 12.6653 5.36156 10.8611 7.66667 10.8611C10.0523 10.8611 12.1389 12.6653 12.1389 15.3717Z"
              />
              <path
                d="M7.66547 16.6107C8.37117 16.6107 8.94325 16.0387 8.94325 15.333C8.94325 14.6273 8.37117 14.0552 7.66547 14.0552C6.95978 14.0552 6.3877 14.6273 6.3877 15.333C6.3877 16.0387 6.95978 16.6107 7.66547 16.6107Z"
              />
            </svg>
            <p>Denúncias</p>
          </router-link>
        </li>
        <li tabindex="0" :class="[classeDaRota('sobre-o-site'), 'informacao']" role="none">
          <router-link
            to="/sobre-o-site"
            role="menuitem"
            :aria-current="rotaAtual === 'sobre-o-site' ? 'page' : undefined"
            :aria-selected="rotaAtual === 'sobre-o-site' ? 'true' : 'false'"
            aria-label="Informações"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
            >
              <path
                d="M11.5 0C17.8514 0 23 5.14855 23 11.5C23 17.8514 17.8514 23 11.5 23C5.14855 23 0 17.8514 0 11.5C0 5.14855 5.14855 0 11.5 0ZM11.4885 9.2H10.35C10.0569 9.20033 9.77496 9.31256 9.56183 9.51377C9.34869 9.71499 9.22043 9.99 9.20325 10.2826C9.18607 10.5752 9.28127 10.8633 9.4694 11.0881C9.65753 11.3129 9.92439 11.4573 10.2155 11.492L10.35 11.5V17.2385C10.35 17.8365 10.8031 18.331 11.385 18.3931L11.5115 18.4H12.075C12.3169 18.4 12.5526 18.3238 12.7486 18.1821C12.9446 18.0404 13.091 17.8406 13.1669 17.6109C13.2428 17.3813 13.2444 17.1336 13.1714 16.903C13.0984 16.6724 12.9546 16.4707 12.7604 16.3266L12.65 16.2541V10.3615C12.65 9.7635 12.1969 9.269 11.615 9.2069L11.4885 9.2ZM11.5 5.75C11.195 5.75 10.9025 5.87116 10.6868 6.08683C10.4712 6.30249 10.35 6.595 10.35 6.9C10.35 7.205 10.4712 7.49751 10.6868 7.71317C10.9025 7.92884 11.195 8.05 11.5 8.05C11.805 8.05 12.0975 7.92884 12.3132 7.71317C12.5288 7.49751 12.65 7.205 12.65 6.9C12.65 6.595 12.5288 6.30249 12.3132 6.08683C12.0975 5.87116 11.805 5.75 11.5 5.75Z"
              />
            </svg>
            <p>Informações</p>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  nav {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    height: 65px;
    width: 90vw;
    max-width: 400px;
    background: var(--cinza);
    box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    border-radius: 8px;
    overflow: hidden;
    z-index: 100000000000000;

    ul {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 15px;

      li {
        border-radius: 5px;
        max-width: 24px;
        max-height: 24px;
        display: flex;
        align-items: center;
        padding: 7px;

        &:focus-visible {
          outline: 2px solid var(--branco);
          outline-offset: 3px;
        }
        a {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-decoration: none;
          gap: 0px;
          transition: gap 0.3s ease-in-out;

          svg {
            width: 24px;
            height: 24px;
          }

          p {
            font-size: var(--texto-medio);
            white-space: nowrap;
          }
        }

        &.rotaEscondida {
          a {
            p {
              width: 0;
              opacity: 0;
              pointer-events: none;
              color: var(--branco);
            }
            svg {
              animation: mudaIconeBranco 0.8s forwards ease-in-out;
            }
          }
        }

        &.rotaAtual {
          a {
            gap: 10px;
            transition: gap 0.5s ease-in-out;
            svg {
              animation: mudaIconePreto 0.5s forwards ease-in-out;
            }
            p {
              width: 0;
              animation: textoAparece 1.5s forwards ease-in-out;
              color: var(--cinza);
            }
          }
        }
        &.usuario {
          max-width: 80px;
        }
        &.mapa {
          max-width: 100px;
        }

        &.informacao {
          max-width: 115px;
        }
        &.configuracoes {
          max-width: 125px;
        }
        &.rotaAtual.usuario {
          animation: cresceBarra 0.7s forwards ease-in-out 0.3s;
          max-width: 80px;
        }
        &.rotaAtual.mapa {
          animation: cresceBarra 0.6s forwards ease-in-out 0.3s;
          max-width: 100px;
        }
        &.rotaAtual.informacao {
          animation: cresceBarra 0.5s forwards ease-in-out 0.3s;
          max-width: 115px;
        }
        &.rotaAtual.configuracoes {
          animation: cresceBarra 0.4s forwards ease-in-out 0.3s;
          max-width: 125px;
        }
        &.rotaEscondida.usuario {
          animation: diminuiBarra 0.3s ease-in-out;
        }
        &.rotaEscondida.mapa {
          animation: diminuiBarra 0.2s ease-in-out;
        }
        &.rotaEscondida.informacao {
          animation: diminuiBarra 0.2s ease-in-out;
        }
        &.rotaEscondida.configuracoes {
          animation: diminuiBarra 0.2s ease-in-out;
        }
      }
    }
  }
}

@keyframes mudaIconePreto {
  0% {
    fill: var(--branco);
    opacity: 1;
  }
  25% {
    fill: var(--branco);
    opacity: 0.5;
  }
  50% {
    fill: var(--cinza);
    opacity: 0;
  }
  75% {
    opacity: 0.5;
    fill: var(--cinza);
  }
  100% {
    opacity: 1;
    fill: var(--cinza);
  }
}
@keyframes mudaIconeBranco {
  0% {
    fill: var(--cinza);
    opacity: 1;
  }
  25% {
    fill: var(--cinza);
    opacity: 0.5;
  }
  50% {
    fill: var(--branco);
    opacity: 0;
  }
  75% {
    opacity: 0.5;
    fill: var(--branco);
  }
  100% {
    opacity: 1;
    fill: var(--branco);
  }
}
@keyframes cresceBarra {
  0% {
    width: 32px;
    height: 32px;
  }
  100% {
    width: 250px;
    height: 32px;
    background-color: var(--branco);
  }
}
@keyframes diminuiBarra {
  0% {
    background-color: var(--branco);
    width: 250px;
    height: 32px;
  }
  100% {
    width: 32px;
    height: 32px;
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

@media (min-width: 576px) {
  header {
    nav {
      max-width: 500px;
      height: 70px;
      ul {
        padding: 0 20px;
        li {
          padding: 12px;
          a {
            p {
              font-size: var(--texto-grande);
            }
            svg {
              width: 28px;
              height: 28px;
            }
          }

          &.configuracoes {
            max-width: 155px;
          }
          &.usuario {
            max-width: 100px;
          }
          &.informacao {
            max-width: 140px;
          }
          &.mapa {
            max-width: 125px;
          }
          &.rotaAtual.configuracoes {
            max-width: 155px;
          }
          &.rotaAtual.usuario {
            max-width: 100px;
          }
          &.rotaAtual.mapa {
            max-width: 125px;
          }
          &.rotaAtual.informacao {
            max-width: 140px;
          }
        }
      }
    }
  }
}

@media (min-width: 768px) {
  header nav {
    max-width: 620px;
    height: 75px;
    ul li {
      max-width: 32x;
      max-height: 32px;
      padding: 10px 12px;
      a {
        p {
          font-size: var(--texto-extragrande);
        }
        svg {
          width: 24px;
          height: 24px;
        }
      }

      &.rotaAtual {
        a {
          gap: 15px;
        }
      }
      &.configuracoes {
        max-width: 185px;
      }
      &.usuario {
        max-width: 120px;
      }
      &.informacao {
        max-width: 165px;
      }
      &.mapa {
        max-width: 150px;
      }
      &.rotaAtual.configuracoes {
        max-width: 185px;
      }
      &.rotaAtual.usuario {
        max-width: 120px;
      }
      &.rotaAtual.mapa {
        max-width: 150px;
      }
      &.rotaAtual.informacao {
        max-width: 165px;
      }
    }
  }
}

@media (min-width: 992px) {
  header {
    nav {
      position: fixed;
      bottom: 50%;
      left: 30px;
      transform: translateY(50%);
      width: 70px;
      height: 94vh;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: width 0.3s ease-in-out;

      ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 20px calc(35px - 12.5px - 7px);
        gap: 20px;
        box-sizing: border-box;
        li {
          padding: 7px;
          max-width: 10px;
          max-height: 24px;
          a {
            p {
              font-size: var(--texto-medio);
            }
            svg {
              width: 24px;
              height: 24px;
            }
          }
          &.informacao {
            margin: auto 0 0;
          }
          &.configuracoes,
          &.usuario,
          &.informacao,
          &.mapa,
          &.rotaAtual.configuracoes,
          &.rotaAtual.usuario,
          &.rotaAtual.mapa,
          &.rotaAtual.informacao {
            max-width: 24px;
            transition: max-width 0.3s ease-in-out;
          }
          &.rotaAtual {
            a {
              gap: 10px;
              p {
                opacity: 0;
                width: 0;
                pointer-events: none;
                animation:
                  textoAparece 0s,
                  mudaTextoPreto 0s;
              }
            }
          }

          &.rotaEscondida {
            a {
              gap: 10px;
              p {
                opacity: 0;
                width: 0;
                pointer-events: none;
                animation: mudaTextoBranco 0s;
              }
            }
          }
        }
      }
      &.navExpandida {
        width: 230px;
        transition: width 0.3s ease-in-out;

        ul {
          li {
            a {
              gap: 10px;
              transition: gap 0s;
              p {
                font-size: var(--texto-medio);
                color: var(--branco);
              }
            }
            &.informacao {
              margin: auto 0 0;
            }
            &.rotaAtual.usuario {
              max-width: 80px;
            }
            &.rotaAtual.mapa {
              max-width: 100px;
            }

            &.rotaAtual.informacao {
              max-width: 115px;
            }
            &.rotaAtual.configuracoes {
              max-width: 125px;
            }
            &.rotaAtual {
              gap: 10px;
              transition: max-width 0.3s ease-in-out;
              a {
                p {
                  animation: mudaTextoPreto 0.5s forwards ease-in-out;
                  opacity: 1;
                  pointer-events: all;
                }
              }
            }

            &.rotaEscondida {
              a {
                gap: 10px;
                p {
                  animation: mudaTextoBranco 0.8s forwards ease-in-out;
                  opacity: 1;
                  pointer-events: all;
                }
              }
            }
          }
        }
      }
    }
  }
}
@keyframes mudaTextoBranco {
  0% {
    color: var(--cinza);
    opacity: 1;
  }
  25% {
    color: var(--cinza);
    opacity: 0.5;
  }
  50% {
    opacity: 0;
    color: var(--branco);
  }
  75% {
    opacity: 0.5;
    color: var(--branco);
  }
  100% {
    opacity: 1;
    color: var(--branco);
  }
}

@keyframes mudaTextoPreto {
  0% {
    color: var(--branco);
    opacity: 1;
  }
  25% {
    opacity: 0.5;
    color: var(--branco);
  }
  50% {
    opacity: 0;
    color: var(--cinza);
  }
  75% {
    opacity: 0.5;
    color: var(--cinza);
  }
  100% {
    opacity: 1;
    color: var(--cinza);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rotaAtual,
  .rotaEscondida,
  .navExpandida,
  .navExpandida ul li a p {
    animation: none !important;
    transition: none !important;
  }
}
</style>
