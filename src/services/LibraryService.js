// Serviço simulado para a Biblioteca de Técnicas
// Armazena categorias e vídeos em memória. O "upload" cria um Blob URL

function simularDemora(resultado, tempo = 300) {
  return new Promise(resolve => setTimeout(() => resolve({ data: resultado }), tempo));
}

const categories = [
  'Raspagens',
  'Quedas',
  'Finalizações',
  'Passagem',
  'Defesa Pessoal'
];

// Estrutura: { [category]: [ { id, title, faixaLabel, url, uploadedAt } ] }
const videos = {};
categories.forEach(c => videos[c] = []);

let nextId = 1;

export default {
  getCategories() {
    return simularDemora([...categories]);
  },

  getVideosByCategory(category) {
    const lista = videos[category] || [];
    // Retorna cópia para evitar mutações externas
    return simularDemora(lista.map(v => ({ ...v })), 250);
  },

  // upload: aceita File (do input). Como não há backend, usamos URL.createObjectURL
  async uploadVideo(category, { title, faixaLabel, file }) {
    if (!categories.includes(category)) throw new Error('Categoria inválida');
    const url = file ? URL.createObjectURL(file) : '';
    const novo = {
      id: nextId++,
      title: title || 'Sem título',
      faixaLabel: faixaLabel || '',
      url,
      uploadedAt: new Date().toISOString()
    };
    videos[category].push(novo);
    return simularDemora(novo, 500);
  }
};
