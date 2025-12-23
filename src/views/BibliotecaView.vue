<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import LibraryService from '@/services/LibraryService.js';

const router = useRouter();
const categorias = ref([]);

onMounted(async () => {
  const res = await LibraryService.getCategories();
  categorias.value = res.data;
});

function abrirCategoria(cat) {
  // transforma em slug simples (poderia ser melhorado)
  const slug = encodeURIComponent(cat);
  router.push(`/biblioteca/${slug}`);
}
</script>

<template>
  <div>
    <h1 class="display-5 mb-4">Biblioteca de Técnicas</h1>

    <div class="row g-3">
      <div v-for="c in categorias" :key="c" class="col-md-4">
        <div class="card h-100" style="cursor: pointer;" @click="abrirCategoria(c)">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <i class="bi bi-book-half fs-1 mb-3"></i>
            <h5 class="card-title">{{ c }}</h5>
            <p class="text-muted small text-center">Clique para ver as aulas desta categoria</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { transition: transform .12s ease-in-out; }
.card:hover { transform: translateY(-4px); }
</style>
