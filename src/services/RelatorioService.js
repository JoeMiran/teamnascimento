// Em: src/services/RelatorioService.js

function simularDemora(dados) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: dados });
    }, 800);
  });
}

const faturamentoPorAno = {
  2025: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    data: [8200, 8500, 9300, 9100, 10500, 10200, 11000, 12500, 12300, 12800, 13000, 15000],
  },
  2024: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    data: [7000, 7100, 7500, 7200, 8000, 7900, 8100, 8500, 9000, 9200, 9500, 10000],
  }
};

export default {
  getFaturamentoAnual(ano) {
    console.log(`SERVICE: Buscando faturamento para o ano ${ano} (simulado)...`);
    const dadosDoAno = faturamentoPorAno[ano] || { labels: [], data: [] };
    return simularDemora(dadosDoAno);
  }
};