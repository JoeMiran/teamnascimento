<template>
  <div class="payment-container">
    <!-- Status da conexão -->
    <div v-if="!isOnline" class="alert alert-warning mb-3">
      <i class="bi bi-wifi-off"></i>
      <strong>Modo Offline:</strong> Seu pagamento será sincronizado quando a conexão for restaurada
    </div>

    <!-- Botão de instalar app -->
    <div v-if="isInstallPromptShowing" class="alert alert-info mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>Instale nosso app!</strong>
          <p class="mb-0">Acesso rápido à biblioteca e pagamentos offline</p>
        </div>
        <button @click="promptInstall" class="btn btn-primary btn-sm">
          <i class="bi bi-download"></i> Instalar
        </button>
      </div>
    </div>

    <div class="payment-form">
      <h3>Realizar Pagamento</h3>

      <div class="form-group mb-3">
        <label for="amount" class="form-label">Valor da Mensalidade</label>
        <div class="input-group">
          <span class="input-group-text">R$</span>
          <input
            v-model.number="formData.amount"
            type="number"
            class="form-control"
            id="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div class="form-group mb-3">
        <label for="student" class="form-label">Aluno</label>
        <select v-model="formData.studentId" class="form-select" id="student">
          <option value="">Selecione um aluno</option>
          <option v-for="student in students" :key="student.id" :value="student.id">
            {{ student.name }}
          </option>
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="paymentMethod" class="form-label">Método de Pagamento</label>
        <select v-model="formData.paymentMethod" class="form-select" id="paymentMethod">
          <option value="">Selecione um método</option>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="debit_card">Cartão de Débito</option>
          <option value="pix">PIX</option>
          <option value="bank_transfer">Transferência Bancária</option>
        </select>
      </div>

      <div v-if="formData.paymentMethod === 'credit_card'" class="form-group mb-3">
        <label for="cardNumber" class="form-label">Número do Cartão</label>
        <input
          v-model="formData.cardNumber"
          type="text"
          class="form-control"
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          @input="formatCardNumber"
        />
      </div>

      <div v-if="formData.paymentMethod === 'pix'" class="form-group mb-3">
        <p class="text-muted">
          <i class="bi bi-info-circle"></i>
          Utilize o código PIX que será gerado para realizar o pagamento
        </p>
      </div>

      <button
        @click="processPayment"
        :disabled="isProcessing || !isFormValid"
        class="btn btn-success w-100"
      >
        <i v-if="!isProcessing" class="bi bi-credit-card"></i>
        <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
        {{ isProcessing ? 'Processando...' : 'Confirmar Pagamento' }}
      </button>

      <!-- Mostrar mensagem de sucesso offline -->
      <div v-if="paymentStoredOffline" class="alert alert-info mt-3">
        <i class="bi bi-cloud-upload"></i>
        <strong>Pagamento armazenado!</strong> Será sincronizado quando conectado
      </div>
    </div>

    <!-- Histórico de pagamentos -->
    <div class="payment-history mt-4">
      <h4>Histórico de Pagamentos</h4>
      <div v-if="payments.length > 0" class="list-group">
        <div v-for="payment in payments" :key="payment.id" class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1">{{ payment.studentName }}</h6>
              <small class="text-muted">{{ formatDate(payment.date) }}</small>
            </div>
            <div class="text-end">
              <div class="fw-bold">R$ {{ payment.amount.toFixed(2) }}</div>
              <small :class="statusClass(payment.status)">
                {{ formatStatus(payment.status) }}
              </small>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">Nenhum pagamento registrado</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { usePWA } from '@/composables/usePWA'

export default {
  name: 'PaymentForm',
  setup() {
    const { isOnline, isInstallPromptShowing, promptInstall, storePaymentForSync, sendNotification } = usePWA()

    const formData = ref({
      amount: null,
      studentId: '',
      paymentMethod: '',
      cardNumber: ''
    })

    const isProcessing = ref(false)
    const paymentStoredOffline = ref(false)
    const students = ref([])
    const payments = ref([])

    const isFormValid = computed(() => {
      return formData.value.amount &&
        formData.value.studentId &&
        formData.value.paymentMethod
    })

    onMounted(async () => {
      // Carregar alunos (você pode integrar com sua API)
      students.value = [
        { id: 1, name: 'João Silva' },
        { id: 2, name: 'Maria Santos' },
        // ... mais alunos
      ]

      // Carregar histórico de pagamentos
      await loadPayments()
    })

    const formatCardNumber = () => {
      let value = formData.value.cardNumber.replace(/\D/g, '')
      let formatted = ''
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += ' '
        }
        formatted += value[i]
      }
      formData.value.cardNumber = formatted
    }

    const processPayment = async () => {
      isProcessing.value = true
      paymentStoredOffline.value = false

      try {
        const paymentData = {
          amount: formData.value.amount,
          studentId: formData.value.studentId,
          paymentMethod: formData.value.paymentMethod,
          cardNumber: formData.value.paymentMethod === 'credit_card' ? formData.value.cardNumber : null,
          date: new Date().toISOString()
        }

        if (isOnline.value) {
          // Processar pagamento online
          const response = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
          })

          if (response.ok) {
            await sendNotification('Pagamento realizado com sucesso!', {
              body: `R$ ${formData.value.amount.toFixed(2)} processado`,
              tag: 'payment-success',
              requireInteraction: false
            })

            resetForm()
            await loadPayments()
          } else {
            throw new Error('Erro ao processar pagamento')
          }
        } else {
          // Armazenar para sincronização offline
          await storePaymentForSync(paymentData)
          paymentStoredOffline.value = true

          await sendNotification('Pagamento armazenado!', {
            body: 'Será sincronizado quando a conexão for restaurada',
            tag: 'payment-offline',
            requireInteraction: true
          })

          resetForm()
        }
      } catch (error) {
        console.error('Erro ao processar pagamento:', error)
        alert('Erro ao processar pagamento: ' + error.message)
      } finally {
        isProcessing.value = false
      }
    }

    const resetForm = () => {
      formData.value = {
        amount: null,
        studentId: '',
        paymentMethod: '',
        cardNumber: ''
      }
    }

    const loadPayments = async () => {
      try {
        const response = await fetch('/api/payments')
        if (response.ok) {
          payments.value = await response.json()
        }
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error)
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const formatStatus = (status) => {
      const statusMap = {
        pending: 'Pendente',
        completed: 'Concluído',
        failed: 'Falhou'
      }
      return statusMap[status] || status
    }

    const statusClass = (status) => {
      const classMap = {
        pending: 'text-warning',
        completed: 'text-success',
        failed: 'text-danger'
      }
      return classMap[status] || ''
    }

    return {
      formData,
      isProcessing,
      isFormValid,
      paymentStoredOffline,
      students,
      payments,
      isOnline,
      isInstallPromptShowing,
      promptInstall,
      formatCardNumber,
      processPayment,
      formatDate,
      formatStatus,
      statusClass
    }
  }
}
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 0;
}

.payment-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-history {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  border: 1px solid #dee2e6;
}
</style>
