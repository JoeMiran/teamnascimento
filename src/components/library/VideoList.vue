<script setup>
import { defineProps } from 'vue';

const props = defineProps({ videos: Array, loading: Boolean });

function formatDate(iso) {
  if (!iso) return 'N/A';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <div v-if="!videos || videos.length === 0" class="text-muted">Nenhum vídeo nesta categoria ainda.</div>

      <div v-for="v in videos" :key="v.id" class="card mb-3">
        <div class="row g-0 align-items-center">
          <div class="col-md-5">
            <video :src="v.url" controls style="width:100%; height:180px; object-fit:cover"></video>
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h5 class="card-title">{{ v.title }}</h5>
              <p class="card-text"><small class="text-muted">Faixa: {{ v.faixaLabel || 'Todos' }} • {{ formatDate(v.uploadedAt) }}</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
