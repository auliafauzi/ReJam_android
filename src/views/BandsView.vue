<template>
  <div class="screen active" id="s-bands">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>
    <h2 class="screen-title">Band</h2>
    <p class="screen-subtitle">Band yang sudah mengundangmu atau yang sedang kamu kelola.</p>

    <div class="scroll-body">
      <div v-if="loading" class="center-state">
        <div class="spinner"></div>
        <span>Memuat band...</span>
      </div>

      <div v-else-if="error" class="form-error">{{ error }}</div>

      <div v-else-if="bands.length === 0" class="center-state">
        <i class="ti ti-music" style="font-size:32px; color: var(--text-dim);"></i>
        <span>Belum ada band yang terhubung denganmu.</span>
        <span style="font-size:11px;">Band akan muncul di sini saat ada yang mengundangmu untuk jamming.</span>
      </div>

      <div v-for="band in bands" :key="band.id" class="band-card" @click="openChat(band)">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div class="band-card-title">{{ band.nama }}</div>
            <div class="band-card-sub">{{ Array.isArray(band.genre) ? band.genre.join(', ') : band.genre }} · {{ band.kota }}</div>
          </div>
          <span v-if="band.unread_count > 0" class="badge">{{ band.unread_count }}</span>
        </div>
        <div v-if="band.invited_role" style="margin-top:8px; font-size:11px; color: var(--red);">
          Diundang sebagai: {{ band.invited_role }}
        </div>
        <div v-if="band.rehersal_place" style="margin-top:6px; font-size:11px; color: var(--text-dim);">
          <i class="ti ti-map-pin"></i> {{ band.rehersal_place }}
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
    bands.value = store.bands
  } catch {
    error.value = store.error || 'Gagal memuat band.'
  } finally {
    loading.value = false
  }
})

function openChat(band) {
  router.push(`/chats/${band.id}`)
}
</script>
