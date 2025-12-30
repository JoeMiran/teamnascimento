# 🧪 Guia Interativo de Testes PWA

## ✅ Servidor rodando em: http://localhost:4173

---

## 🔍 TESTE 1: Verificar Service Worker e Manifest

### Passo 1: Abra DevTools
1. Acesse `http://localhost:4173`
2. Pressione **F12** para abrir DevTools
3. Vá para aba **Application** (Chrome/Edge)

### Passo 2: Verificar Manifest
```
Application → Manifest
```

**O que você deve ver:**
```
✅ Name: Team Nascimento BJJ
✅ Short name: Nascimento BJJ
✅ Start URL: /
✅ Display: standalone
✅ Theme color: #1a1a1a
✅ Icons: 4 ícones listados
✅ Shortcuts: 3 atalhos (Alunos, Biblioteca, Dashboard)
```

**Se estiver vermelho/erro:**
- Verifique se manifest.json está em `public/`
- Check console por mensagens de erro

### Passo 3: Verificar Service Worker
```
Application → Service Workers
```

**O que você deve ver:**
```
✅ Status: Running (verde)
✅ Scope: /
✅ URL: /sw.js (ou similar)
✅ Update on reload: (marcado)
```

**Se não aparecer:**
- Recarregue a página (Ctrl + R)
- Aguarde 2-3 segundos
- Service Worker demora um pouco para registrar

---

## 🏠 TESTE 2: Verificar Prompt de Instalação

### Passo 1: Verificar Console
```
F12 → Console
```

**Você deve ver logs como:**
```
✅ Service Worker Carregado com sucesso!
✅ ✅ Service Worker registrado: ServiceWorkerRegistration {...}
✅ 📲 Prompt de instalação disponível
```

### Passo 2: Procurar ícone de instalação

**No Chrome/Edge:**
- Clique no ícone 🔧 (à direita da URL)
- Procure por "Install" ou "Instalar app"
- **OU** Menu (⋮) → "Instalar app"

**Se não aparecer:**
- Pode ser por falta de ícones em `public/`
- Crie os 4 ícones PNG (veja abaixo)

### Passo 3: Instale o app
1. Clique em "Instalar"
2. Confirme
3. App vai abrir em janela separada
4. Atalho aparece na tela inicial

---

## 📱 TESTE 3: Verificar Cache Storage

### Verificar Caches Criados
```
Application → Storage → Cache Storage
```

**Você deve ver:**
```
✅ google-fonts-cache
✅ cdn-cache
✅ api-cache
✅ videos-cache
✅ sw:...sw.js (Service Worker)
```

**Expandir cache e ver conteúdo:**
- Clique em cada cache
- Deve listar requests cacheadas
- Pode visualizar response

---

## 🌐 TESTE 4: TESTE OFFLINE - O Mais Importante!

### Passo 1: Ativar Modo Offline
```
DevTools → F12 → Network (aba)
```

**No topo da aba Network:**
- Procure por checkbox "Offline" 
- **OU** "Network throttling" → selecione "Offline"
- **OU** em alguns navegadores: "No throttling" → "Offline"

### Passo 2: Recarregar página (Ctrl + R)
**Esperado:** Página continua funcionando ✅

**Se der erro:**
- Service Worker pode não estar ativado
- Verifique aba "Service Workers"
- Tente novamente

### Passo 3: Testar Navegação
- [ ] Clique em "Dashboard" - funciona?
- [ ] Clique em "Alunos" - funciona?
- [ ] Clique em "Biblioteca" - funciona?

### Passo 4: Verificar Fallback Offline
```
Network (aba) → veja as requisições
```

**Você deve ver:**
- Requisições aparecendo como **from cache** 📦
- Não aparecer requisições vermelhas
- Status 200 (sucesso)

---

## 💳 TESTE 5: Pagamentos Offline

### Se você já integrou PaymentForm.vue:

#### Passo 1: Ativar Offline Mode
```
DevTools → Network → Offline ✓
```

#### Passo 2: Ir para página de pagamento
1. Acesse a página que tem `<PaymentForm />`
2. Preencha formulário:
   - Valor: 199.90
   - Aluno: qualquer um
   - Método: Cartão

#### Passo 3: Clicar em "Confirmar Pagamento"
**Esperado:**
```
✅ Alerta: "Modo Offline: Seu pagamento será sincronizado..."
✅ Botão muda para "Processando..."
✅ Após 2s: "Pagamento armazenado!"
✅ Notificação: "Será sincronizado quando conectado"
```

#### Passo 4: Verificar armazenamento
```
DevTools → Storage → IndexedDB → nascimento-bjj → payments
```

**Você deve ver:**
```
✅ Entrada com dados do pagamento
✅ Campo: timestamp
✅ Campo: synced: false
```

#### Passo 5: Desativar Offline
1. Desmarque "Offline" em Network
2. Recarregue página
3. Service Worker deve sincronizar automaticamente

**Aguarde e verifique:**
```
✅ Console: "Sincronizando pagamentos"
✅ Notificação: "Pagamento sincronizado!"
✅ IndexedDB: pagamento removido (foi para servidor)
```

---

## 🎥 TESTE 6: Vídeos Offline

### Se você já integrou VideoLibraryOffline.vue:

#### Passo 1: Conexão online
```
DevTools → Network → Offline ☐ (DESATIVADO)
```

#### Passo 2: Ir para biblioteca de vídeos
1. Acesse página com `<VideoLibraryOffline />`
2. Procure por um vídeo
3. Clique em botão "Baixar"

#### Passo 3: Acompanhar download
```
DevTools → Network
```

**Você deve ver:**
```
✅ Arquivo .mp4 sendo baixado
✅ Barra de progresso: "Baixando..."
✅ Após conclusão: notificação "Vídeo baixado!"
✅ Botão muda para "Remover"
```

#### Passo 4: Ativar Offline
```
DevTools → Network → Offline ✓
```

#### Passo 5: Assistir vídeo offline
1. Clique em "Assistir" no vídeo baixado
2. Player abre
3. Vídeo deve reproduzir ✅

**Se não reproduzir:**
- Verifique se download completou
- Verifique cache em: `Cache Storage → videos-cache`

---

## 📊 TESTE 7: Verificar Storage Completo

### Verificar quanto espaço está sendo usado

```
DevTools → Application → Storage
```

**Você vai ver:**
```
Cookies: 0 B
Session Storage: 0 B
Local Storage: XXX B
IndexedDB: XXX B
Cache Storage: XXX MB
```

**Storage limit:**
- Chrome: ~50% do espaço livre do disco
- Firefox: ~10GB
- Safari: ~50MB

---

## 🔔 TESTE 8: Notificações Push

### Ativar Notificações
1. Ao abrir app pela primeira vez, pode pedir permissão
2. Clique "Permitir"

**Se já bloqueou:**
```
DevTools → Application → Manifest → ☐ Notifications
(clicar para permitir)
```

### Testar Notificação
- [ ] Realizar pagamento → deve notificar
- [ ] Fazer ação importante → deve notificar
- [ ] Abrir DevTools → ver notificações enviadas

---

## 🚀 TESTE 9: Performance (Lighthouse)

### Executar Audit
```
DevTools → F12 → Lighthouse (aba)
```

**Configuração:**
```
- Device: Mobile
- Category: Progressive Web App
- Clique: Analyze page load
```

**Métricas que importam:**
```
✅ PWA Score: > 90 (ideal)
✅ First Contentful Paint: < 3s
✅ Largest Contentful Paint: < 4s
✅ Cumulative Layout Shift: < 0.1
```

**Se score baixo:**
- Podem estar faltando ícones
- Verificar console por erros
- Remover assets não usados

---

## 📱 TESTE 10: Em Dispositivo Móvel Real

### Pré-requisito:
- Celular e PC na mesma rede WiFi
- Obtém IP do seu PC (comando abaixo)

### Passo 1: Descobrir IP da sua máquina
```bash
# Windows (CMD)
ipconfig

# Procure por "IPv4 Address" sob sua conexão WiFi
# Exemplo: 192.168.1.100
```

### Passo 2: Acessar no celular
1. No celular, abra navegador
2. Acesse: `http://192.168.1.100:4173`
   (substitua 192.168.1.100 pelo seu IP)

### Passo 3: Instalar app
**Android (Chrome):**
```
Menu (⋮) → Instalar app → Adicionar
↓
App aparece na tela inicial
```

**iPhone (Safari):**
```
Compartilhar (canto inf direito) 
→ Adicionar à tela inicial
→ Adicionar
↓
App aparece na tela inicial como ícone
```

### Passo 4: Testar offline
1. Ativa modo avião ✈️
2. Abre app
3. Deve funcionar completamente
4. Desativa modo avião
5. Deve sincronizar dados

---

## 🐛 TESTE 11: Debugging Avançado

### Ver logs do Service Worker
```
DevTools → Application → Service Workers
→ Clique em seu Service Worker
→ Aba "Console"
```

**Você verá logs como:**
```
[Service Worker] Instalando...
[Service Worker] Ativando...
[Service Worker] Carregado com sucesso!
```

### Ver requisições interceptadas
```
DevTools → Application → Service Workers
→ Inspect (em cima do Service Worker)
```

Nova aba abre mostrando o scope do Service Worker.

### Simular perda de conexão rápida
```
Network → No throttling → Slow 3G
```

Isso simula conexão lenta - pagamentos vão timeout e usar cache.

---

## ✨ TESTE 12: Atualizar Aplicação

### Como PWA atualiza automaticamente:

**Primeira vez:**
- Service Worker é instalado
- Cache é preenchido
- Tudo fica disponível offline

**Próximas vezes:**
- Acessa `registerSW.js` (cada carregamento)
- Verifica se há atualizações
- Se houver, baixa em background
- Na próxima visita, usa versão nova

**Ver atualização em ação:**
```
1. Acesse app
2. Console mostra: "Checking for updates..."
3. Espere 10-15 segundos
4. Se houver nova versão: "New version available!"
5. Recarregue página (Ctrl + R)
6. Nova versão carrega
```

---

## 📋 Checklist de Testes

- [ ] **Manifest** - Aparece correto em Application → Manifest
- [ ] **Service Worker** - Status "Running" em Application → Service Workers
- [ ] **Cache Storage** - Vários caches aparecem em Cache Storage
- [ ] **Offline Mode** - Page funciona em modo offline
- [ ] **Pagamento Offline** - Se implementado, armazena e sincroniza
- [ ] **Vídeos Offline** - Se implementado, baixa e reproduz offline
- [ ] **Notificações** - Notificações funcionam ao executar ações
- [ ] **Mobile Install** - Aparece prompt de instalação e instala
- [ ] **Mobile Offline** - App funciona offline em celular
- [ ] **Lighthouse Score** - PWA score > 90
- [ ] **Sincronização** - Dados sincronizam quando volta online
- [ ] **Performance** - App responde rápido

---

## 🎯 Se Algo Não Funcionar

### Service Worker não aparece:
1. Recarregue a página (Ctrl + R)
2. Aguarde 3 segundos
3. Verifique console
4. Se erro: algo está quebrado no código

### Manifest com erro:
1. Verifique se `public/manifest.json` existe
2. Valide JSON: [JSONLint](https://jsonlint.com/)
3. Se tiver erro: copie conteúdo para validador

### Ícones não aparecem:
1. Crie 4 ícones em PNG
2. Salve em `public/`:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `pwa-maskable-192x192.png`
   - `pwa-maskable-512x512.png`
3. Recarregue página

### Pagamento não armazena offline:
1. Verifique se IndexedDB está habilitado
2. Veja se há erro no console
3. Teste com Network offline ativo

### Vídeo não baixa:
1. Verifique se URL do vídeo é válida
2. Veja se há erro CORS em console
3. Teste com URL pública (não localhost)

---

## 💬 Dúvidas Frequentes

**P: Por que Service Worker demora para aparecer?**
R: O navegador registra de forma assíncrona. Aguarde 2-3 segundos.

**P: Perdi meus testes quando recarreguei?**
R: Dados no IndexedDB/Cache persistem. Se desapareceram, talvez tenha limpado storage.

**P: Como limpar tudo e começar do zero?**
A: `DevTools → Application → Storage → Clear site data`

**P: Funciona em navegadores antigos?**
R: PWA funciona em navegadores modernos (Chrome, Edge, Firefox, Safari). IE 11 não suporta.

**P: Posso testar em HTTPS local?**
R: Sim, com localhost funciona sem HTTPS. Para IP real precisa HTTPS.

---

## 🎓 Próximo Passo Após Testes

Se tudo funciona:
1. ✅ Integrars seus dados reais (API)
2. ✅ Criar ícones profissionais
3. ✅ Testar em celular real
4. ✅ Fazer deploy em HTTPS
5. ✅ Publicar na app store (opcional)

Boa sorte! 🚀
