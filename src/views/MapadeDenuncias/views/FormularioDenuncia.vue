<script setup lang="ts">
import { useReportStore } from "@/store/report"

const store = useReportStore()

function enviar() {
  console.log({
    local: store.reportLocal,
    tipo: store.reportType,
    data: store.reportDate,
    conteudo: store.reportContent,
  })
}
</script>

<template>
  <form @submit.prevent="enviar">
    <router-link to="">
      <!-- SVG de voltar -->
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="21" viewBox="0 0 35 21" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.27812 10.2101L10.5875 14.4613..." />
      </svg>
    </router-link>

    <div class="entradas">
      <!-- Local -->
      <div class="local campo">
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="30" viewBox="0 0 27 30" fill="none">
          <path d="M13.4506 18.0004C16.9251..." />
          <path d="M12.5366 29.7219C12.8034..." />
        </svg>
        <input type="text" placeholder="Digite o local" v-model="store.reportLocal" />
      </div>

      <!-- Tipo -->
      <div class="tipo-denuncia campo">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="32" viewBox="0 0 36 32" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.993 2.55819C15.7409..." />
        </svg>
        <select v-model="store.reportType">
          <option value="" disabled selected>Escolha um crime</option>
          <option value="Acidente de trânsito">Acidente de trânsito</option>
          <option value="Assalto">Assalto</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <!-- Data -->
      <div class="dia-hora campo">
        <label>Data:</label>
        <div class="escolher-dia-hora">
          <input type="date" v-model="store.reportDate" />
        </div>
      </div>

      <!-- Descrição -->
      <div class="descricao">
        <label>Descrição:</label>
        <textarea v-model="store.reportContent"></textarea>
      </div>

      <p>Texto erro</p>
      <button type="submit">Enviar</button>
    </div>
  </form>
</template>
<style scoped
  lang="scss">
  form {
    background-color: var(--cinza);
    height: 100vh;
    min-height: 580px;
    width: 100vw;

    .entradas {
      width: 100%;
      min-height: 580px;
      display: grid;
      grid-template-columns: repeat(30, 1fr);
      grid-template-rows: repeat(30, 1fr);

      .local {
        grid-row: 3 / 7;
        grid-column: 1 / 31;
        height: var(--altura-componentes);
        width: var(--largura-componentes);
        justify-self: center;
        align-self: center;
        border: none;

        svg {
          fill: var(--cinza);
        }
      }

      .tipo-denuncia {
        grid-row: 6 / 11;
        grid-column: 1 / 31;
        width: var(--largura-componentes);
        height: var(--altura-componentes);
        justify-self: center;
        align-self: center;
        border: none;

        svg {
          fill: var(--cinza);
        }
      }

      .dia-hora {
        grid-row: 9 / 15;
        grid-column: 1 / 31;
        width: var(--largura-componentes);
        justify-self: center;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 5px;

        label {
          align-self: baseline;
        }

        .escolher-dia-hora {
          width: var(--largura-componentes);
          height: var(--altura-componentes);
          justify-self: center;
          align-self: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 5px;

          select,
          input {
            width: 30%;
            height: var(--altura-componentes);
            border: none;
            padding: 0;
            border-radius: 8px;
          }

          input[type='time'] {
            font-size: var(--texto-m);
            text-align: center;
            border-radius: 8px;
            -webkit-appearance: none;
            -moz-appearance: textfield;
            appearance: none;
          }

          select {
            background: var(--cinza-claro);
            color: var(--cinza);
            padding: 0 1rem;
            font-size: var(--texto-m);
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="%23999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: calc(var(--tamanho-icones) - 2.5vw);
          }
        }
      }

      .descricao {
        grid-row: 15 / 22;
        grid-column: 1 / 31;
        width: var(--largura-componentes);
        justify-self: center;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 5px;

        textarea {
          width: var(--largura-componentes);
          height: calc(var(--altura-componentes) * 1.9);
          justify-self: center;
          align-self: center;
          border: none;
          resize: none;
          white-space: wrap;
          background-color: var(--branco);
          color: var(--cinza);
          border-radius: 8px;
          outline: none;
          padding: 8px;
          box-sizing: border-box;
          font-size: var(--texto-m);
        }
      }

      p {
        background-color: var(--branco);
        grid-row: 20 / 27;
        grid-column: 1 / 31;
        width: var(--largura-componentes);
        height: calc(var(--altura-componentes) / 1.5);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        font-size: var(--texto-p);
        justify-self: center;
        align-self: center;
        color: var(--vermelho);
      }

      button {
        grid-row: 26 / 30;
        grid-column: 1 / 31;
        width: var(--largura-componentes);
        height: var(--altura-componentes);
        justify-self: center;
        align-self: center;
        border: none;
        background-color: var(--branco);
        color: var(--cinza);
        border-radius: 8px;
        font-size: var(--texto-m);
      }
    }

    a {
      svg {
        fill: var(--branco);
        position: fixed;
        top: 5px;
        left: 10px;
        width: var(--tamanho-icones);
        height: var(--tamanho-icones);
      }
    }
  }

  @media (min-width: 576px) {
    form {
      min-height: 900px;

      div.entradas {
        min-height: 900px;
      }
    }
  }
</style>
