<template>
  <div class="screen active" id="s-chats">

    <!-- Radar overlay -->
    <MatchmakingRadar
      v-if="showRadar"
      :message="radarMessage"
      :auto-stop="true"
      :duration="2000"
      @done="onRadarDone"
    />

    <template v-else>
      <div class="onboard-header">
        <div class="mini-logo"><i class="ti ti-music"></i></div>
        <span class="mini-brand">Re:Jam</span>
      </div>
      <h2 class="screen-title">Chats</h2>
      <p class="screen-subtitle">
        {{ isAdmin ? 'Kelola percakapan semua jam session.' : 'Percakapan dengan jam session yang mengundangmu.' }}
      </p>

      <div class="scroll-body">
        <div v-if="loading" class="center-state">
          <div class="spinner"></div>
          <span>Memuat chat...</span>
        </div>

        <div v-else-if="error" class="form-error">{{ error }}</div>

        <!-- ── SUPERADMIN VIEW ── -->
        <template v-else-if="isAdmin">

          <div v-if="jamSessions.length === 0 && supportConvs.length === 0" class="center-state">
            <i class="ti ti-music" style="font-size:32px; color: var(--text-dim);"></i>
            <span>Belum ada jam session.</span>
          </div>

          <!-- Jam Session conversations -->
          <div v-for="jamSession in jamSessions" :key="jamSession.id" style="margin-bottom:16px;">
            <div style="color: var(--red); font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">
              {{ jamSession.nama }}
              <span style="color: var(--text-dim); font-weight:400; text-transform:none; letter-spacing:0;">
                · {{ Array.isArray(jamSession.genre) ? jamSession.genre.join(', ') : jamSession.genre }}
              </span>
            </div>

            <div v-if="jamSession.conversations.length === 0" style="color: var(--text-dim); font-size:12px; padding: 0 0 8px 8px;">
              Belum ada percakapan.
            </div>

            <div
              v-for="conv in jamSession.conversations"
              :key="conv.id"
              class="band-card"
              style="margin-bottom:8px; cursor:pointer;"
              @click="openAdminChat(jamSession, conv)"
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

          <!-- Support conversations — superadmin -->
          <div v-if="supportConvs.length > 0" style="margin-bottom:16px;">
            <div style="color: var(--red); font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">
              Support
            </div>
            <div
              v-for="conv in supportConvs"
              :key="conv.id"
              class="band-card"
              style="margin-bottom:8px; cursor:pointer;"
              @click="$router.push(`/support-admin/${conv.id}`)"
            >
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="band-card-title">{{ conv.user_nama || conv.user_email }}</div>
                  <div class="band-card-sub">{{ topicLabel(conv.topic) }}</div>
                </div>
                <span v-if="!conv.is_unlocked" class="badge" style="background: var(--text-dim);">baru</span>
              </div>
            </div>
          </div>

        </template>

        <!-- ── REGULAR USER VIEW ── -->
        <template v-else>

          <div v-if="jamSessions.length === 0 && supportConvs.length === 0" class="center-state">
            <i class="ti ti-message-circle" style="font-size:32px; color: var(--text-dim);"></i>
            <span>Belum ada percakapan.</span>
          </div>

          <!-- Jam Session conversations -->
          <div v-for="jamSession in jamSessions" :key="jamSession.id" class="band-card" @click="openChat(jamSession)">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div class="band-card-title">{{ jamSession.nama }}</div>
                <div class="band-card-sub">
                  {{ jamSession.has_replied ? 'Sudah dibalas' : 'Menunggu balasanmu' }}
                </div>
              </div>
              <span v-if="jamSession.unread_count > 0" class="badge">{{ jamSession.unread_count }}</span>
            </div>
          </div>

          <!-- Support conversations — regular user -->
          <div v-if="supportConvs.length > 0" style="margin-top:16px; margin-bottom:16px;">
            <div style="color: var(--red); font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">
              Support
            </div>
            <div
              v-for="conv in supportConvs"
              :key="conv.id"
              class="band-card"
              style="margin-bottom:8px; cursor:pointer;"
              @click="$router.push(`/support/${conv.topic}`)"
            >
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="band-card-title">{{ topicLabel(conv.topic) }}</div>
                  <div class="band-card-sub">
                    {{ conv.messages?.length ? conv.messages[conv.messages.length - 1].text : 'Belum ada pesan' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>

      </div>
    </template>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useJamSessionsStore } from '../stores/jamSessions'
import { supportApi } from '../api/support'
import BottomNav from '../components/BottomNav.vue'
import MatchmakingRadar from '../components/MatchmakingRadar.vue'

const router = useRouter()
const auth = useAuthStore()
const store = useJamSessionsStore()

const isAdmin = computed(() => auth.user?.is_superuser)
const loading = ref(true)
const error = ref('')
const jamSessions = ref([])
const supportConvs = ref([])
const showRadar = ref(false)
const radarMessage = ref('Sedang mencari jam session untukmu')
const radarShownOnce = ref(false)

const RADAR_KEY = 'rejam_matchmaking_shown'

onMounted(async () => {
  if (isAdmin.value) {
    await fetchJamSessions()
    return
  }

  const firstTime = !localStorage.getItem(RADAR_KEY)
  if (firstTime) {
    radarMessage.value = 'Sedang mencari jam session untukmu'
    showRadar.value = true
    localStorage.setItem(RADAR_KEY, '1')
    return
  }

  await fetchJamSessions()
})

async function fetchJamSessions() {
  loading.value = true
  error.value = ''
  try {
    await store.fetchJamSessions()
    if (isAdmin.value) {
      jamSessions.value = store.jamSessions
      // Also fetch support conversations
      try {
        const { data } = await supportApi.list()
        supportConvs.value = data
      } catch {
        // non-critical, ignore
      }
    } else {
      jamSessions.value = store.jamSessions.filter((js) => js.conversation_id)

      // Fetch user's own support conversations
      try {
        const { data } = await supportApi.listUser()
        supportConvs.value = data
      } catch {
        // non-critical
      }

      if (jamSessions.value.length === 0 && !radarShownOnce.value) {
        radarMessage.value = 'Mencari ulang jam session yang cocok untukmu'
        showRadar.value = true
        radarShownOnce.value = true
        return
      }
    }
  } catch {
    error.value = store.error || 'Gagal memuat chat.'
  } finally {
    loading.value = false
  }
}

async function onRadarDone() {
  showRadar.value = false
  await fetchJamSessions()
}

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

function openChat(jamSession) {
  router.push(`/chats/${jamSession.id}`)
}

function openAdminChat(jamSession, conv) {
  router.push(`/chats/${jamSession.id}/${conv.id}`)
}

function topicLabel(topic) {
  const labels = {
    investor: 'Be our investor',
    donate: 'Donate',
    join_team: 'Join our team',
    add_studio: 'Add studio to our database',
    additional_player: 'Be our additional player',
  }
  return labels[topic] || topic
}
</script>