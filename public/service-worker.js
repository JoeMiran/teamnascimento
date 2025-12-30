/**
 * Service Worker customizado para Team Nascimento BJJ
 * Estratégias de cache e sincronização offline
 */

// Versão do cache
const CACHE_VERSION = 'v1'
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  videos: `videos-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`
}

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...')
  event.waitUntil(self.skipWaiting())
})

// Ativar Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log(`[Service Worker] Deletando cache antigo: ${cacheName}`)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Interceptar requisições
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Requisições POST, PUT, DELETE (não cachear)
  if (request.method !== 'GET') {
    event.respondWith(fetch(request))
    return
  }

  // Requisições à API - NetworkFirst com fallback para cache
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Vídeos - CacheFirst (priorizar cache local)
  if (request.url.match(/\.(mp4|webm|ogg)$/i)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.videos))
    return
  }

  // Imagens - CacheFirst
  if (request.url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.images))
    return
  }

  // Fonts - CacheFirst
  if (request.url.match(/\.(woff|woff2|ttf|eot)$/i)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.static))
    return
  }

  // CSS, JS - Stale While Revalidate
  if (request.url.match(/\.(css|js)$/i)) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // HTML - NetworkFirst
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request))
    return
  }

  // Default - NetworkFirst
  event.respondWith(networkFirst(request))
})

/**
 * CacheFirst - Retorna do cache se disponível, caso contrário faz requisição
 */
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
      return cached
    }

    const response = await fetch(request)

    if (response.ok) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.error('[Service Worker] Erro em cacheFirst:', error)
    return new Response('Conteúdo não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

/**
 * NetworkFirst - Tenta rede primeiro, fallback para cache
 */
async function networkFirst(request) {
  const cacheName = request.url.includes('/api/') ? CACHE_NAMES.api : CACHE_NAMES.dynamic

  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      )
    ])

    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('[Service Worker] Usando cache para:', request.url)
    const cached = await caches.match(request)

    if (cached) {
      return cached
    }

    // Página offline
    if (request.destination === 'document') {
      return new Response(
        `<html>
          <head><title>Offline</title></head>
          <body>
            <h1>Sem conexão com a internet</h1>
            <p>Você está visualizando uma versão em cache.</p>
            <p>Verifique sua conexão e recarregue a página.</p>
          </body>
        </html>`,
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      )
    }

    return new Response('Recurso não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

/**
 * StaleWhileRevalidate - Retorna cache imediatamente e atualiza em background
 */
async function staleWhileRevalidate(request) {
  const cacheName = CACHE_NAMES.static
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName)
      cache.then(c => c.put(request, response.clone()))
    }
    return response
  })

  return cached || fetchPromise
}

/**
 * Sincronização em background para pagamentos
 */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-payments') {
    event.waitUntil(syncPendingPayments())
  }
})

async function syncPendingPayments() {
  try {
    const db = await openDatabase()
    const pendingPayments = await getPendingPayments(db)

    for (const payment of pendingPayments) {
      try {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payment)
        })

        if (response.ok) {
          await markPaymentSynced(db, payment.id)
        }
      } catch (error) {
        console.error('Erro ao sincronizar pagamento:', error)
        throw error
      }
    }
  } catch (error) {
    console.error('Erro na sincronização:', error)
    throw error
  }
}

// Funções auxiliares para IndexedDB
function openDatabase() {
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

function getPendingPayments(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['payments'], 'readonly')
    const store = transaction.objectStore('payments')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function markPaymentSynced(db, paymentId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['payments'], 'readwrite')
    const store = transaction.objectStore('payments')
    const request = store.delete(paymentId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

console.log('[Service Worker] Carregado com sucesso!')
