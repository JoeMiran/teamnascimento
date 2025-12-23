<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router'; // Importante para o botão de Editar funcionar

const props = defineProps({
  aluno: Object,
  loading: Boolean
});

// 1. (NOVO) Define o evento que vamos enviar para o componente pai (AlunosView)
// Isso permite avisar a página principal que o status mudou.
const emit = defineEmits(['statusAtualizado']);

// Helper de formatação de Status (Atualizado com cor para Evadido)
const getStatusClass = (status) => {
  if (status === 'Adimplente') return 'text-success';
  if (status === 'Inadimplente') return 'text-danger';
  if (status === 'Evadido') return 'text-secondary'; // Cinza
  return 'text-dark';
};

const getFaixaClass = (faixa) => {
  if (!faixa) return '';
  const cor = faixa.toLowerCase().split(' ')[0];
  return `faixa-${cor}`;
};

function formatDateISO(iso) {
  if (!iso) return 'N/A';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch (e) {
    return iso;
  }
}

const countsByFaixa = computed(() => {
  const alunoLocal = (typeof props !== 'undefined' && props.aluno) ? props.aluno : null;
  const pres = (alunoLocal && alunoLocal.presencas) ? alunoLocal.presencas : [];
  const out = {};
  pres.forEach(p => {
    const faixa = p.faixa || 'Sem Faixa';
    const grau = (p.grau !== undefined && p.grau !== null && p.grau !== '') ? p.grau : '0';
    out[faixa] = out[faixa] || { total: 0, graus: {} };
    out[faixa].total++;
    out[faixa].graus[grau] = (out[faixa].graus[grau] || 0) + 1;
  });
  return out;
});

const totalNaFaixaAtual = computed(() => {
  const alunoLocal = (typeof props !== 'undefined' && props.aluno) ? props.aluno : null;
  if (!alunoLocal || !alunoLocal.presencas) return 0;
  const faixaAtual = alunoLocal.faixa;
  return alunoLocal.presencas.filter(p => p.faixa === faixaAtual).length;
});

// 2. (NOVO) Função executada ao clicar no botão
function marcarComoEvadido() {
  if (confirm(`Tem a certeza que deseja marcar ${props.aluno.nome} como EVADIDO?`)) {
    // Emite o evento com o ID e o novo status
    emit('statusAtualizado', { id: props.aluno.id, status: 'Evadido' });
  }
}
</script>

<template>
  <div class="card sticky-top" style="top: 2rem;">
    <div class="card-header">
      <h5 class="m-0">Detalhes do Aluno</h5>
    </div>
    
    <div class="card-body" style="min-height: 300px;">
      
      <div v-if="loading" class="d-flex justify-content-center align-items-center h-100">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>

      <div v-else-if="!aluno" class="d-flex justify-content-center align-items-center h-100 text-muted">
        <i class="bi bi-arrow-left-circle-fill fs-3 me-2"></i>
        <span>Selecione um aluno da lista para ver os detalhes.</span>
      </div>

      <div v-else>
        <h3 class="display-6">{{ aluno.nome }}</h3>
        
        <div class="d-flex justify-content-between mb-3">
          <span :class="['p-2 fs-5', getFaixaClass(aluno.faixa)]">
            <i class="bi bi-award-fill me-2"></i> {{ aluno.faixa }}
          </span>
          <span :class="['p-2 fs-5 fw-bold', getStatusClass(aluno.status)]">
            <i class="bi bi-cash-coin me-2"></i> {{ aluno.status }}
          </span>
        </div>
        <div class="mb-2 small text-muted">
          <strong>Treinos na faixa atual:</strong>
          <div>
            <span v-if="totalNaFaixaAtual === 0">Nenhum treino registrado nesta faixa.</span>
            <span v-else>{{ totalNaFaixaAtual }} treinos</span>
          </div>
        </div>
        
        <hr class="border-secondary">

        <ul class="list-unstyled">
          <li class="mb-2">
            <strong class="text-muted">Idade:</strong>
            <span class="ms-2">{{ aluno.idade || 'N/A' }}</span>
          </li>
          <li class="mb-2">
            <strong class="text-muted">CPF:</strong>
            <span class="ms-2">{{ aluno.cpf || 'N/A' }}</span>
          </li>
          <li class="mb-2">
            <strong class="text-muted">Endereço:</strong>
            <span class="ms-2">{{ aluno.endereco || 'N/A' }}</span>
          </li>
          </ul>

        <div v-if="aluno.faixasHistorico && aluno.faixasHistorico.length" class="mt-3">
          <h6 class="text-muted">Histórico de Faixas</h6>
          <ul class="list-unstyled small">
            <li v-for="(h, i) in aluno.faixasHistorico" :key="i">
              <strong>{{ h.faixa }}</strong>
              <span class="text-muted"> — {{ formatDateISO(h.dataObtencao) }} </span>
              <span v-if="h.grau !== undefined && h.grau !== ''" class="ms-2">(Grau: {{ h.grau }})</span>
            </li>
          </ul>
        </div>

        <div class="mt-4 pt-3 border-top">
          <h6 class="text-muted mb-3">Ações</h6>
          
          <div class="d-flex gap-2">
            <RouterLink :to="`/alunos/${aluno.id}/editar`" class="btn btn-primary flex-grow-1">
              <i class="bi bi-pencil-square me-2"></i>
              Editar
            </RouterLink>

            <button 
              v-if="aluno.status !== 'Evadido'" 
              @click="marcarComoEvadido" 
              class="btn btn-warning flex-grow-1"
            >
              <i class="bi bi-person-x-fill me-2"></i>
              Evadido
            </button>
          </div>
          
          <div v-if="aluno.status === 'Evadido'" class="alert alert-secondary mt-3 text-center">
            <small>Este aluno já está marcado como evadido.</small>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
/* Cores das faixas */
.faixa-vermelha { color: #d90429; }
.faixa-coral { color: #e76f51; }
.faixa-preta { color: #adb5bd; }
.faixa-marrom { color: #5d4037; }
.faixa-roxa { color: #7b1fa2; }
.faixa-azul { color: #1976d2; }
/* Adicionei outras cores caso precises */
</style>