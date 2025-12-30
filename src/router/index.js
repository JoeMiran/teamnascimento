// Em: src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
// 1. Importa as novas views
import RelatorioAnualView from '../views/RelatorioAnualView.vue'
import AlunosView from '../views/Matricula.vue'
// Views usadas nas rotas de criação/edição de aluno
import AlunoCreateView from '../views/AlunoCreateView.vue'
import AlunoEditView from '../views/AlunoEditView.vue'
import BibliotecaView from '../views/BibliotecaView.vue'
import BibliotecaCategoryView from '../views/BibliotecaCategoryView.vue'
import FrequenciaView from '../views/FrequenciaView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    // 2. Adiciona a rota de Relatórios
    {
      path: '/relatorios',
      name: 'relatorios',
      component: RelatorioAnualView
    },
    // 3. Adiciona a rota de Alunos
    {
      path: '/alunos',
      name: 'alunos',
      component: AlunosView
    },
    {
      path: '/alunos/novo',
      name: 'alunos-novo',
      component: AlunoCreateView
    },
    // ROTA DE EDIÇÃO:
    {
      path: '/alunos/:id/editar',
      name: 'alunos-editar',
      component: AlunoEditView
    }
    ,
    // Biblioteca de técnicas
    {
      path: '/biblioteca',
      name: 'biblioteca',
      component: BibliotecaView
    },
    {
      path: '/biblioteca/:category',
      name: 'biblioteca-categoria',
      component: BibliotecaCategoryView,
      props: true
    }
    ,
    {
      path: '/frequencia',
      name: 'frequencia',
      component: FrequenciaView
    }
  ]
})

export default router