/**
 * Composable para gerenciar PWA - Registro de Service Worker e instalação
 */

import { ref } from 'vue'

export const usePWA = () => {
  const isInstalled = ref(false)
  const isInstallPromptShowing = ref(false)
  const installPromptEvent = ref(null)
  const isOnline = ref(navigator.onLine)
  let deferredPrompt = null

  // Detectar mudanças na conexão
  window.addEventListener('online', () => {
    isOnline.value = true
    console.log('🟢 Online')
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
    console.log('🔴 Offline')
  })

  // Registrar Service Worker
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker não suportado neste navegador')
      return
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('✅ Service Worker registrado:', registration)

      // Verificar updates periodicamente
      setInterval(() => {
        registration.update()
      }, 60000) // A cada minuto

      return registration
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error)
    }
  }

  // Detectar evento de install (quando PWA pode ser instalada)
  const setupInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault()
      deferredPrompt = event
      isInstallPromptShowing.value = true
      installPromptEvent.value = event
      console.log('📲 Prompt de instalação disponível')
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallPromptShowing.value = false
      console.log('✅ App instalado com sucesso!')
    })
  }

  // Mostrar prompt de instalação
  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn('Prompt de instalação não disponível')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('✅ Usuário aceitou instalar o app')
    } else {
      console.log('❌ Usuário rejeitou instalar o app')
    }

    deferredPrompt = null
    isInstallPromptShowing.value = false
  }

  // Requestar notificações
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Notificações não suportadas')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Enviar notificação
  const sendNotification = async (title, options = {}) => {
    if ('serviceWorker' in navigator && 'ready' in navigator.serviceWorker) {
      const registration = await navigator.serviceWorker.ready

      registration.showNotification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      })
    }
  }

  // Registrar sincronização em background para pagamentos
  const registerPaymentSync = async () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('sync-payments')
        console.log('✅ Sincronização de pagamentos registrada')
      } catch (error) {
        console.error('❌ Erro ao registrar sincronização:', error)
      }
    }
  }

  // Armazenar pagamento para sincronização offline
  const storePaymentForSync = async (paymentData) => {
    try {
      const db = await openDatabase()
      const transaction = db.transaction(['payments'], 'readwrite')
      const store = transaction.objectStore('payments')
      await new Promise((resolve, reject) => {
        const request = store.add({
          ...paymentData,
          timestamp: new Date().toISOString(),
          synced: false
        })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
      console.log('✅ Pagamento armazenado para sincronização offline')
      await registerPaymentSync()
    } catch (error) {
      console.error('❌ Erro ao armazenar pagamento:', error)
    }
  }

  // Abrir banco de dados IndexedDB
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('nascimento-bjj', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = event => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('payments')) {
          db.createObjectStore('payments', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  // Inicializar PWA
  const init = async () => {
    await registerServiceWorker()
    setupInstallPrompt()
    await requestNotificationPermission()
  }

  return {
    isInstalled,
    isInstallPromptShowing,
    isOnline,
    registerServiceWorker,
    setupInstallPrompt,
    promptInstall,
    requestNotificationPermission,
    sendNotification,
    registerPaymentSync,
    storePaymentForSync,
    openDatabase,
    init
  }
}
