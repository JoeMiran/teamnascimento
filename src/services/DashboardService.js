// Em: src/services/DashboardService.js

/* * Este ficheiro simula a chamada ao teu backend Laravel.
 * Quando o backend estiver pronto, só precisaremos de trocar
 * o conteúdo destas funções para chamadas reais do 'apiClient' (Axios).
*/

// Função helper para simular a demora de uma chamada de rede (1 segundo)
function simularDemora(dados) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: dados }); // O Axios envolve a resposta num objeto 'data'
    }, 1000); // 1000ms = 1 segundo
  });
}

// SIMULAÇÃO DOS DADOS:
const statsSimulados = {
  faturamentoMensal: 12500.00,
  totalAlunos: 82,
  totalAdimplentes: 75,
  totalInadimplentes: 7, 
  totalEvadidos: 3 // <-- O NOVO KPI
};

const inadimplentesSimulados = [
  { id: 1, nome: 'Carlos Gracie', plano: 'Plano Ouro (3x)', vencimento: '2025-10-30' },
  { id: 2, nome: 'Helio Gracie', plano: 'Plano Prata (2x)', vencimento: '2025-10-25' },
  { id: 3, nome: 'Rickson Gracie', plano: 'Plano Ouro (3x)', vencimento: '2025-11-01' },
];

const vencimentosSimulados = [
  { id: 4, nome: 'Royler Gracie', plano: 'Plano Prata (2x)', vencimento: '2025-11-06' },
  { id: 5, nome: 'Rorion Gracie', plano: 'Plano Bronze (1x)', vencimento: '2025-11-08' },
];

export default {
  
  getStats() {
    console.log("SERVICE: Buscando Stats (simulado)...");
    return simularDemora(statsSimulados);
  },

  getInadimplentes() {
    console.log("SERVICE: Buscando Inadimplentes (simulado)...");
    return simularDemora(inadimplentesSimulados);
  },

  getProximosVencimentos() {
    console.log("SERVICE: Buscando Próximos Vencimentos (simulado)...");
    return simularDemora(vencimentosSimulados);
  }
};

