<script setup>
import { ref, onMounted } from 'vue';
import AlunoService from '@/services/AlunoService.js';

// Componentes
import AlunosLista from '@/components/alunos/AlunosLista.vue';
import AlunoDetalheCard from '@/components/alunos/AlunoDetalheCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

// Estado
const listaAlunos = ref([]); // A lista da esquerda
const alunoSelecionado = ref(null); // O aluno do card da direita
const loadingLista = ref(true); // Carregamento da lista (inicial)
const loadingDetalhe = ref(false); // Carregamento do card (ao clicar)
const error = ref(null);

// Função para buscar a lista inicial
async function buscarListaAlunos() {
  loadingLista.value = true;
  error.value = null;
  try {
    const response = await AlunoService.getAlunos();
    listaAlunos.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = "Não foi possível carregar a lista de alunos.";
  } finally {
    loadingLista.value = false;
  }
}

// Função chamada pelo evento @alunoSelecionado do componente AlunosLista
async function carregarDetalhesAluno(alunoId) {
  loadingDetalhe.value = true;
  alunoSelecionado.value = null; // Limpa o card anterior
  try {
    const response = await AlunoService.getAlunoById(alunoId);
    alunoSelecionado.value = response.data;
  } catch (err) {
    console.error(err);
    // (Poderíamos ter um 'errorDetalhe' aqui)
  } finally {
    loadingDetalhe.value = false;
  }
}

async function handleStatusAtualizado(payload) {
  // payload = { id: 1, status: 'Evadido' }
  
  loadingDetalhe.value = true; // Ativa o spinner do card
  try {
    // 1. Chama o serviço para atualizar o "backend"
    const alunoAtualizado = await AlunoService.updateAlunoStatus(payload.id, payload.status);
    
    // 2. Atualiza o estado local (para o frontend reagir)
    // Atualiza o card de detalhe
    alunoSelecionado.value = alunoAtualizado.data;

    // Atualiza a lista da esquerda
    const indexNaLista = listaAlunos.value.findIndex(a => a.id === payload.id);
    if (indexNaLista !== -1) {
      listaAlunos.value[indexNaLista].status = payload.status;
    }
    
  } catch (err) {
    console.error(err);
    // (Poderíamos ter um 'errorDetalhe' aqui)
  } finally {
    loadingDetalhe.value = false;
  }
}

// Busca a lista quando a página carrega
onMounted(() => {
  buscarListaAlunos();
});
</script>

<template>
  <h1 class="display-4 mb-4">
    Gestão de Alunos
  </h1>

  <div>
    <LoadingSpinner v-if="loadingLista" />
    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else class="row">
      
      <div class="col-md-5">
        <AlunosLista 
          :alunos="listaAlunos"
          @aluno-selecionado="carregarDetalhesAluno"
        />
      </div>

      <div class="col-md-7">
        <AlunoDetalheCard 
          :aluno="alunoSelecionado"
          :loading="loadingDetalhe"
        />
      </div>

    </div>
  </div>
</template>