<script setup lang="ts">
import { ref } from 'vue'
import { useReportStore } from '@/requisitions/Ocurrences'

const store = useReportStore()
const mensagem = ref('') // <--- aqui armazenamos a mensagem de erro ou sucesso

async function enviar() {
  try {
    const data = await store.sendReport(1)
    mensagem.value = 'Relatório enviado com sucesso!' // ou use data.message se a API retornar
  } catch (error: any) {
    mensagem.value = error.message || 'Ocorreu um erro ao enviar.'
  }
}
</script>

<template>
  <section>
    <form @submit.prevent="enviar">
      <h2 class="titulo">Criar Report</h2>
      <router-link to="">
        <!-- SVG de voltar -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="21"
          viewBox="0 0 35 21"
          fill="none"
        >
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.27812 10.2101L10.5875 14.4613..." />
        </svg>
      </router-link>

      <div class="entradas">
        <!-- Tipo -->
        <div class="tipo-denuncia campo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="32"
            viewBox="0 0 36 32"
            fill="none"
          >
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

        <p>{{ mensagem }}</p>
        <button type="submit" @click="store.sendReport(1)">Enviar</button>
      </div>
    </form>
  </section>
</template>
<style scoped lang="scss">
.titulo {
  grid-row: 5/31;
  text-align: center;
  color: var(--cinza);
  font-size: 1.6rem;
  margin-top: 4rem;
  margin-bottom: -3rem;
}

section {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(26, 25, 25);
}

form {
  background-color: white;
  height: 40vh;
  width: 30vw;
  border-radius: 14px;
  animation: fadeInUp 0.6s ease-in-out;

  .entradas {
    width: 100%;
    min-height: 580px;
    display: grid;
    grid-template-columns: repeat(30, 1fr);
    grid-template-rows: repeat(30, 1fr);

    // todos os campos animados
    .campo,
    .descricao,
    button {
      opacity: 0;
      transform: translateY(20px);
      animation: slideUp 0.6s ease forwards;
    }

    // delays
    .local {
      animation-delay: 0.2s;
    }
    .tipo-denuncia {
      animation-delay: 0.4s;
    }
    .dia-hora {
      animation-delay: 0.6s;
    }
    .descricao {
      animation-delay: 0.8s;
    }
    button {
      animation-delay: 1s;
    }

    // Local
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

    // Tipo
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

    .tipo-denuncia select {
      background: var(--cinza-claro);
      color: var(--cinza);
      padding: 0 1rem;
      font-size: var(--texto-m);
      border-radius: 8px;
      border: none;
    }

    // Dia e hora
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
        color: var(--cinza);
        align-self: baseline;
      }

      .escolher-dia-hora {
        width: var(--largura-componentes);
        height: var(--altura-componentes);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;

        input,
        select {
          width: var(--largura-componentes);
          height: var(--altura-componentes);
          border: none;
          border-radius: 8px;
          padding: 0;
          font-size: var(--texto-m);
        }

        input[type='date'],
        input[type='time'] {
          text-align: center;
          -webkit-appearance: none;
          -moz-appearance: textfield;
          appearance: none;
        }

        select {
          background: var(--cinza-claro);
          color: var(--cinza);
          padding: 0 1rem;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="%23999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: calc(var(--tamanho-icones) - 2.5vw);
        }
      }
    }

    // Descrição
    .descricao {
      grid-row: 12 / 22;
      grid-column: 1 / 31;
      width: var(--largura-componentes);
      justify-self: center;
      align-self: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 5px;

      label {
        color: var(--cinza);
        align-self: baseline;
      }

      textarea {
        width: var(--largura-componentes);
        height: calc(var(--altura-componentes) * 1.9);
        resize: none;
        background-color: var(--branco);
        color: var(--cinza);
        border-radius: 8px;
        outline: none;
        padding: 8px;
        box-sizing: border-box;
        font-size: var(--texto-m);
      }
    }

    // Mensagem de erro
    // Mensagem de erro/sucesso
    p {
      grid-column: 1 / -1;
      grid-row: 20/32;
      justify-self: center;
      align-self: center;
      width: var(--largura-componentes);
      max-width: 100%;
      min-height: calc(var(--altura-componentes) / 1.5);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      font-size: var(--texto-p);
      padding: 0.5rem 1rem;
      text-align: center;
      color: var(--vermelho); // você pode trocar dinamicamente se quiser sucesso/erro
      background-color: var(--branco);
      box-sizing: border-box;
    }

    // Botão
    button {
      grid-row: 14 / 30;
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

    // Hover e focus para todos inputs, selects, textarea
    input,
    select,
    textarea,
    button {
      transition:
        transform 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out,
        background-color 0.2s ease-in-out;
    }

    input:hover,
    select:hover,
    textarea:hover,
    button:hover {
      transform: scale(1.03);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      background-color: var(--cinza-claro);
    }

    input:focus,
    select:focus,
    textarea:focus {
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
      outline: none;
      background-color: var(--branco);
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
