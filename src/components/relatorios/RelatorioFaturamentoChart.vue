<script setup>
import { computed } from 'vue'; // Importa o 'computed'
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Regista os elementos do Chart.js que vamos usar
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

// Configurações (com as cores do tema claro)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Faturamento Mensal',
      color: '#1a1a1a', // Cor preta
      font: { family: "'Oswald', sans-serif", size: 18 }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      ticks: { color: '#1a1a1a' },
      grid: { color: '#ccc' }
    },
    x: {
      ticks: { color: '#1a1a1a' },
      grid: { display: false }
    }
  }
};

// Dados formatados
const formattedData = computed(() => ({
  labels: props.chartData.labels || [],
  datasets: [
    {
      label: 'Faturamento',
      backgroundColor: '#d90429', // Vermelho BJJ
      borderColor: '#d90429',
      data: props.chartData.data || [],
      borderRadius: 5,
    }
  ]
}));
</script>

<template>
  <div class="card" style="height: 450px;">
    <div class="card-body">
      <Bar v-if="chartData && chartData.data && chartData.data.length" 
           :data="formattedData" 
           :options="chartOptions" />
      <div v-else class="text-center h-100 d-flex align-items-center justify-content-center">
        <p>Nenhum dado encontrado para este ano.</p>
      </div>
    </div>
  </div>
</template>