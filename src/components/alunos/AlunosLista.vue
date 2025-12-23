<script setup>
defineProps({
  alunos: Array
});
// Define o evento que este componente pode "emitir" para o pai
const emit = defineEmits(['alunoSelecionado']);

// Função para emitir o evento com o ID do aluno
function selecionarAluno(alunoId) {
  emit('alunoSelecionado', alunoId);
}
</script>

<template>
  <div class="card" style="height: 75vh; overflow-y: auto;">
    <div class="card-header">
      <h5 class="m-0">Alunos Matriculados</h5>
    </div>
    <div class="list-group list-group-flush">
      <a
        v-for="aluno in alunos"
        :key="aluno.id"
        href="#"
        class="list-group-item list-group-item-action"
        @click.prevent="selecionarAluno(aluno.id)"
      >
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">{{ aluno.nome }}</h6>
          <span 
            :class="['badge', aluno.status === 'Adimplente' ? 'bg-success' : 'bg-danger']"
          >
            {{ aluno.status }}
          </span>
        </div>
        <small class="text-muted">{{ aluno.faixa }}</small>
      </a>
    </div>
  </div>
</template>