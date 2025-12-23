<script setup>
import { ref, onMounted } from 'vue';
import AlunoService from '@/services/AlunoService.js';

const alunos = ref([]);
const loading = ref(true);
const todaysCounts = ref({});

function todayISO() {
  return new Date().toISOString().slice(0,10);
}

function isSameDate(iso, dateISO) {
  if (!iso) return false;
  return iso.slice(0,10) === (dateISO || todayISO());
}

async function loadAlunos() {
  loading.value = true;
  const res = await AlunoService.getAlunos();
  const list = res.data || [];

  const detailed = await Promise.all(list.map(async (a) => {
    const r = await AlunoService.getAlunoById(a.id);
    const det = r.data || {};
    const total = (det.presencas && det.presencas.length) || 0;
    const hoje = todayISO();
    const todayCount = (det.presencas || []).filter(p => isSameDate(p.date, hoje)).length;
    todaysCounts.value[a.id] = todayCount;
    return { ...a, detalhes: det, totalPresencas: total };
  }));

  detailed.sort((x,y) => x.nome.localeCompare(y.nome, 'pt-BR'));
  alunos.value = detailed;
  loading.value = false;
}

onMounted(loadAlunos);

async function confirmPresencas() {
  const hoje = todayISO();
  for (const al of alunos.value) {
    const desired = Number(todaysCounts.value[al.id] || 0);
    const existing = (al.detalhes && al.detalhes.presencas)
      ? (al.detalhes.presencas.filter(p => isSameDate(p.date, hoje)).length)
      : 0;

    if (desired > existing) {
      const times = desired - existing;
      for (let i=0;i<times;i++) {
        // grava com timestamp atual
        await AlunoService.addPresenca(al.id, { dateISO: new Date().toISOString() });
      }
    }
    // se desired < existing: não removemos aqui (poderíamos implementar remoção se desejar)
  }

  await loadAlunos();
  alert('Presenças de hoje registradas.');
}
</script>

<template>
  <div>
    <h1 class="display-5 mb-4">Frequência — {{ todayISO() }}</h1>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <div class="card">
        <div class="card-body p-0">
          <table class="table mb-0">
            <thead class="table-light">
              <tr>
                <th>Nome</th>
                <th>Faixa</th>
                <th style="width:180px; text-align:center">Presenças (hoje)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="al in alunos" :key="al.id">
                <td>{{ al.nome }}</td>
                <td>{{ al.faixa }}</td>
                <td class="text-center">
                  <div class="d-flex justify-content-center align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" @click.prevent="todaysCounts[al.id] = Math.max(0, (todaysCounts[al.id]||0)-1)">-</button>
                    <input type="number" min="0" v-model.number="todaysCounts[al.id]" class="form-control form-control-sm text-center" style="width:80px" />
                    <button class="btn btn-sm btn-outline-secondary" @click.prevent="todaysCounts[al.id] = (todaysCounts[al.id]||0)+1">+</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <small class="text-muted">As presenças aqui registradas são para a data mostrada. No próximo dia a lista reinicia (sem dados preenchidos).</small>
          <div>
            <button class="btn btn-outline-secondary me-2" @click="loadAlunos">Recarregar</button>
            <button class="btn btn-primary" @click="confirmPresencas">Confirmar presenças de hoje</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
