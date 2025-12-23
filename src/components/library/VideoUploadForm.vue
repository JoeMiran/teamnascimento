<script setup>
import { ref } from 'vue';
import LibraryService from '@/services/LibraryService.js';

const props = defineProps({ category: String });
const emit = defineEmits(['uploaded']);

const title = ref('');
const faixaLabel = ref('');
const file = ref(null);
const uploading = ref(false);
const error = ref(null);

const faixas = ['Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta', 'Coral', 'Vermelha'];

function handleFile(e) { file.value = e.target.files[0] || null; }

async function submit() {
  if (!file.value) { error.value = 'Selecione um arquivo de vídeo.'; return; }
  uploading.value = true; error.value = null;
  try {
    await LibraryService.uploadVideo(props.category, { title: title.value, faixaLabel: faixaLabel.value, file: file.value });
    title.value = ''; faixaLabel.value = ''; file.value = null;
    // limpa input file
    const input = document.getElementById('video-file-input'); if (input) input.value = '';
    emit('uploaded');
  } catch (err) { error.value = 'Erro ao subir vídeo.'; }
  finally { uploading.value = false; }
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <strong>Enviar Vídeo</strong>
    </div>
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div class="mb-2">
        <label class="form-label">Título</label>
        <input v-model="title" class="form-control" placeholder="Ex: Kimura na Guarda" />
      </div>

      <div class="mb-2">
        <label class="form-label">Faixa (label)</label>
        <select v-model="faixaLabel" class="form-select">
          <option value="">Todos</option>
          <option v-for="f in faixas" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Arquivo de vídeo</label>
        <input id="video-file-input" type="file" accept="video/*" @change="handleFile" class="form-control" />
      </div>

      <div class="d-grid">
        <button class="btn btn-primary" @click="submit" :disabled="uploading">{{ uploading ? 'Enviando...' : 'Enviar' }}</button>
      </div>
    </div>
  </div>
</template>
