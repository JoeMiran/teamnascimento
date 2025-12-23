<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LibraryService from '@/services/LibraryService.js';
import VideoList from '@/components/library/VideoList.vue';
import VideoUploadForm from '@/components/library/VideoUploadForm.vue';

const route = useRoute();
const category = decodeURIComponent(route.params.category || '');
const videos = ref([]);
const loading = ref(true);

async function load() {
  loading.value = true;
  const res = await LibraryService.getVideosByCategory(category);
  videos.value = res.data;
  loading.value = false;
}

onMounted(load);

async function handleUploaded() {
  await load();
}
</script>

<template>
  <div>
    <h1 class="display-5 mb-4">{{ category }}</h1>

    <div class="row">
      <div class="col-md-8">
        <VideoList :videos="videos" :loading="loading" />
      </div>
      <div class="col-md-4">
        <VideoUploadForm :category="category" @uploaded="handleUploaded" />
      </div>
    </div>
  </div>
</template>
