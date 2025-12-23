<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AlunoService from '@/services/AlunoService.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const saving = ref(false);
const error = ref(null);

const aluno = ref({});

const isMenorDeIdade = computed(() => {
  if (!aluno.value.dataNascimento) return false;
  const hoje = new Date();
  const nasc = new Date(aluno.value.dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade < 18;
});

const faixas = ['Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta', 'Coral', 'Vermelha'];
const planos = ['Plano Bronze (1x)', 'Plano Prata (2x)', 'Plano Ouro (3x)'];

function adicionarFaixa() {
  if (!aluno.value.faixasHistorico) aluno.value.faixasHistorico = [];
  aluno.value.faixasHistorico.push({ faixa: aluno.value.faixa || 'Branca', dataObtencao: '', grau: '' });
}

function removerFaixa(index) {
  if (!aluno.value.faixasHistorico) return;
  aluno.value.faixasHistorico.splice(index, 1);
}

function marcarComoAtual(index) {
  const h = aluno.value.faixasHistorico && aluno.value.faixasHistorico[index];
  if (!h) return;
  aluno.value.faixa = h.faixa;
  if (!h.dataObtencao) h.dataObtencao = new Date().toISOString().slice(0,10);
}

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await AlunoService.getAlunoById(id);
    if (!response.data) throw new Error("Aluno não encontrado");
    aluno.value = response.data;
    // Garante que exista o array de histórico de faixas
    aluno.value.faixasHistorico = aluno.value.faixasHistorico || [];
  } catch (err) {
    error.value = "Erro ao carregar dados do aluno.";
  } finally {
    loading.value = false;
  }
});

async function handleUpdate() {
  saving.value = true;
  try {
    await AlunoService.updateAluno(aluno.value.id, aluno.value);
    alert('Dados atualizados com sucesso!');
    router.push('/alunos');
  } catch (err) {
    alert('Erro ao salvar alterações.');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="loading" class="text-center mt-5"><LoadingSpinner /></div>
  <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

  <div v-else>
    <h1 class="display-5 mb-4">Editar Aluno: {{ aluno.nome }}</h1>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleUpdate">
          
          <h5 class="mb-3 text-secondary border-bottom pb-2">Dados Pessoais</h5>
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Nome Completo</label>
              <input type="text" v-model="aluno.nome" class="form-control" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">CPF</label>
              <input type="text" v-model="aluno.cpf" class="form-control">
            </div>
            <div class="col-md-3">
              <label class="form-label">Data de Nascimento</label>
              <input type="date" v-model="aluno.dataNascimento" class="form-control" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">Sexo</label>
              <select v-model="aluno.sexo" class="form-select">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div class="col-md-5">
              <label class="form-label">Endereço</label>
              <input type="text" v-model="aluno.endereco" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Telefone</label>
              <input type="text" v-model="aluno.telefone" class="form-control">
            </div>
          </div>

          <h5 class="mb-3 text-secondary border-bottom pb-2">Histórico de Faixas</h5>
          <div class="mb-4">
            <div v-if="!aluno.faixasHistorico || aluno.faixasHistorico.length === 0" class="text-muted mb-2">
              Nenhuma faixa registrada ainda. Adicione registros abaixo.
            </div>

            <div v-for="(h, idx) in aluno.faixasHistorico" :key="idx" class="row g-3 align-items-end mb-2">
              <div class="col-md-4">
                <label class="form-label">Faixa</label>
                <div class="d-flex align-items-center gap-2">
                  <select v-model="h.faixa" class="form-select">
                    <option v-for="f in faixas" :key="f" :value="f">{{ f }}</option>
                  </select>
                  <span v-if="h.faixa === aluno.faixa" class="badge bg-primary">Atual</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Data de Obtenção</label>
                <input type="date" v-model="h.dataObtencao" class="form-control">
              </div>
              <div class="col-md-2">
                <label class="form-label">Grau</label>
                <input type="number" min="0" v-model="h.grau" class="form-control">
              </div>
              <div class="col-md-2">
                <div class="d-flex flex-column gap-1">
                  <button type="button" @click="removerFaixa(idx)" class="btn btn-outline-danger">Remover</button>
                  <button v-if="h.faixa !== aluno.faixa" type="button" @click="marcarComoAtual(idx)" class="btn btn-outline-primary btn-sm">Marcar como Atual</button>
                </div>
              </div>
            </div>

            <div>
              <button type="button" @click="adicionarFaixa" class="btn btn-outline-primary btn-sm">Adicionar Faixa</button>
            </div>
          </div>

          <div v-if="isMenorDeIdade" class="p-3 mb-4 bg-light rounded border border-warning">
            <h5 class="mb-3 text-warning">Responsável (Menor de Idade)</h5>
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label">Nome do Responsável</label>
                <input type="text" v-model="aluno.responsavelNome" class="form-control">
              </div>
              <div class="col-md-4">
                <label class="form-label">CPF do Responsável</label>
                <input type="text" v-model="aluno.responsavelCpf" class="form-control">
              </div>
            </div>
          </div>

          <h5 class="mb-3 text-secondary border-bottom pb-2">Saúde</h5>
          <div class="mb-4">
            <label class="form-label">Observações de Saúde</label>
            <textarea v-model="aluno.problemasSaude" class="form-control" rows="2"></textarea>
          </div>

          <h5 class="mb-3 text-secondary border-bottom pb-2">Dados da Matrícula</h5>
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label">Faixa</label>
              <select v-model="aluno.faixa" class="form-select">
                <option v-for="f in faixas" :key="f" :value="f">{{ f }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Plano</label>
              <select v-model="aluno.plano" class="form-select">
                <option v-for="p in planos" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Dia Vencimento</label>
              <input type="date" v-model="aluno.vencimento" class="form-control">
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" @click="router.back()" class="btn btn-outline-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>