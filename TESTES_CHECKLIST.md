# ✅ Checklist de Testes PWA - Acompanhamento

## 📌 Status Geral
- [ ] Servidor rodando em `http://localhost:4173`
- [ ] DevTools disponível (F12)
- [ ] Guias de teste acessíveis

---

## 🧪 Testes Principais

### ✅ TESTE 1: Service Worker & Manifest
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. Abra DevTools (F12)
3. Vá para: Application → Manifest
```

**Verificar:**
- [ ] Nome: "Team Nascimento BJJ"
- [ ] Start URL: "/"
- [ ] Display: "standalone"
- [ ] Icons aparecem (4 ou mais)
- [ ] Shortcuts aparecem (Alunos, Biblioteca, Dashboard)

**Service Workers:**
- [ ] Application → Service Workers
- [ ] Status: "Running" (verde)
- [ ] Escopo: "/"

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 2: Prompt de Instalação
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. Procure ícone de instalação (barra de endereço)
3. Ou: Menu (⋮) → "Instalar app"
4. Clique para instalar
```

**Verificar:**
- [ ] Ícone de instalação aparece
- [ ] Prompt de instalação é mostrado
- [ ] App instala com sucesso
- [ ] Atalho criado na tela inicial
- [ ] App abre em janela separada

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 3: Cache Storage
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. DevTools (F12)
2. Application → Storage → Cache Storage
3. Verifique caches criados
```

**Verificar:**
- [ ] `google-fonts-cache` existe
- [ ] `cdn-cache` existe
- [ ] `api-cache` existe
- [ ] `videos-cache` existe
- [ ] `sw` (Service Worker) existe
- [ ] Cada cache tem conteúdo

**Expandir e verificar conteúdo:**
- [ ] Google fonts cacheadas
- [ ] CSS/JS cacheados
- [ ] Imagens cacheadas

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 4: MODO OFFLINE (CRÍTICO!)
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. DevTools → Network
3. Procure checkbox "Offline"
4. MARQUE "Offline" ✓
5. Recarregue: Ctrl + R
```

**Verificar:**
- [ ] Página carrega sem erros
- [ ] Nenhuma requisição falha (sem vermelho)
- [ ] Pode navegar entre páginas
- [ ] Dashboard funciona
- [ ] Alunos funciona
- [ ] Biblioteca funciona

**Verificar requisições:**
- [ ] Network mostra "from cache"
- [ ] Status codes são 200 (sucesso)
- [ ] Nenhuma requisição vermelha

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 5: Pagamentos Offline
**Status:** ⏳ Pendente  
**Pré-requisito:** PaymentForm.vue integrado  
**O que fazer:**
```
1. Ative Offline (Network → Offline ✓)
2. Vá para página de pagamentos
3. Preencha formulário
4. Clique "Confirmar Pagamento"
```

**Verificar:**
- [ ] Alerta amarelo "Modo Offline" aparece
- [ ] Botão muda para "Processando..."
- [ ] Notificação: "Pagamento armazenado!"
- [ ] Mensagem: "Será sincronizado"

**Verificar armazenamento:**
```
DevTools → Storage → IndexedDB → nascimento-bjj → payments
```
- [ ] Pagamento aparece em IndexedDB
- [ ] Campo `synced: false`
- [ ] Campo `timestamp` com data

**Sincronizar após conectar:**
```
1. Desmarque "Offline"
2. Recarregue
3. Aguarde 2-3s
```
- [ ] Console: "Sincronizando..."
- [ ] Notificação: "Pagamento sincronizado!"
- [ ] IndexedDB: pagamento desaparece

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 6: Vídeos Offline
**Status:** ⏳ Pendente  
**Pré-requisito:** VideoLibraryOffline.vue integrado  
**O que fazer:**
```
1. Desmarque "Offline" (conexão ativa)
2. Vá para biblioteca de vídeos
3. Clique "Baixar" em um vídeo
4. Aguarde conclusão
```

**Verificar download:**
- [ ] Network mostra .mp4 sendo baixado
- [ ] Progresso visível
- [ ] Notificação: "Vídeo baixado!"
- [ ] Botão muda para "Remover"

**Assistir offline:**
```
1. Ative Offline (Network → Offline ✓)
2. Clique "Assistir" no vídeo
3. Player abre
```
- [ ] Player abre sem erros
- [ ] Vídeo reproduz ✅
- [ ] Controles funcionam
- [ ] Pode pausar/rewind/avançar

**Verificar Cache:**
```
DevTools → Storage → Cache Storage → videos-cache
```
- [ ] Vídeo .mp4 listado
- [ ] Pode visualizar response
- [ ] Tamanho mostra bytes

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 7: Notificações Push
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. Se pedido: "Permitir notificações?" → Clique Permitir
3. Realize ação (pagamento, etc)
```

**Verificar:**
- [ ] Primeira vez pede permissão
- [ ] Clique em "Permitir"
- [ ] Notificação aparece ao executar ação
- [ ] Notificação tem ícone correto
- [ ] Notificação tem título e descrição

**Se já bloqueou:**
```
DevTools → Application → Manifest
Clique botão ao lado de "Notifications" → Allow
```

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 8: Performance (Lighthouse)
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. DevTools (F12)
3. Aba: Lighthouse
4. Device: Mobile
5. Category: Progressive Web App
6. Clique "Analyze page load"
7. Aguarde 30-60 segundos
```

**Verificar scores:**
- [ ] PWA Score: **> 90** (ideal)
- [ ] Performance: **> 85**
- [ ] Accessibility: **> 90**
- [ ] Best Practices: **> 90**

**Se scores baixos:**
- [ ] Verificar "Opportunities"
- [ ] Faltam ícones? Criar em `public/`
- [ ] Erros no console? Verificar
- [ ] CSS não otimizado? Remover unused

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 9: Teste em Celular Real
**Status:** ⏳ Pendente  
**Pré-requisito:** Celular e PC mesma WiFi  
**Passo 1: Descobrir IP**
```bash
# Windows CMD
ipconfig
# Procure: IPv4 Address: 192.168.X.X
```

**Passo 2: Acessar no celular**
```
Navegador → http://192.168.X.X:4173
```

**Passo 3: Instalar app**

**Android (Chrome):**
- [ ] Menu (⋮) → Instalar app
- [ ] Confirma
- [ ] App na tela inicial ✅

**iPhone (Safari):**
- [ ] Compartilhar (⬆️)
- [ ] Adicionar à tela inicial
- [ ] Confirma
- [ ] App como ícone ✅

**Passo 4: Testar offline**
- [ ] Ativa modo avião ✈️
- [ ] Abre app
- [ ] Funciona completamente ✅
- [ ] Desativa modo avião
- [ ] Dados sincronizam ✅

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 10: Sincronização Automática
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Ative Offline
2. Faça ações (pagamento, etc)
3. Desative Offline
4. Aguarde sincronização
```

**Verificar sincronização:**
```
DevTools → Console
```
- [ ] Logs: "Sincronizando..."
- [ ] Logs: "✅ Sincronizado!"
- [ ] Notificação aparece

**Verificar dados:**
```
DevTools → Storage → IndexedDB
```
- [ ] Entradas pendentes desaparecem
- [ ] Foram para servidor ✅

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 11: Debugging Console
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. DevTools (F12)
3. Aba: Console
4. Procure por logs e erros
```

**Você deve ver (verde):**
- [ ] "[Service Worker] Instalando..."
- [ ] "[Service Worker] Ativando..."
- [ ] "[Service Worker] Carregado com sucesso!"
- [ ] "✅ Service Worker registrado"
- [ ] "📲 Prompt de instalação disponível"

**NÃO deve aparecer (vermelho):**
- [ ] ❌ Erros
- [ ] ❌ CORS errors
- [ ] ❌ 404 Not Found
- [ ] ❌ Warnings críticos

**✅ Marque aqui quando completo:** ___________

---

### ✅ TESTE 12: Atualizações Automáticas
**Status:** ⏳ Pendente  
**O que fazer:**
```
1. Acesse http://localhost:4173
2. DevTools → Console
3. Recarregue página (Ctrl + R)
4. Observe logs de update
```

**Verificar:**
- [ ] Console: "Checking for updates..."
- [ ] Service Worker verifica versão nova
- [ ] Se houver: "New version available!"
- [ ] Pode atualizar manualmente

**Testar atualização real:**
```
1. Faça mudança no código
2. npm run build
3. Recarregue página
4. Service Worker detecta
5. Oferece atualizar
```
- [ ] Nova versão baixada
- [ ] Notificação oferecida
- [ ] Ao recarregar: versão nova ✅

**✅ Marque aqui quando completo:** ___________

---

## 📊 Resumo Final

### Status dos Testes:
- [ ] 1️⃣ Service Worker & Manifest
- [ ] 2️⃣ Prompt de Instalação
- [ ] 3️⃣ Cache Storage
- [ ] 4️⃣ Modo Offline
- [ ] 5️⃣ Pagamentos Offline
- [ ] 6️⃣ Vídeos Offline
- [ ] 7️⃣ Notificações
- [ ] 8️⃣ Lighthouse
- [ ] 9️⃣ Celular Real
- [ ] 🔟 Sincronização
- [ ] 1️⃣1️⃣ Console
- [ ] 1️⃣2️⃣ Atualizações

### Resultado Geral:
```
Total: ____ de 12 testes completos

Se todos ✅: PWA está 100% funcional! 🎉
Se alguns ⏳: Continue testando e corrigindo
Se muitos ❌: Revise guia TESTING_GUIDE.md
```

---

## 🎯 Próximos Passos Após Testes

1. **✅ Todos testes passando?**
   - [ ] Sim → Vá para Deploy

2. **❌ Algum teste falhando?**
   - [ ] Sim → Verifique erros em console
   - [ ] [ ] Consulte TESTING_GUIDE.md
   - [ ] [ ] Procure solução em guia

3. **📝 Deploy em Produção**
   - [ ] Criar ícones profissionais
   - [ ] Configurar HTTPS (obrigatório)
   - [ ] Deploy em servidor
   - [ ] Testar em produção

---

## 📞 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Service Worker não aparece | Recarregue, aguarde 3s, verifique console |
| Manifest com erro | Validar JSON, copiar para [JSONLint](https://jsonlint.com/) |
| Ícones não aparecem | Criar 4 PNGs em `public/`, recarregar |
| Offline não funciona | Verificar Network → Offline ✓, recarregar |
| Pagamento não armazena | Verifique console, IndexedDB habilitado |
| Vídeo não baixa | URL válida? CORS? Conexão ativa? |
| Notificação não aparece | Permitir em DevTools, verificar permissões SO |

---

## ✨ Status Atual

**Data de Início:** _________________  
**Última Atualização:** _________________  
**Testes Completos:** ____ de 12  
**% Conclusão:** _____%

---

Boa sorte! 🚀 Qualquer dúvida, veja os guias:
- 📖 **TESTING_GUIDE.md** - Instruções detalhadas
- 🌐 **testing-guide.html** - Versão visual interativa
- 💾 **Arquivo de saída:** Este arquivo ✅

