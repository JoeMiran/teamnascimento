<script setup>
import { ref, onMounted } from 'vue';
import DashboardService from '@/services/DashboardService.js';

// Importa os blocos
import StatsCard from '@/components/dashboard/StatsCard.vue';
import ListaAlunos from '@/components/dashboard/ListaAlunos.vue';
import FinancialChart from '@/components/dashboard/FinancialChart.vue'; // <-- NOVO

// Importa os componentes comuns
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

// Variáveis reativas
const stats = ref(null);
const inadimplentes = ref([]);
const proximosVencimentos = ref([]);
const loading = ref(true);
const error = ref(null);

// Função que busca TODOS os dados
async function carregarDashboard() {
  loading.value = true;
  error.value = null;
  try {
    const [statsRes, inadimplentesRes, vencimentosRes] = await Promise.all([
      DashboardService.getStats(),
      DashboardService.getInadimplentes(),
      DashboardService.getProximosVencimentos()
    ]);
    
    stats.value = statsRes.data;
    inadimplentes.value = inadimplentesRes.data;
    proximosVencimentos.value = vencimentosRes.data;

  } catch (err) {
    console.error(err);
    error.value = "Não foi possível carregar os dados do dashboard.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  carregarDashboard();
});
</script>

<template>
  <h1 class="display-4 mb-4">
    Visão Geral Financeira
  </h1>

  <LoadingSpinner v-if="loading" />
  <ErrorMessage v-else-if="error" :message="error" />

  <div v-else>
    
    <div class="row">
      
      <div class="col-lg-3 col-md-6 mb-4">
        <StatsCard 
          titulo="Faturamento (Mês)"
          :valor="stats.faturamentoMensal"
          icone="bi-cash-stack"
          cor="success"
          :isCurrency="true" />
      </div>
      
      <div class="col-lg-3 col-md-6 mb-4">
        <StatsCard 
          titulo="Total de Alunos Ativos"
          :valor="stats.totalAlunos"
          icone="bi-people-fill"
          cor="info"
          />
      </div>
      
      <div class="col-lg-2 col-md-6 mb-4">
        <StatsCard 
          titulo="Adimplentes (Mês)"
          :valor="stats.totalAdimplentes"
          icone="bi-check-circle-fill"
          cor="success"
        />
      </div>

      <div class="col-lg-2 col-md-6 mb-4">
        <StatsCard 
          titulo="Inadimplentes (Mês)"
          :valor="stats.totalInadimplentes"
          icone="bi-exclamation-triangle-fill"
          cor="danger"
        />
      </div>

      <div class="col-lg-2 col-md-6 mb-4">
        <StatsCard 
          titulo="Evadidos (Mês)"
          :valor="stats.totalEvadidos"
          icone="bi-person-x-fill"
          cor="warning"
        />
      </div>

    </div>

    <div class="row">
      <div class="col-lg-5 mb-4">
        <FinancialChart 
          :adimplentes="stats.totalAdimplentes"
          :inadimplentes="stats.totalInadimplentes"
        />
      </div>
      <div class="col-lg-7 mb-4">
        <ListaAlunos 
          titulo="Pagamentos Atrasados (Inadimplentes)"
          :alunos="inadimplentes"
          tipo="danger"
        />
      </div>
    </div>
    
  </div>
</template>