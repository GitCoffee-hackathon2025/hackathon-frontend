<script>
import { UserStore } from '@/store/UserStore';
import { UserRequisitions } from '@/requisitions/User';
import { ocurrenceRequisitions } from '@/requisitions/Ocurrences';

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
      
      // Recupera dados do usuário
      await userReq.recover();
      
      // Busca ocorrências do usuário
      const response = await occurrenceReq.getOccurrences(userStore.idUser);
      
      console.log('Resposta da API:', response); // Para debug
      
      if (response && response.success && response.data) {
        // Agora response.data deve ser um array
        if (Array.isArray(response.data)) {
          this.historico = response.data.map(occurrence => ({
            descricao: occurrence.content_occurrence || 'Sem descrição',
            data: this.formatarData(occurrence.date_occurrence || occurrence.created_at),
            tipo: occurrence.type.name || 'Sem tipo',
            coordenadas: occurrence.coordenadas ? this.parseCoordenadas(occurrence.coordenadas) : null
          }));
        } else {
          // Fallback: se ainda for objeto único, cria array
          this.historico = [{
            descricao: response.data.content_occurrence || 'Sem descrição',
            data: this.formatarData(response.data.date_occurrence || response.data.created_at),
            tipo: response.data.type.name || 'Sem tipo',
            coordenadas: response.data.coordenadas ? this.parseCoordenadas(response.data.coordenadas) : null
          }];
        }
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
          📍 Lat: {{ item.coordenadas.lat }}, Lng: {{ item.coordenadas.lng }}
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
  color: #666;
  font-style: italic;
}

.error {
  color: #d32f2f;
}

.empty {
  color: #999;
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
  background: #fff;
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
  color: #333;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.coordenadas {
  font-size: 12px;
  color: #888;
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