# 🔧 Troubleshooting & FAQ - Testes PWA

## ❓ FAQ - Perguntas Frequentes

### P: Por que o Service Worker demora para aparecer?
**R:** O navegador registra Service Workers de forma assíncrona. Aguarde 2-3 segundos após recarregar. Se ainda não aparecer, verifique o console (F12) por erros.

**Solução:**
1. Recarregue a página (Ctrl + R)
2. Aguarde 3 segundos
3. Verifique Application → Service Workers
4. Se tiver erro, veja console

---

### P: Perdi meus dados quando recarreguei a página!
**R:** Dados no IndexedDB e Cache devem persistir. Se desapareceram, você pode ter:
- Limpado o site data (DevTools → Storage → Clear Site Data)
- Entrado em modo incógnito
- Deletado cache da aplicação

**Solução:**
```
DevTools → Application → Storage
Marque: Cookies, Storage, Cache
Clique: Clear Site Data

Depois recarregue (Ctrl + R)
```

---

### P: Como limpar tudo e começar do zero?
**R:** Para resetar completamente e começar os testes do zero:

```
1. DevTools → F12
2. Application → Storage
3. Marque tudo:
   ☑ Cookies
   ☑ Storage
   ☑ Cache
4. Clique "Clear Site Data"
5. Recarregue página (Ctrl + R)
```

---

### P: Funciona em navegadores antigos?
**R:** PWA funciona em navegadores **modernos**:
- ✅ Chrome 40+ (melhor suporte)
- ✅ Edge 17+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ❌ Internet Explorer 11 (não suporta)

Se seus alunos usam IE, infelizmente não funciona.

---

### P: Por que não consigo testar em localhost com HTTPS?
**R:** Localhost é exceção - funciona sem HTTPS. Para IP real (tipo 192.168.1.100) você precisa HTTPS.

**Teste seguro em localhost:**
```
http://localhost:4173  ✅ Funciona
http://192.168.1.100:4173  ⚠️ PWA não funciona (sem HTTPS)
```

---

### P: Quando faço deploy, PWA funciona em HTTPS?
**R:** Sim, mas precisa de certificado SSL válido. Opções:
- Let's Encrypt (gratuito)
- Cloudflare (gratuito)
- AWS Certificate Manager (gratuito)

Sem HTTPS válido, PWA não funciona em produção.

---

## 🐛 Troubleshooting - Problemas Específicos

### ❌ Problema: Service Worker não registra

**Sintomas:**
- Application → Service Workers está vazio
- Console mostra erros

**Causas possíveis:**
1. Arquivo `sw.js` não existe ou está inacessível
2. Erro de sintaxe em `vite.config.js`
3. Console mostra erro de CORS ou outro

**Soluções:**

```
1. Verifique se arquivo existe:
   Deve ter arquivo em: dist/sw.js (após npm run build)
   
2. Verifique console por erro específico:
   F12 → Console → leia mensagem de erro
   
3. Se erro de CORS:
   └─ Pode ser problema com proxy, tente em navegador diferente
   
4. Resetar tudo:
   npm run build
   npm run preview
   Aguarde 3 segundos
   Recarregue (Ctrl + R)
```

---

### ❌ Problema: Manifest mostra erro (vermelho)

**Sintomas:**
- Application → Manifest mostra ⚠️ Erro
- Mensagem de erro sobre JSON

**Causas:**
1. JSON inválido em `public/manifest.json`
2. Arquivo não existe
3. Caminho errado em `index.html`

**Soluções:**

```
1. Verificar se arquivo existe:
   public/manifest.json ← Deve estar AQUI
   
2. Validar JSON:
   - Copie conteúdo de manifest.json
   - Paste em https://jsonlint.com/
   - Se mostrar erro, copie mensagem de erro
   - Corrija no arquivo
   
3. Verifique link no index.html:
   <link rel="manifest" href="/manifest.json">
   ↑ Deve ter "/" antes do nome
```

---

### ❌ Problema: Ícones não aparecem

**Sintomas:**
- Application → Manifest mostra "No icons"
- Ícone de instalação não aparece no navegador

**Causas:**
1. Faltam arquivos PNG em `public/`
2. Caminhos errados no manifest.json
3. Ícones não são PNG válido

**Soluções:**

```
1. Criar os 4 ícones PNG necessários:
   public/pwa-192x192.png
   public/pwa-512x512.png
   public/pwa-maskable-192x192.png
   public/pwa-maskable-512x512.png
   
2. Usar ferramenta: https://www.pwabuilder.com/
   - Faça upload de uma imagem
   - Baixa os 4 ícones já pronto
   - Salva em public/
   
3. Recarregue página e aguarde 3s
   F12 → Application → Manifest
   Ícones devem aparecer agora
```

---

### ❌ Problema: Modo Offline não funciona

**Sintomas:**
- Marque Offline em Network
- Recarregue página
- Dá erro 404 ou tela branca

**Causas:**
1. Service Worker não está registrado
2. Service Worker tem erro
3. Build não foi feito

**Soluções:**

```
1. Verificar Service Worker:
   F12 → Application → Service Workers
   Status deve ser "Running" (verde)
   
2. Se não estiver rodando:
   a) Recarregue página (Ctrl + R)
   b) Aguarde 3 segundos
   c) Deve aparecer agora
   
3. Se ainda não funciona:
   npm run build    ← Rebuild obrigatório
   npm run preview  ← Reiniciar servidor
   Aguarde 5 segundos
   Recarregue no navegador
   
4. Como último recurso:
   Clear Site Data (veja "Como limpar tudo")
   Recarregue tudo
```

---

### ❌ Problema: Pagamento não armazena offline

**Sintomas:**
- Modo Offline ativo
- Clica "Confirmar Pagamento"
- Nada acontece ou dá erro

**Causas:**
1. IndexedDB desabilitado no navegador
2. Erro em console (permissões, quotas)
3. PaymentForm.vue não está integrado

**Soluções:**

```
1. Verificar IndexedDB:
   F12 → Application → Storage → IndexedDB
   Se lista vazia, pode estar desabilitado
   
2. Verifique console por erro:
   F12 → Console
   Veja se há erro em vermelho
   Anote mensagem de erro
   
3. Garantir que componente está integrado:
   Verifique se está usando <PaymentForm />
   em alguma página
   
4. Testar em navegador diferente:
   Chrome pode ter limite diferente que Firefox
   Tente em outro navegador
```

---

### ❌ Problema: Vídeo não baixa para cache

**Sintomas:**
- Clica "Baixar" em um vídeo
- Nada acontece
- Ou dá erro

**Causas:**
1. URL do vídeo inválida
2. CORS bloqueando download
3. Limite de storage atingido
4. VideoLibraryOffline.vue não integrado

**Soluções:**

```
1. Verificar URL do vídeo:
   F12 → Network
   Clique "Baixar"
   Procure requisição do .mp4
   Verifique se status é 200 (sucesso)
   
2. Se status 403 ou CORS error:
   └─ Servidor do vídeo bloqueia requisições do navegador
   └─ Precisa habilitar CORS no servidor
   
3. Verificar storage disponível:
   F12 → Application → Storage
   Veja quanto está sendo usado
   
4. Usar ferramenta web real:
   Videos em localhost não funcionam 100%
   Deploy em HTTPS e teste lá
```

---

### ❌ Problema: Notificação não aparece

**Sintomas:**
- Realiza ação (pagamento, etc)
- Nenhuma notificação aparece
- Ou aparece breve e some

**Causas:**
1. Permissão bloqueada
2. Service Worker não tem função de notificação
3. SO (Windows/Mac) bloqueando

**Soluções:**

```
1. Permitir notificações:
   a) F12 → Application → Manifest
   b) Ao lado de "Notifications": clique botão
   c) Selecione "Allow"
   d) Recarregue
   
2. Se bloquear novamente:
   F12 → Storage → Cookies
   Procure por cookies de "notification"
   Delete e tente novamente
   
3. Verificar SO:
   Windows: Settings → Notifications
   Procure por app no navegador
   Ative notificações
   
4. Tester permissão em console:
   F12 → Console
   Cole: Notification.permission
   Se retornar "denied", está bloqueado
```

---

### ❌ Problema: Lighthouse score baixo

**Sintomas:**
- Roda Lighthouse
- Score PWA < 90
- Outras métricas também baixas

**Causas:**
1. Faltam ícones/manifest
2. Arquivo grande demais
3. Imagens não otimizadas
4. Fuentes bloqueando carregamento

**Soluções:**

```
1. Verificar relatório Lighthouse:
   Procure seção "Opportunities"
   Implemente as sugestões
   
2. Ícones/Manifest:
   Adicione 4 ícones em public/
   Verifique manifest.json válido
   
3. Otimizar imagens:
   Use ferramenta como TinyPNG
   Reduza tamanho
   
4. Remover CSS/JS não usado:
   Audit o build
   Remova dependencies desnecessárias
   
5. Re-rodar Lighthouse:
   npm run build
   npm run preview
   F12 → Lighthouse
   Execute novamente
```

---

## 📊 Tabela de Status

| Funcionalidade | Chrome | Firefox | Safari | IE11 |
|---|---|---|---|---|
| Service Worker | ✅ | ✅ | ✅ | ❌ |
| Cache API | ✅ | ✅ | ✅ | ❌ |
| IndexedDB | ✅ | ✅ | ✅ | ⚠️ |
| Web Manifest | ✅ | ✅ | ⚠️ | ❌ |
| Push API | ✅ | ✅ | ❌ | ❌ |
| Install Prompt | ✅ | ✅ | ⚠️ | ❌ |
| Offline Mode | ✅ | ✅ | ✅ | ❌ |

**Legenda:**
- ✅ Funciona completo
- ⚠️ Funciona parcial/limitado
- ❌ Não funciona

---

## 🔗 Links Úteis para Debug

### Ferramentas Online
- [JSON Validator](https://jsonlint.com/) - Validar manifest.json
- [PWA Builder](https://www.pwabuilder.com/) - Gerar ícones/manifest
- [Can I Use](https://caniuse.com/) - Verificar suporte em navegadores
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Documentação

### Documentação
- [MDN - Service Workers](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API)
- [MDN - Cache API](https://developer.mozilla.org/pt-BR/docs/Web/API/Cache)
- [MDN - IndexedDB](https://developer.mozilla.org/pt-BR/docs/Web/API/IndexedDB_API)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)

### Comunidades
- Stack Overflow com tag `pwa`
- Discord de Web Development
- GitHub Discussions

---

## 📋 Checklist de Debug

Quando algo não funciona, siga este checklist:

1. **Verifique Console (F12)**
   - [ ] Há erros em vermelho?
   - [ ] Qual é a mensagem de erro?
   - [ ] Em que arquivo está?

2. **Verifique Service Worker**
   - [ ] Application → Service Workers
   - [ ] Status é "Running"?
   - [ ] Scope está correto?

3. **Verifique Manifest**
   - [ ] Application → Manifest
   - [ ] Mostra os dados corretos?
   - [ ] Ícones aparecem?

4. **Verifique Storage**
   - [ ] Storage → Cache Storage
   - [ ] Há caches listados?
   - [ ] Têm conteúdo?

5. **Verifique Network**
   - [ ] Network mostra requisições?
   - [ ] Alguma falha (vermelho)?
   - [ ] Status codes são 200?

6. **Último recurso**
   - [ ] npm run build (rebuild)
   - [ ] Limpar cache (DevTools)
   - [ ] Recarregar (Ctrl + R)
   - [ ] Aguardar 5 segundos
   - [ ] Tentar novamente

---

## 🎓 Quando Pedir Ajuda

Se nada der certo:

1. **Anote informações:**
   - [ ] Que teste está falhando?
   - [ ] Qual é a mensagem de erro (exata)?
   - [ ] Qual navegador?
   - [ ] Sistema operacional?
   - [ ] Screenshots de erro

2. **Procure por soluções:**
   - [ ] Google: seu erro
   - [ ] Stack Overflow
   - [ ] GitHub Issues
   - [ ] Comunidades PWA

3. **Se nada funcionar:**
   - [ ] Recrie o projeto do zero
   - [ ] Siga os guias passo a passo
   - [ ] Teste em navegador diferente
   - [ ] Teste em computador diferente

---

## ✅ Quando Tudo Funciona

Se passou em todos os testes:

1. ✅ Parabéns! 🎉
2. ✅ Próximo: Criar ícones profissionais
3. ✅ Integrar dados reais
4. ✅ Deploy em HTTPS
5. ✅ Publicar para alunos

**Você agora tem uma PWA funcional!** 🚀

