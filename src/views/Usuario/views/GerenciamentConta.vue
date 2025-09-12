<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { perfil, informacoes, acoes } from '@/views/Usuario/assets/ItensGerenciamentoConta'

//Calcular o viewbox de cada svg
onMounted(async () => {
  await nextTick()
  const svgs = document.querySelectorAll('svg')

  window.addEventListener('resize', () => viewBoxSvg(svgs))

  viewBoxSvg(svgs)

  function viewBoxSvg(svgs: never[] | NodeListOf<SVGSVGElement>) {
    svgs.forEach((svg) => {
      const path = svg.querySelector('path')
      if (path) {
        const box = (path as SVGGraphicsElement).getBBox()
        svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`)
      }
    })
  }
})
///////Não esquecer de apagar cada viewbox do site e usar essa função 👆

const inputEdicaoAberta = ref<string>()

function editarInput(refKey: string) {
  inputEdicaoAberta.value = refKey
  console.log(inputEdicaoAberta.value)
}

function edicaoAberta(refKey: string) {
  return !(inputEdicaoAberta.value == refKey) ? true : false
}

function cancelarEditacao(refKey: string) {
  if (inputEdicaoAberta.value == refKey) inputEdicaoAberta.value = ''
}
</script>

<template>
  <div class="conta">
    <div class="perfil">
      <h2>Perfil</h2>
      <div class="itens">
        <div class="item" v-for="(item, index) in perfil" :key="index">
          <div :class="['campo', { 'edicao-aberta': !edicaoAberta(item.refKey) }]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              v-html="item.icone"
            ></svg>
            <input type="text" v-model="item.userInfo" :disabled="edicaoAberta(item.refKey)" />
            <svg
              v-if="edicaoAberta(item.refKey)"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              class="vizualisar"
              @click="editarInput(item.refKey)"
            >
              <path
                d="M23.0951 5.79467C22.6652 6.22014 22.2479 6.63309 22.2353 7.04605C22.1973 7.44649 22.6273 7.85945 23.0319 8.24738C23.6388 8.87307 24.2331 9.43619 24.2079 10.0494C24.1826 10.6625 23.5377 11.3007 22.8928 11.9264L17.6705 17.1072L15.8749 15.3302L21.249 10.0243L20.0351 8.82301L18.2395 10.5875L13.4977 5.89478L18.3533 1.10199C18.8465 0.613952 19.6684 0.613952 20.1362 1.10199L23.0951 4.03022C23.5883 4.49323 23.5883 5.30663 23.0951 5.79467ZM0.701172 18.5713L12.7896 6.59555L17.5314 11.2882L5.44297 23.2639H0.701172V18.5713Z"
              />
            </svg>
          </div>
          <div class="botoes-alterar" v-if="!edicaoAberta(item.refKey)">
            <button @click="cancelarEditacao(item.refKey)">Cancelar</button><button>Salvar</button>
          </div>
        </div>
      </div>
    </div>
    <div class="informacoes">
      <h2>Informações</h2>
      <div class="itens">
        <div class="item" v-for="(item, index) in informacoes" :key="index">
          <div :class="['campo', { 'edicao-aberta': !edicaoAberta(item.refKey) }]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              v-html="item.icone"
            ></svg>
            <input type="text" v-model="item.userInfo" :disabled="edicaoAberta(item.refKey)" />
            <svg
              v-if="edicaoAberta(item.refKey)"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              class="vizualisar"
              @click="editarInput(item.refKey)"
            >
              <path
                d="M23.0951 5.79467C22.6652 6.22014 22.2479 6.63309 22.2353 7.04605C22.1973 7.44649 22.6273 7.85945 23.0319 8.24738C23.6388 8.87307 24.2331 9.43619 24.2079 10.0494C24.1826 10.6625 23.5377 11.3007 22.8928 11.9264L17.6705 17.1072L15.8749 15.3302L21.249 10.0243L20.0351 8.82301L18.2395 10.5875L13.4977 5.89478L18.3533 1.10199C18.8465 0.613952 19.6684 0.613952 20.1362 1.10199L23.0951 4.03022C23.5883 4.49323 23.5883 5.30663 23.0951 5.79467ZM0.701172 18.5713L12.7896 6.59555L17.5314 11.2882L5.44297 23.2639H0.701172V18.5713Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="acoes">
      <h2>Ações</h2>
      <div class="itens">
        <div class="item" v-for="(item, index) in acoes" :key="index">
          <div class="campo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              v-html="item.icone"
            ></svg>
            <input type="text" v-model="item.userInfo" :disabled="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/inputs.scss';

div.conta {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 40px;
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;

    h2 {
      font-size: var(--texto-g);
      font-weight: normal;
    }

    div.itens {
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 10px;

      div.item {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        gap: 5px;

        div.botoes-alterar {
          width: 50%;
          height: var(--altura-componentes);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          button {
            cursor: pointer;
            width: 45%;
            height: 100%;
            border: none;
            border-radius: 8px;

            &:first-child {
              background-color: var(--vermelho);
            }
            &:last-child {
              background-color: var(--verde);
            }
          }
        }
        .campo {
          width: 100%;
          border-radius: 8px;

          svg {
            fill: var(--branco);
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 1rem;
            width: var(--tamanho-icones);
            height: var(--tamanho-icones);

            &.vizualisar {
              left: auto;
              right: 1rem;
              cursor: pointer;
            }
          }

          input,
          select {
            color: var(--branco);
            box-sizing: border-box;
            background-color: var(--cinza-input);

            &::placeholder {
              color: var(--branco);
            }
          }
          &.edicao-aberta {
            input,
            select {
              color: var(--cinza);
              box-sizing: border-box;
              background-color: var(--branco);

              &::placeholder {
                color: var(--cinza);
              }
            }

            svg {
              fill: var(--cinza);
            }
          }
        }
      }
    }
  }

  div.acoes {
    div {
      div.item {
        &:first-child {
          div.campo {
            input {
              background-color: var(--verde);
            }
          }
        }
        &:nth-child(2) {
          div.campo {
            input {
              background-color: var(--vermelho);
            }
          }
        }
        div.campo {
          input {
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>
