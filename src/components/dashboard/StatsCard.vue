<script setup>
import { computed } from 'vue'; // Precisamos do computed

// 1. Define as "props"
const props = defineProps({
  titulo: String,
  valor: [String, Number],
  icone: String,
  cor: String,
  isCurrency: { // <-- 2. A NOVA PROP (padrão é 'false')
    type: Boolean,
    default: false
  }
});

// 3. Formatação condicional
const formatarValor = computed(() => {
  if (props.isCurrency) {
    // Se for dinheiro, formata como R$
    return props.valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }
  // Se não, formata como um número inteiro
  return props.valor.toLocaleString('pt-BR');
});
</script>

<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div :class="`text-xs font-weight-bold text-${cor} text-uppercase mb-1`">
            {{ titulo }}
          </div>
          <div class="h5 mb-0 font-weight-bold text-gray-800">
            {{ formatarValor }}
          </div>
        </div>
        <div class="col-auto">
          <i :class="[icone, `fs-2 text-muted`]"></i> </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (Estilos 'text-gray-800' e 'text-xs' continuam como antes) */
/* Atualiza o 'text-muted' para o tema claro */
.text-muted {
  color: #6c757d !important;
}
.text-xs { font-size: 0.7rem; }
.text-gray-800 { color: #5a5c69; }
.shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important; }
</style>