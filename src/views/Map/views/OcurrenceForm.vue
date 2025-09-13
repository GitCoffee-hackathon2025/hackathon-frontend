<script setup lang="ts">
import { ref } from 'vue'
import { ocurrenceRequisitions } from '@/requisitions/Ocurrences'

const ocurrenceReq = ocurrenceRequisitions()
const menssage = ref('') // <--- aqui armazenamos a mensagem de erro ou sucesso

async function sendOcurrence() {
  try {
    await ocurrenceReq.sendoccurrence(1)
    menssage.value = 'Relatório enviado com sucesso!' // ou use data.message se a API retornar
  } catch (error: any) {
    menssage.value = error.message || 'Ocorreu um erro ao enviar.'
  }
}
</script>

<template>
  <section>
    <form @submit.prevent="sendOcurrence">
      <h2 class="title">Criar occurrence</h2>
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

      <div class="inputs">
        <!-- Tipo -->
        <div class="ocurrence-type field">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="32"
            viewBox="0 0 36 32"
            fill="none"
          >
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.993 2.55819C15.7409..." />
          </svg>
          <select v-model="ocurrenceReq.occurrenceType">
            <option value="" disabled selected>Escolha um crime</option>
            <option value="Acidente de trânsito">Acidente de trânsito</option>
            <option value="Assalto">Assalto</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <!-- Data -->
        <div class="time campo">
          <label>Data:</label>
          <div class="choose-time">
            <input type="date" v-model="ocurrenceReq.occurrenceDate" />
          </div>
        </div>

        <!-- Descrição -->
        <div class="description">
          <label>Descrição:</label>
          <textarea v-model="ocurrenceReq.occurrenceContent"></textarea>
        </div>

        <p>{{ menssage }}</p>
        <button type="submit" @click="ocurrenceReq.sendoccurrence(1)">Enviar</button>
      </div>
    </form>
  </section>
</template>
<style scoped lang="scss">
.title {
  grid-row: 5/31;
  text-align: center;
  color: var(--color-gray-dark);
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
  background-color: var(--color-white);
  height: 40vh;
  width: 30vw;
  border-radius: 14px;
  animation: fadeInUp 0.6s ease-in-out;

  .inputs {
    width: 100%;
    min-height: 580px;
    display: grid;
    grid-template-columns: repeat(30, 1fr);
    grid-template-rows: repeat(30, 1fr);

    // todos os campos animados
    .field,
    .description,
    button {
      opacity: 0;
      transform: translateY(20px);
      animation: slideUp 0.6s ease forwards;
    }

    // delays
    .local {
      animation-delay: 0.2s;
    }
    .ocurrence-type {
      animation-delay: 0.4s;
    }
    .time {
      animation-delay: 0.6s;
    }
    .description {
      animation-delay: 0.8s;
    }
    button {
      animation-delay: 1s;
    }

    // Local
    .local {
      grid-row: 3 / 7;
      grid-column: 1 / 31;
      height: var(--component-height);
      width: var(--component-width);
      justify-self: center;
      align-self: center;
      border: none;

      svg {
        fill: var(--color-gray-dark);
      }
    }

    // Tipo
    .type-ocurrence {
      grid-row: 6 / 11;
      grid-column: 1 / 31;
      width: var(--component-width);
      height: var(--component-height);
      justify-self: center;
      align-self: center;
      border: none;

      svg {
        fill: var(--color-gray-dark);
      }
    }

    .ocurrence-type select {
      background: var(--color-gray-light);
      color: var(--color-gray-dark);
      padding: 0 1rem;
      font-size: var(--text-md);
      border-radius: 8px;
      border: none;
    }

    // Dia e hora
    .time {
      grid-row: 9 / 15;
      grid-column: 1 / 31;
      width: var(--component-width);
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

      .choose-time {
        width: var(--component-width);
        height: var(--component-height);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;

        input,
        select {
          width: var(--component-width);
          height: var(--component-height);
          border: none;
          border-radius: 8px;
          padding: 0;
          font-size: var(--text-md);
        }

        input[type='date'],
        input[type='time'] {
          text-align: center;
          -webkit-appearance: none;
          -moz-appearance: textfield;
          appearance: none;
        }

        select {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
          padding: 0 1rem;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="%23999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: calc(var(--icon-size) - 2.5vw);
        }
      }
    }

    // Descrição
    .description {
      grid-row: 12 / 22;
      grid-column: 1 / 31;
      width: var(--component-width);
      justify-self: center;
      align-self: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 5px;

      label {
        color: var(--color-gray-dark);
        align-self: baseline;
      }

      textarea {
        width: var(--component-width);
        height: calc(var(--component-height) * 1.9);
        resize: none;
        background-color: var(--color-white);
        color: var(--color-gray-dark);
        border-radius: 8px;
        outline: none;
        padding: 8px;
        box-sizing: border-box;
        font-size: var(--text-md);
      }
    }

    // Mensagem de erro
    // Mensagem de erro/sucesso
    p {
      grid-column: 1 / -1;
      grid-row: 20/32;
      justify-self: center;
      align-self: center;
      width: var(--component-width);
      max-width: 100%;
      min-height: calc(var(--component-height) / 1.5);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      font-size: var(--text-md);
      padding: 0.5rem 1rem;
      text-align: center;
      color: var(--color-red); // você pode trocar dinamicamente se quiser sucesso/erro
      background-color: var(--color-white);
      box-sizing: border-box;
    }

    // Botão
    button {
      grid-row: 14 / 30;
      grid-column: 1 / 31;
      width: var(--component-width);
      height: var(--component-height);
      justify-self: center;
      align-self: center;
      border: none;
      background-color: var(--color-white);
      color: var(--color-gray-dark);
      border-radius: 8px;
      font-size: var(--text-md);
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
      background-color: var(--color-gray-light);
    }

    input:focus,
    select:focus,
    textarea:focus {
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
      outline: none;
      background-color: var(--color-white);
    }
  }

  a {
    svg {
      fill: var(--color-white);
      position: fixed;
      top: 5px;
      left: 10px;
      width: var(--icon-size);
      height: var(--icon-size);
    }
  }
}

@media (min-width: 576px) {
  form {
    min-height: 900px;

    div.inputs {
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
