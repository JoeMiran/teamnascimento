// Exemplo no src/services/api.js
import axios from 'axios';

const api = axios.create({
  // Se estiver usando o comando 'php artisan serve' no Laravel:
  baseURL: 'http://127.0.0.1:8000/api', 
  // Se estiver usando o XAMPP puro:
  // baseURL: 'http://localhost/team-nascimento-bjj-api/public/api',
});

export default api;