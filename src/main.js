// Em: src/main.js

// 1. Importa os Estilos (CSS/JS do Bootstrap)
// Estes imports estão corretos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/theme.css";
// 2. Importa o Vue e os teus ficheiros principais
import { createApp } from 'vue';
import App from './App.vue';       // O "molde" principal da tua app
import router from './router';   // O teu sistema de rotas (páginas)

// 3. Cria a aplicação
const app = createApp(App);

// 4. Diz à aplicação para USAR o router
app.use(router);

// 5. (O PASSO MAIS IMPORTANTE) Monta a aplicação no <div id="app">
//    que está no teu index.html
app.mount('#app');