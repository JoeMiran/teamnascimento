<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="sidebar">
    <RouterLink to="/" class="sidebar-logo">
      <span>Team Nascimento BJJ</span>
    </RouterLink>

    <ul class="nav-menu">
      <li class="nav-item">
        <RouterLink to="/" class="nav-link">
          <i class="bi bi-bar-chart-line-fill"></i>
          <span>Dashboard</span>
        </RouterLink>
      </li>

      <li class="nav-item">
        <RouterLink to="/alunos" class="nav-link">
          <i class="bi bi-people-fill"></i>
          <span>Gestão de Alunos</span>
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/frequencia" class="nav-link">
          <i class="bi bi-calendar-check-fill"></i>
          <span>Frequência</span>
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/alunos/novo" class="nav-link">
          <i class="bi bi-person-plus-fill"></i>
          <span>Cadastrar Aluno</span>
        </RouterLink>
      </li>
      
      <li class="nav-item">
        <RouterLink to="/relatorios" class="nav-link">
          <i class="bi bi-cash-coin"></i>
          <span>Relatório Financeiro</span>
        </RouterLink>
      </li>
      
      <li class="nav-item">
        <RouterLink to="/biblioteca" class="nav-link">
          <i class="bi bi-book-half"></i>
          <span>Biblioteca de Técnicas</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Estilização Profissional do Sidebar (Tema Escuro/Preto) */
.sidebar {
  width: 280px;
  /* Cor de fundo preta/cinza escuro, como pediste */
  background-color: var(--bjj-cinza); 
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #444;
}

.sidebar-logo {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--bjj-texto-claro); /* Texto claro no fundo escuro */
  text-decoration: none;
  margin-bottom: 2rem;
  text-align: center;
}
.sidebar-logo i {
  color: var(--bjj-vermelho); /* Ícone vermelho */
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--bjj-texto-claro); /* Texto claro */
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.nav-link i {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 25px; /* Alinha os ícones */
  text-align: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* O Vue Router adiciona esta classe automaticamente à rota ativa */
.nav-link.router-link-exact-active {
  background-color: var(--bjj-vermelho); /* Fundo vermelho */
  color: #fff;
  font-weight: 700;
}

.nav-link.disabled {
  color: #888;
  pointer-events: none;
}
</style>