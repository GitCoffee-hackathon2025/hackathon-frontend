<script>
import { UserStore } from '@/store/UserStore';
import { UserRequisitions } from '@/requisitions/User';
import { ocurrenceRequisitions } from '@/requisitions/Ocurrences';
import { findNeighborhoodByCoordinates } from '@/utils/geocoding';
export default {
  data() {
    return {
      historico: [],
      loading: true,
      error: null
    }
  },
 async mounted() {
  try {
    const userStore = UserStore();
    const userReq = UserRequisitions();
    const occurrenceReq = ocurrenceRequisitions();

    await userReq.recover();
    const response = await occurrenceReq.getOccurrences(userStore.idUser);

    console.log('Resposta da API:', response);

    if (response && response.success && response.data) {
      const occurrences = Array.isArray(response.data) ? response.data : [response.data];

      // Processar ocorrências e buscar bairros
      this.historico = await Promise.all(
        occurrences.map(async (occurrence) => {
          let bairro = null;

          // Buscar bairro se tiver coordenadas
          if (occurrence.coordenadas) {
            try {
              const coords = this.parseCoordenadas(occurrence.coordenadas);
              if (coords && coords.lat && coords.lng) {
                bairro = await findNeighborhoodByCoordinates(coords.lat, coords.lng);
              }
            } catch (error) {
              console.error('Erro ao buscar bairro:', error);
            }
          }

          return {
            descricao: occurrence.content_occurrence || 'Sem descrição',
            data: this.formatarData(occurrence.date_occurrence || occurrence.created_at),
            tipo: occurrence.type?.name || 'Sem tipo',
            coordenadas: occurrence.coordenadas ? this.parseCoordenadas(occurrence.coordenadas) : null,
            bairro: bairro?.name || 'Bairro não encontrado' // ✅ Bairro pré-calculado
          };
        })
      );
    } else {
      this.historico = [];
    }

  } catch (error) {
    console.error('Erro ao carregar ocorrências:', error);
    this.error = 'Erro ao carregar histórico';
    this.historico = [];
  } finally {
    this.loading = false;
  }
},
  methods: {
    formatarData(dataString) {
      if (!dataString) return 'Data não informada';

      try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
      } catch {
        return dataString;
      }
    },

    parseCoordenadas(coordenadasString) {
      try {
        return JSON.parse(coordenadasString);
      } catch {
        return null;
      }
    }
  }
}
</script>

<template>
  <div class="historico">
    <h3>Histórico de Ocorrências</h3>

    <div v-if="loading" class="loading">Carregando ocorrências...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="historico.length === 0" class="empty">
      Nenhuma ocorrência encontrada
    </div>

    <div v-else class="lista-ocorrencias">
      <div
        v-for="(item, index) in historico"
        :key="index"
        class="ocorrencia"
      >
        <div class="conteudo">{{ item.descricao }}</div>
        <div class="info">
          <span class="data">{{ item.data }}</span>
          <span class="tipo">{{ item.tipo }}</span>
        </div>
        <div v-if="item.coordenadas" class="coordenadas">
          📍 Bairro: {{item.bairro }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.historico {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
h3{
    margin: 1.3rem;
    text-align: center;
    font-size: 1.6rem;
}
.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: var(--color-white);
  font-style: italic;
}

.error {
  color: #d32f2f;
}

.empty {
  color: var(--color-white);
}

.lista-ocorrencias {
  display: flex;
  flex-direction: column;
  gap: 15px;

}

.ocorrencia {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 8px;
  background: #34495e;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.ocorrencia:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.conteudo {
  font-weight: 500;
  margin-bottom: 12px;
  line-height: 1.4;
  font-size: 16px;
  color: var(--color-white);
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--color-white);
  margin-bottom: 8px;
}

.coordenadas {
  font-size: 12px;
  color: var(--color-gray-dark);
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #007bff;
  margin-top: 8px;
}

.tipo {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

/* Responsivo */
@media (max-width: 768px) {
  .historico {
    padding: 15px;
  }

  .info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .tipo {
    align-self: flex-start;
  }

  .ocorrencia {
    padding: 15px;
  }
}
</style>
