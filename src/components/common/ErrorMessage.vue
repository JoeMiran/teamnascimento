<script setup>
// Define que este componente espera receber uma "propriedade" (prop)
// chamada 'message'
defineProps({
  message: {
    type: String,
    default: 'Ocorreu um erro inesperado.' // Uma mensagem padrão
  }
})
</script>

<template>
  <div class="alert alert-danger my-4" role="alert">
    <strong>Oops!</strong> {{ message }}
  </div>
</template>