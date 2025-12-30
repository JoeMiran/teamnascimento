<template>
  <div class="video-library-offline">
    <!-- Status de conexão e cachés -->
    <div class="cache-status">
      <div class="status-badge" :class="{ online: isOnline, offline: !isOnline }">
        <i :class="isOnline ? 'bi-wifi' : 'bi-wifi-off'"></i>
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
      <div class="cached-videos">
        <i class="bi bi-database-check"></i>
        {{ cachedVideos.length }} vídeos cacheados
      </div>
    </div>

    <!-- Lista de vídeos -->
    <div class="videos-grid">
      <div v-for="video in videos" :key="video.id" class="video-card">
        <div class="video-thumbnail">
          <img :src="video.thumbnail" :alt="video.title" />
          <div class="video-duration">{{ video.duration }}</div>

          <!-- Ícone de cache -->
          <div v-if="isVideoCached(video.id)" class="cached-badge">
            <i class="bi bi-cloud-check-fill"></i> Offline
          </div>
        </div>

        <div class="video-info">
          <h5>{{ video.title }}</h5>
          <p class="video-category">{{ video.category }}</p>
          <p class="video-description">{{ video.description }}</p>

          <div class="video-actions">
            <button
              @click="playVideo(video.id)"
              class="btn btn-primary btn-sm"
            >
              <i class="bi bi-play-fill"></i> Assistir
            </button>

            <button
              v-if="!isVideoCached(video.id) && isOnline"
              @click="downloadVideo(video.id)"
              :disabled="isDownloading[video.id]"
              class="btn btn-outline-secondary btn-sm"
            >
              <i v-if="!isDownloading[video.id]" class="bi bi-download"></i>
              <span v-if="isDownloading[video.id]" class="spinner-border spinner-border-sm me-2"></span>
              {{ isDownloading[video.id] ? 'Baixando...' : 'Baixar' }}
            </button>

            <button
              v-else-if="isVideoCached(video.id)"
              @click="removeFromCache(video.id)"
              class="btn btn-outline-danger btn-sm"
            >
              <i class="bi bi-trash"></i> Remover
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de player de vídeo -->
    <div v-if="selectedVideo" class="video-player-modal" @click="closePlayer">
      <div class="video-player-container" @click.stop>
        <button class="close-button" @click="closePlayer">
          <i class="bi bi-x-lg"></i>
        </button>

        <video
          :src="selectedVideo.videoUrl"
          controls
          autoplay
          class="video-player"
        ></video>

        <div class="video-info-full">
          <h4>{{ selectedVideo.title }}</h4>
          <p>{{ selectedVideo.description }}</p>
          <p class="text-muted">
            <small>Instrutor: {{ selectedVideo.instructor }}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { usePWA } from '@/composables/usePWA'

export default {
  name: 'VideoLibraryOffline',
  setup() {
    const { isOnline } = usePWA()

    const videos = ref([
      {
        id: 1,
        title: 'Guarda Aberta - Fundamentos',
        category: 'Posição Base',
        description: 'Aprenda os fundamentos essenciais da guarda aberta, técnicas de defesa e ataque.',
        thumbnail: 'https://via.placeholder.com/300x170?text=Guarda+Aberta',
        videoUrl: 'https://example.com/videos/guarda-aberta.mp4',
        duration: '12:34',
        instructor: 'Professor João'
      },
      {
        id: 2,
        title: 'Montada - Técnicas de Controle',
        category: 'Posição Ofensiva',
        description: 'Domine a posição de montada com técnicas avançadas de controle e finalização.',
        thumbnail: 'https://via.placeholder.com/300x170?text=Montada',
        videoUrl: 'https://example.com/videos/montada.mp4',
        duration: '15:20',
        instructor: 'Professor Carlos'
      },
      {
        id: 3,
        title: 'Passagem de Guarda',
        category: 'Transição',
        description: 'As melhores técnicas para passar a guarda do seu adversário.',
        thumbnail: 'https://via.placeholder.com/300x170?text=Passagem',
        videoUrl: 'https://example.com/videos/passagem-guarda.mp4',
        duration: '18:45',
        instructor: 'Professor Maria'
      },
      {
        id: 4,
        title: 'Estrangulamento Triângulo',
        category: 'Finalização',
        description: 'Aprenda a executar o triângulo com precisão e segurança.',
        thumbnail: 'https://via.placeholder.com/300x170?text=Triangulo',
        videoUrl: 'https://example.com/videos/triangulo.mp4',
        duration: '14:12',
        instructor: 'Professor Pedro'
      }
    ])

    const selectedVideo = ref(null)
    const cachedVideos = ref([])
    const isDownloading = ref({})

    onMounted(async () => {
      await loadCachedVideos()
    })

    const isVideoCached = (videoId) => {
      return cachedVideos.value.includes(videoId)
    }

    const loadCachedVideos = async () => {
      try {
        const cache = await caches.open('videos-cache')
        const requests = await cache.keys()
        cachedVideos.value = requests
          .map(req => {
            const id = parseInt(req.url.split('-').pop())
            return isNaN(id) ? null : id
          })
          .filter(Boolean)
      } catch (error) {
        console.error('Erro ao carregar vídeos cacheados:', error)
      }
    }

    const downloadVideo = async (videoId) => {
      isDownloading.value[videoId] = true

      try {
        const video = videos.value.find(v => v.id === videoId)
        const response = await fetch(video.videoUrl)

        if (!response.ok) {
          throw new Error('Erro ao baixar vídeo')
        }

        const cache = await caches.open('videos-cache')
        cache.put(video.videoUrl, response.clone())

        cachedVideos.value.push(videoId)

        // Notificar sucesso
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Vídeo baixado!', {
            body: `"${video.title}" está pronto para assistir offline`,
            icon: video.thumbnail
          })
        }
      } catch (error) {
        console.error('Erro ao baixar vídeo:', error)
        alert('Erro ao baixar vídeo: ' + error.message)
      } finally {
        isDownloading.value[videoId] = false
      }
    }

    const removeFromCache = async (videoId) => {
      if (!confirm('Deseja remover este vídeo do cache?')) {
        return
      }

      try {
        const video = videos.value.find(v => v.id === videoId)
        const cache = await caches.open('videos-cache')
        await cache.delete(video.videoUrl)

        cachedVideos.value = cachedVideos.value.filter(id => id !== videoId)
      } catch (error) {
        console.error('Erro ao remover vídeo:', error)
      }
    }

    const playVideo = (videoId) => {
      selectedVideo.value = videos.value.find(v => v.id === videoId)
    }

    const closePlayer = () => {
      selectedVideo.value = null
    }

    return {
      videos,
      selectedVideo,
      cachedVideos,
      isDownloading,
      isOnline,
      isVideoCached,
      downloadVideo,
      removeFromCache,
      playVideo,
      closePlayer
    }
  }
}
</script>

<style scoped>
.video-library-offline {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.cache-status {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-badge.online {
  background: #d4edda;
  color: #155724;
}

.status-badge.offline {
  background: #f8d7da;
  color: #721c24;
}

.cached-videos {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #cfe2ff;
  color: #084298;
  border-radius: 8px;
  font-weight: 500;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.video-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #000;
  overflow: hidden;
}

.video-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.cached-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #28a745;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.video-info {
  padding: 1rem;
}

.video-info h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.video-category {
  margin: 0.25rem 0;
  color: #007bff;
  font-size: 0.85rem;
  font-weight: 500;
}

.video-description {
  margin: 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.video-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.video-actions .btn {
  flex: 1;
  min-width: 100px;
  font-size: 0.85rem;
}

/* Video Player Modal */
.video-player-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.video-player-container {
  position: relative;
  width: 90%;
  max-width: 900px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.video-player {
  width: 100%;
  display: block;
  background: #000;
}

.video-info-full {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.video-info-full h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.video-info-full p {
  margin: 0.25rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }

  .cache-status {
    flex-direction: column;
  }

  .status-badge,
  .cached-videos {
    width: 100%;
  }

  .video-player-container {
    width: 95%;
    max-width: 100%;
    border-radius: 0;
  }
}
</style>
