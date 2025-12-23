// Em: src/services/AlunoService.js

function simularDemora(dados, tempo = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: dados });
    }, tempo);
  });
}

// --- BASE DE DADOS SIMULADA ---
let listaAlunosSimulada = [
  { id: 1, nome: 'Carlos Gracie', faixa: 'Vermelha', status: 'Adimplente' },
  { id: 2, nome: 'Helio Gracie', faixa: 'Vermelha', status: 'Adimplente' },
  { id: 3, nome: 'Rickson Gracie', faixa: 'Coral', status: 'Inadimplente' },
  { id: 4, nome: 'Royler Gracie', faixa: 'Coral', status: 'Adimplente' },
  { id: 5, nome: 'Rorion Gracie', faixa: 'Vermelha', status: 'Evadido' },
  { id: 6, nome: 'Kyra Gracie', faixa: 'Preta', status: 'Adimplente' },
];

let detalhesAlunosSimulados = {
  1: { 
    id: 1, nome: 'Carlos Gracie', cpf: '111.111.111-11', dataNascimento: '1975-01-01', 
    endereco: 'Rua do Tatame, 10', telefone: '(21) 99999-9999', sexo: 'Masculino',
    faixa: 'Vermelha', status: 'Adimplente', plano: 'Plano Ouro (3x)', vencimento: '2025-11-20',
    problemasSaude: 'Nenhum', responsavelNome: '', responsavelCpf: '',
    faixasHistorico: [],
    presencas: []
  },
  // (Para simplificar, não vou preencher todos, mas o código aceita)
};

export default {
  getAlunos() {
    return simularDemora(listaAlunosSimulada.map(a => ({...a})), 800);
  },

  getAlunoById(id) {
    // Converte ID para número (caso venha string da URL)
    const idNum = Number(id);
    const detalhes = detalhesAlunosSimulados[idNum];
    // Se não tiver detalhes, busca na lista básica
    const basico = listaAlunosSimulada.find(a => a.id === idNum);
    
    // Retorna fusão dos dados (ou null)
    const dadosFinais = detalhes || basico;
    const resultado = dadosFinais ? { ...dadosFinais } : null;
    // Garante que o objeto tem o campo `faixasHistorico` (array)
    if (resultado) {
      resultado.faixasHistorico = resultado.faixasHistorico || [];
    }
    return simularDemora(resultado, 300);
  },

  async createAluno(dadosAluno) {
    // Sintaxe: api.post('rota', dados)
    // Isso envia uma requisição HTTP POST para o Laravel
    const response = await api.post('/alunos', dadosAluno);
    return response.data; 
  },

  // (NOVO) Função de Edição Completa
  updateAluno(id, dadosAtualizados) {
    console.log(`SERVICE: Editando aluno ${id}...`, dadosAtualizados);
    const idNum = Number(id);

    // Atualiza lista resumida
    const indexLista = listaAlunosSimulada.findIndex(a => a.id === idNum);
    if (indexLista !== -1) {
      listaAlunosSimulada[indexLista].nome = dadosAtualizados.nome;
      listaAlunosSimulada[indexLista].faixa = dadosAtualizados.faixa;
    }

    // Atualiza detalhes (preserva ID e Status, sobrepõe o resto)
    detalhesAlunosSimulados[idNum] = {
      ...detalhesAlunosSimulados[idNum], // Mantém dados antigos
      ...dadosAtualizados,               // Sobrepõe com novos
      id: idNum,                         // Garante ID
      faixasHistorico: (dadosAtualizados.faixasHistorico !== undefined)
        ? dadosAtualizados.faixasHistorico
        : (detalhesAlunosSimulados[idNum] && detalhesAlunosSimulados[idNum].faixasHistorico) || []
      ,
      presencas: (dadosAtualizados.presencas !== undefined)
        ? dadosAtualizados.presencas
        : (detalhesAlunosSimulados[idNum] && detalhesAlunosSimulados[idNum].presencas) || []
    };

    return simularDemora(detalhesAlunosSimulados[idNum], 600);
  },

  updateAlunoStatus(id, novoStatus) {
    const idNum = Number(id);
    const alunoLista = listaAlunosSimulada.find(a => a.id === idNum);
    if (alunoLista) alunoLista.status = novoStatus;

    if (detalhesAlunosSimulados[idNum]) detalhesAlunosSimulados[idNum].status = novoStatus;
    
    return simularDemora(detalhesAlunosSimulados[idNum], 400);
  }
  ,

  // Marca presença (padrão: agora). Guarda a entrada com a faixa atual do aluno e grau
  addPresenca(id, { dateISO } = {}) {
    const idNum = Number(id);
    const detalhes = detalhesAlunosSimulados[idNum];
    if (!detalhes) return simularDemora(null, 200);

    // determina grau atual baseado no histórico (último registro desta faixa)
    let grauAtual = '';
    if (detalhes.faixasHistorico && detalhes.faixasHistorico.length) {
      const matches = detalhes.faixasHistorico.filter(h => h.faixa === detalhes.faixa);
      if (matches.length) {
        grauAtual = matches[matches.length - 1].grau || '';
      }
    }

    const presenca = {
      id: (detalhes.presencas ? detalhes.presencas.length : 0) + 1,
      date: dateISO || new Date().toISOString(),
      faixa: detalhes.faixa,
      grau: grauAtual
    };

    if (!detalhes.presencas) detalhes.presencas = [];
    detalhes.presencas.push(presenca);

    // Atualiza também a lista resumida (não necessário, mas mantém consistência)
    const resumo = listaAlunosSimulada.find(a => a.id === idNum);
    if (resumo) resumo.faixa = detalhes.faixa;

    return simularDemora(presenca, 200);
  }
};