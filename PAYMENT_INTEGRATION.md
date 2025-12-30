# 💳 Guia de Integração de Pagamentos para PWA

## Visão Geral
Este documento fornece as instruções para integrar um sistema de pagamentos (Stripe ou PayPal) no seu aplicativo PWA de Team Nascimento BJJ.

---

## Opção 1: Integração com Stripe ⭐ (Recomendado)

### Por que Stripe?
- ✅ Suporta múltiplos métodos de pagamento
- ✅ Melhor suporte para PIX
- ✅ Dashboard intuitivo
- ✅ Webhooks para sincronização

### Passo 1: Criar conta Stripe

1. Acesse [stripe.com](https://stripe.com)
2. Clique em "Criar conta"
3. Preencha dados da sua academia
4. Obtenha suas chaves de API:
   - **Publishable Key** (pública)
   - **Secret Key** (privada - NUNCA compartilhe)

### Passo 2: Instalar bibliotecas

```bash
npm install @stripe/stripe-js @stripe/vue-3
```

### Passo 3: Criar arquivo de configuração

**Arquivo: `src/config/stripe.config.js`**

```javascript
export const STRIPE_CONFIG = {
  // Obtenha em https://dashboard.stripe.com/apikeys
  publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',
  
  // Configurações de pagamento
  currency: 'brl',
  locale: 'pt-BR',
  
  // URLs de retorno
  successUrl: `${window.location.origin}/payment-success`,
  cancelUrl: `${window.location.origin}/payment-cancel`,
}
```

### Passo 4: Criar composable para Stripe

**Arquivo: `src/composables/useStripe.js`**

```javascript
import { ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_CONFIG } from '@/config/stripe.config'

export const useStripe = () => {
  const stripe = ref(null)
  const isLoading = ref(true)

  const initializeStripe = async () => {
    try {
      stripe.value = await loadStripe(STRIPE_CONFIG.publishableKey)
      isLoading.value = false
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error)
      isLoading.value = false
    }
  }

  const createPaymentIntent = async (amount, studentId) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Converter para centavos
          studentId,
          currency: STRIPE_CONFIG.currency
        })
      })

      if (!response.ok) throw new Error('Erro ao criar Payment Intent')
      
      const { clientSecret } = await response.json()
      return clientSecret
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error)
      throw error
    }
  }

  const confirmPayment = async (clientSecret, paymentElement) => {
    try {
      const { error } = await stripe.value.confirmPayment({
        elements: paymentElement,
        clientSecret,
        confirmParams: {
          return_url: STRIPE_CONFIG.successUrl
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    stripe,
    isLoading,
    initializeStripe,
    createPaymentIntent,
    confirmPayment
  }
}
```

### Passo 5: Componente de Pagamento com Stripe

**Arquivo: `src/components/StripePaymentForm.vue`**

```vue
<template>
  <div class="stripe-payment-form">
    <h3>Pagamento com Cartão</h3>

    <div v-if="isLoading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>

    <form v-else @submit.prevent="handlePayment">
      <div id="payment-element"></div>

      <button 
        :disabled="isProcessing || !stripe"
        type="submit"
        class="btn btn-primary w-100 mt-3"
      >
        {{ isProcessing ? 'Processando...' : 'Confirmar Pagamento' }}
      </button>

      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStripe } from '@/composables/useStripe'

export default {
  name: 'StripePaymentForm',
  props: {
    amount: {
      type: Number,
      required: true
    },
    studentId: {
      type: String,
      required: true
    }
  },
  emits: ['payment-success', 'payment-error'],
  setup(props, { emit }) {
    const { stripe, isLoading, initializeStripe, createPaymentIntent, confirmPayment } = useStripe()
    const isProcessing = ref(false)
    const error = ref(null)
    let elements = null

    onMounted(async () => {
      await initializeStripe()

      if (stripe.value) {
        const clientSecret = await createPaymentIntent(props.amount, props.studentId)
        elements = stripe.value.elements({ clientSecret })
        const paymentElement = elements.create('payment')
        paymentElement.mount('#payment-element')
      }
    })

    const handlePayment = async () => {
      isProcessing.value = true
      error.value = null

      try {
        const result = await confirmPayment(stripe.value, elements)
        if (result.success) {
          emit('payment-success')
        } else {
          error.value = result.error
          emit('payment-error', result.error)
        }
      } catch (err) {
        error.value = err.message
        emit('payment-error', err.message)
      } finally {
        isProcessing.value = false
      }
    }

    return {
      isLoading,
      isProcessing,
      error,
      stripe,
      handlePayment
    }
  }
}
</script>
```

---

## Opção 2: Integração com PayPal

### Passo 1: Criar conta PayPal Business

1. Acesse [paypal.com/business](https://www.paypal.com/business)
2. Complete o cadastro
3. Obtenha seu **Client ID** em Configurações > Integração

### Passo 2: Instalar SDK PayPal

```bash
npm install @paypal/checkout-server-sdk
```

### Passo 3: Variáveis de Ambiente

Crie arquivo `.env.local`:

```
VITE_PAYPAL_CLIENT_ID=seu_client_id_aqui
VITE_PAYPAL_MODE=sandbox  # ou production
```

### Passo 4: Componente PayPal

```vue
<template>
  <div class="paypal-payment-form">
    <div id="paypal-button-container"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'PayPalPaymentForm',
  props: {
    amount: {
      type: Number,
      required: true
    },
    studentId: {
      type: String,
      required: true
    }
  },
  emits: ['payment-success', 'payment-error'],
  setup(props, { emit }) {
    onMounted(() => {
      // Carregar SDK do PayPal dinamicamente
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=BRL`
      script.onload = initPayPal
      document.head.appendChild(script)
    })

    const initPayPal = () => {
      window.paypal.Buttons({
        createOrder: async (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: props.amount.toString()
              },
              custom_id: props.studentId
            }]
          })
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture()
          emit('payment-success', order)
        },
        onError: (err) => {
          emit('payment-error', err)
        }
      }).render('#paypal-button-container')
    }

    return {}
  }
}
</script>
```

---

## Opção 3: PIX com Plataforma Local (Mercado Pago)

### Passo 1: Criar conta Mercado Pago

1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br)
2. Crie uma conta como vendedor
3. Obtenha seu **Access Token**

### Passo 2: Backend - Criar endpoint para gerar QR Code PIX

```javascript
// No seu backend (Node.js + Express exemplo)
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_TOKEN
});

app.post('/api/create-pix-payment', async (req, res) => {
  try {
    const { amount, studentId } = req.body;

    const payment = await mercadopago.payment.create({
      transaction_amount: amount,
      description: `Mensalidade - Aluno ${studentId}`,
      payment_method_id: 'pix',
      payer: {
        email: 'seu_email@example.com'
      }
    });

    // O qr_code será retornado na resposta
    res.json({
      qr_code: payment.response.point_of_interaction.transaction_data.qr_code,
      paymentId: payment.response.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Passo 3: Componente PIX

```vue
<template>
  <div class="pix-payment">
    <h4>Pagamento com PIX</h4>
    
    <div v-if="qrCode" class="text-center">
      <img :src="`data:image/png;base64,${qrCode}`" alt="QR Code PIX" class="pix-qr-code">
      <p class="mt-3">Escaneie o QR Code com seu app bancário</p>
      <button @click="copyPixKey" class="btn btn-secondary">
        <i class="bi bi-files"></i> Copiar chave PIX
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'PixPaymentForm',
  props: {
    amount: Number,
    studentId: String
  },
  setup(props) {
    const qrCode = ref(null)
    const pixKey = ref(null)

    onMounted(async () => {
      try {
        const response = await fetch('/api/create-pix-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: props.amount,
            studentId: props.studentId
          })
        })

        const data = await response.json()
        qrCode.value = data.qr_code
        pixKey.value = data.pix_key
      } catch (error) {
        console.error('Erro ao gerar QR Code PIX:', error)
      }
    })

    const copyPixKey = () => {
      navigator.clipboard.writeText(pixKey.value)
      alert('Chave PIX copiada!')
    }

    return {
      qrCode,
      copyPixKey
    }
  }
}
</script>

<style scoped>
.pix-qr-code {
  max-width: 300px;
  margin: 2rem auto;
}
</style>
```

---

## Backend - Endpoints Necessários

### 1. Criar Payment Intent (Stripe)
```
POST /api/create-payment-intent
Body: { amount, studentId, currency }
Response: { clientSecret }
```

### 2. Confirmar Pagamento
```
POST /api/payments
Body: { studentId, amount, paymentMethod, status, stripePaymentId }
Response: { success, paymentId }
```

### 3. Webhook de confirmação
```
POST /api/webhooks/payment-confirmed
- Verifica status do pagamento
- Atualiza banco de dados
- Envia notificação ao usuário
```

---

## Variáveis de Ambiente

Crie `.env.local`:

```
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY

# PayPal
VITE_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID

# Backend
VITE_API_URL=http://localhost:3000

# Chaves privadas (APENAS NO BACKEND)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
PAYPAL_SECRET=YOUR_SECRET
MERCADO_PAGO_TOKEN=YOUR_TOKEN
```

---

## Segurança ⚠️

1. **Nunca** compartilhe chaves secretas
2. Use `.env.local` para credenciais
3. Valide ALL os pagamentos no backend
4. Use HTTPS em produção
5. Implemente CORS corretamente
6. Valide valores antes de processar

---

## Testes

```bash
# Cartão de teste Stripe
Número: 4242 4242 4242 4242
Data: Qualquer mês/ano futuro
CVC: Qualquer 3 dígitos

# Bandeira de teste
Números começados em 4: Visa
Números começados em 5: Mastercard
```

---

## Verificação de Pagamento Offline

Quando o aluno está offline:

1. ✅ Pagamento é armazenado em IndexedDB
2. ✅ Service Worker registra sincronização em background
3. ✅ Quando online, sincroniza com o servidor
4. ✅ Notificação é enviada quando concluído

**Código em `usePWA.js`:**

```javascript
const storePaymentForSync = async (paymentData) => {
  const db = await openDatabase()
  // Armazena em IndexedDB
  await registerPaymentSync() // Registra sincronização
}
```

---

## Próximos Passos

1. ✅ Escolher provedor (Stripe recomendado)
2. ✅ Criar conta e obter credenciais
3. ✅ Implementar composable/componente
4. ✅ Criar endpoints de backend
5. ✅ Testar fluxo online e offline
6. ✅ Implementar webhooks
7. ✅ Notificar alunos após pagamento

---

## Suporte Adicional

- **Stripe Docs:** https://stripe.com/docs
- **PayPal Docs:** https://developer.paypal.com
- **Mercado Pago Docs:** https://www.mercadopago.com.br/developers
