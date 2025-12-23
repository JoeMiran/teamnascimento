<script setup>
import { RouterView } from 'vue-router';
import Sidebar from '@/components/layout/Sidebar.vue'; // Importa o nosso menu
</script>

<template>
  <div class="app-layout">
    <Sidebar />

    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
}

.main-content {
  /* Ocupa o resto do espaço (descontando os 280px do sidebar) */
  margin-left: 280px; 
  /* Garante que o conteúdo pode crescer */
  flex-grow: 1; 
  /* Espaçamento interno da página */
  padding: 2rem;
  width: calc(100% - 280px);
  min-height: 100vh;
}
</style>