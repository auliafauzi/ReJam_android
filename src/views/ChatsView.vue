<template>
  <div class="screen active" id="s-chats">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>
    <h2 class="screen-title">Chats</h2>
    <p class="screen-subtitle">
      {{ isAdmin ? 'Kelola percakapan semua band.' : 'Percakapan dengan band-band yang mengundangmu.' }}
    </p>

    <div class="scroll-body">
      <div v-if="loading" class="center-state">
        <div class="spinner"></div>
        <span>Memuat chat...</span>
      </div>

      <div v-else-if="error" class="form-error">{{ error }}</div>

      <!-- ── SUPERADMIN VIEW ── -->
      <template v-else-if="isAdmin">
        <div v-if="bands.length === 0" class="center-state">
          <i class="ti ti-music" style="font-size:32px; color: var(--text-dim);"></i>
          <span>Belum ada band.</span>
        </div>

        <div v-for="band in bands" :key="band.id" style="margin-bottom:16px;">
          <!-- Band header -->
          <div style="color: var(--red); font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">
            {{ band.nama }}
            <span style="color: var(--text-dim); font-weight:400; text-transform:none; letter-spacing:0;">
              · {{ Array.isArray(band.genre) ? band.genre.join(', ') : band.genre }}
            </span>
          </div>

          <!-- Conversations under this band -->
          <div v-if="band.conversations.length === 0" style="color: var(--text-dim); font-size:12px; padding: 0 0 8px 8px;">
            Belum ada percakapan.
          </div>

          <div
            v-for="conv in band.conversations"
            :key="conv.id"
            class="band-card"
            style="margin-bottom:8px; cursor:pointer;"
            @click="openAdminChat(band, conv)"
          >
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div class="band-card-title">{{ conv.user_nama || conv.user_username }}</div>
                <div class="band-card-sub">
                  {{ conv.invited_role }} ·
                  <span :style="statusStyle(conv.status)">{{ statusLabel(conv.status) }}</span>
                </div>
              </div>
              <span v-if="conv.unread_count > 0" class="badge">{{ conv.unread_count }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- ── REGULAR USER VIEW ── -->
      <template v-else>
        <div v-if="bands.length === 0" class="center-state">
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
      </template>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBandsStore } from '../stores/bands'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const auth = useAuthStore()
const store = useBandsStore()

const isAdmin = computed(() => auth.user?.is_superuser)
const loading = ref(true)
const error = ref('')
const bands = ref([])

onMounted(async () => {
  try {
    await store.fetchBands()
    if (isAdmin.value) {
      bands.value = store.bands
    } else {
      bands.value = store.bands.filter((b) => b.conversation_id)
    }
  } catch {
    error.value = store.error || 'Gagal memuat chat.'
  } finally {
    loading.value = false
  }
})

function statusLabel(status) {
  const labels = {
    pending: 'Menunggu',
    accepted: 'Tertarik',
    declined: 'Tidak tertarik',
    negotiating: 'Diskusi',
  }
  return labels[status] || status
}

function statusStyle(status) {
  const colors = {
    pending: 'color: var(--text-dim)',
    accepted: 'color: #5fe0a3',
    declined: 'color: var(--red)',
    negotiating: 'color: #e0a35f',
  }
  return colors[status] || ''
}

function openChat(band) {
  router.push(`/chats/${band.id}`)
}

function openAdminChat(band, conv) {
  router.push(`/chats/${band.id}/${conv.id}`)
}
</script>