<script setup>
defineProps({
  titulo: String,
  alunos: Array,
  tipo: {
    type: String,
    default: 'default' // 'default', 'danger' (inadimplente), 'warning' (vencimento)
  }
});

// Helper para formatar a data
const formatarData = (dataStr) => {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // UTC para evitar bugs de fuso
};

// Define a cor do "header" com base no tipo
const headerClass = {
  'danger': 'bg-danger text-white',
  'warning': 'bg-warning text-dark',
  'default': 'bg-light'
};
</script>

<template>
  <div class="card shadow-sm">
    <div :class="['card-header', headerClass[tipo]]">
      <h6 class="m-0 font-weight-bold">{{ titulo }}</h6>
    </div>
    <div class="list-group list-group-flush">
      <div v-if="!alunos || alunos.length === 0" class="list-group-item">
        Nenhum aluno encontrado.
      </div>
      
      <a 
        v-for="aluno in alunos" 
        :key="aluno.id" 
        href="#" 
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ aluno.nome }}</h5>
          <small class="text-muted">Vence: {{ formatarData(aluno.vencimento) }}</small>
        </div>
        <p class="mb-1 text-muted">{{ aluno.plano }}</p>
      </a>
    </div>
  </div>
</template>