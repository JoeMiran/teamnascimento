<script setup>
import { ref, onMounted, watch } from 'vue';
import RelatorioService from '@/services/RelatorioService.js';

// Componentes
import RelatorioFaturamentoChart from '@/components/relatorios/RelatorioFaturamentoChart.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

// Estado
const faturamentoData = ref({ labels: [], data: [] });
const selectedYear = ref(new Date().getFullYear());
const anosDisponiveis = [2025, 2024];
const loading = ref(true);
const error = ref(null);

// Função para buscar os dados
async function buscarRelatorio(ano) {
  loading.value = true;
  error.value = null;
  faturamentoData.value = { labels: [], data: [] }; // Limpa os dados antigos
  try {
    const response = await RelatorioService.getFaturamentoAnual(ano);
    faturamentoData.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = "Não foi possível carregar o relatório.";
  } finally {
    loading.value = false;
  }
}

// Observa o filtro de ano
watch(selectedYear, (novoAno) => {
  buscarRelatorio(novoAno);
});

// Busca os dados iniciais
onMounted(() => {
  buscarRelatorio(selectedYear.value);
});
</script>

<template>
  <h1 class="display-4 mb-4">
    Relatório Anual de Faturamento
  </h1>

  <div class="mb-3" style="max-width: 200px;">
    <label for="filtro-ano" class="form-label">Filtrar por Ano:</label>
    <select v-model="selectedYear" id="filtro-ano" class="form-select">
      <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">
        {{ ano }}
      </option>
    </select>
  </div>

  <div>
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <RelatorioFaturamentoChart v-else :chart-data="faturamentoData" />
  </div>
</template>