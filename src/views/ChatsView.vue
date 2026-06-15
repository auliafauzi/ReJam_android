<template>
  <div class="screen active" id="s-chats">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>
    <h2 class="screen-title">Chats</h2>
    <p class="screen-subtitle">Percakapan dengan band-band yang mengundangmu.</p>

    <div class="scroll-body">
      <div v-if="loading" class="center-state">
        <div class="spinner"></div>
        <span>Memuat chat...</span>
      </div>

      <div v-else-if="error" class="form-error">{{ error }}</div>

      <div v-else-if="bands.length === 0" class="center-state">
        <i class="ti ti-message-circle" style="font-size:32px; color: var(--text-dim);"></i>
        <span>Belum ada percakapan.</span>
      </div>

      <div v-for="band in bands" :key="band.id" class="band-card" @click="openChat(band)">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div class="band-card-title">{{ band.nama }}</div>
            <div class="band-card-sub">
              {{ band.has_replied ? 'Sudah dibalas' : 'Menunggu balasanmu' }}
            </div>
          </div>
          <span v-if="band.unread_count > 0" class="badge">{{ band.unread_count }}</span>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBandsStore } from '../stores/bands'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const store = useBandsStore()

const loading = ref(true)
const error = ref('')
const bands = ref([])

onMounted(async () => {
  try {
    await store.fetchBands()
    // Only show bands that actually have a conversation
    bands.value = store.bands.filter((b) => b.conversation_id)
  } catch {
    error.value = store.error || 'Gagal memuat chat.'
  } finally {
    loading.value = false
  }
})

function openChat(band) {
  router.push(`/chats/${band.id}`)
}
</script>
