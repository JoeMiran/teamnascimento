<script setup>
import { ref, computed } from 'vue';
// 1. Importa as ferramentas do Chart.js
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// 2. Regista as ferramentas que vamos usar
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// 3. Este componente espera os números de Adimplentes e Inadimplentes
const props = defineProps({
  adimplentes: {
    type: Number,
    required: true
  },
  inadimplentes: {
    type: Number,
    required: true
  }
});

// 4. Configuração dos Dados (reativa)
const chartData = computed(() => ({
  labels: ['Adimplentes', 'Inadimplentes'],
  datasets: [
    {
      backgroundColor: ['#2a9d8f', '#d90429'], // Verde (sucesso) e Vermelho (perigo)
      data: [props.adimplentes, props.inadimplentes],
      borderWidth: 0,
    },
  ],
}));

// 5. Opções de Estilo do Gráfico
// Em: src/components/dashboard/FinancialChart.vue (dentro do <script setup>)

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#1a1a1a', // <-- A CORREÇÃO (Texto preto)
        font: {
          family: "'Oswald', sans-serif",
          size: 14
        }
      }
    },
    title: {
      display: true,
      text: 'Situação dos Alunos',
      color: '#1a1a1a', // <-- A CORREÇÃO (Texto preto)
      font: {
        family: "'Oswald', sans-serif",
        size: 18,
        weight: 'bold'
      }
    }
  }
});
</script>

<template>
  <div class="card" style="height: 400px;">
    <div class="card-body">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>