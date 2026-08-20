<template>
  <div class="screen active" id="s-jam-sessions">

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
      <h2 class="screen-title">Jam</h2>
      <!-- <p class="screen-subtitle">Jam Session yang sudah mengundangmu.</p> -->
      <div class="header-action-row">
        <p class="screen-subtitle">Jam Session yang sudah mengundangmu.</p>
        <button class="btn-create-jam-session-small" @click="handleCreateJamSessionClick">
          <i class="ti ti-plus"></i> Buat Jam Session
        </button>
      </div>

      <div class="scroll-body">
        <div v-if="loading" class="center-state">
          <div class="spinner"></div>
          <span>Memuat jam session...</span>
        </div>

        <div v-else-if="error" class="form-error">{{ error }}</div>

        <div v-else-if="jamSessions.length === 0" class="center-state">
          <i class="ti ti-music" style="font-size:32px; color: var(--text-dim);"></i>
          <span>Belum ada jam session yang terhubung denganmu.</span>
          <span style="font-size:11px;">Jam Session akan muncul di sini saat ada yang mengundangmu untuk jamming.</span>
        </div>

        <div v-if="showJamSessionLimitModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div style="background: #1a1311; border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 320px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
              <!-- <h3 style="color: #fff; margin-bottom: 10px; font-size: 18px; font-weight: 700;">Simpan Perubahan?</h3> -->
              <p style="color: var(--text-muted); font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                Satu user hanya dapat membuat 1 jam session, hapus jam session anda sebelumnya jika kamu ingin membuat jam session baru.
              </p>
              <button class="btn-primary" @click="showJamSessionLimitModal = false">Tutup</button>    
            </div>
          </div>

          <div v-if="modals.confirm" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: #1a1311; border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 320px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
              <h3 style="color: #fff; margin-bottom: 10px; font-size: 18px; font-weight: 700;">Pengajuan hapus jam session</h3>
              <p style="color: var(--text-muted); font-size: 13px; line-height: 1.5; margin-bottom: 24px;">
                Apakah Anda yakin ingin menghapus jam session Anda?
              </p>
              
              <div style="display: flex; gap: 12px;">
                <button @click="exitConfirmModal" class="btn-ghost" style="flex: 1; padding: 10px; margin: 0;">
                  Batal
                </button>
                <button @click="triggerConfirm(jamSession)" class="btn-primary" style="flex: 1; padding: 10px; margin: 0;">
                  Ya
                </button>
              </div>
            </div>
          </div>


        <!-- Jam Session cards -->
        <div
          v-for="jamSession in jamSessions"
          :key="jamSession.id"
          class="jam-card"
        >
          <!-- Card header — always visible -->
          <div class="jam-card-header" @click="toggleJamSession(jamSession.id)">
            <div style="flex:1;">
              <div class="jam-card-title">{{ jamSession.nama }}</div>
              <div class="jam-card-sub">
                {{ Array.isArray(jamSession.genre) ? jamSession.genre.join(', ') : jamSession.genre }}
                · {{ jamSession.kota }}<span v-if="jamSession.kecamatan">, {{ jamSession.kecamatan }}</span>
              </div>
              <div v-if="jamSession.rehersal_place" class="jam-card-studio">
                <i class="ti ti-map-pin"></i> {{ jamSession.rehersal_place }}
              </div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
              <span v-if="jamSession.unread_count > 0" class="badge">{{ jamSession.unread_count }}</span>
              <i :class="['ti', expandedJamSessions.includes(jamSession.id) ? 'ti-chevron-up' : 'ti-chevron-down']"
                style="color: var(--text-dim); font-size:14px;"></i>
            </div>
          </div>

          <!-- Expanded content -->
          <div v-if="expandedJamSessions.includes(jamSession.id)" class="jam-card-body">

            <div v-if="jamSession.created_by === auth.user?.id" style="margin-top: 10px;">
              <button 
                @click="showConfirmModal(jamSession)" 
                :disabled="jamSession.delete_request"
                :class="['btn-primary', jamSession.delete_request ? 'disabled' : '']"
                style="width: 100%; padding: 10px; font-size: 11px; cursor: pointer;"
              >
                <i class="ti ti-trash"></i> 
                {{ jamSession.delete_request ? 'Menunggu Admin...' : 'Hapus Jam Session' }}
              </button>
            </div>
            <p v-if="requestDeleteSent===true" style="font-size:11px">Permintaan hapus jam session sudah diajukan</p>

            <!-- Status badge -->
            <div v-if="jamSession.conversation_status" class="status-badge-row">
              <div class="status-badge" :class="statusClass(jamSession.conversation_status)">
                <i :class="statusIcon(jamSession.conversation_status)"></i>
                {{ statusLabel(jamSession.conversation_status) }}
              </div>
            </div>

            <!-- Rehearsal datetime -->
            <div v-if="jamSession.rehersal_datetime" class="jam-detail-row">
              <i class="ti ti-calendar"></i>
              <span>{{ formatDate(jamSession.rehersal_datetime) }}</span>
            </div>



            <!-- Member list -->
            <div class="member-list">
              <div class="member-row">
                <span class="member-dot" style="background:#e0635f;"></span>
                <span class="member-label">Vokalis</span>
                <span class="member-name">
                  {{ memberName(jamSession, 'vokalis') }}
                </span>
              </div>
              <div class="member-row">
                <span class="member-dot" style="background:#e0c35f;"></span>
                <span class="member-label">Gitaris</span>
                <span class="member-name">
                  {{ memberName(jamSession, 'gitaris') }}
                </span>
              </div>
              <div class="member-row">
                <span class="member-dot" style="background:#5f9ee0;"></span>
                <span class="member-label">Bassist</span>
                <span class="member-name">
                  {{ memberName(jamSession, 'bassist') }}
                </span>
              </div>
              <div class="member-row">
                <span class="member-dot" style="background:#5fe0a3;"></span>
                <span class="member-label">Drummer</span>
                <span class="member-name">
                  {{ memberName(jamSession, 'drummer') }}
                </span>
              </div>
            </div>

            <!-- Chat button -->
            <button class="btn-primary" style="margin-top:12px;" @click="openChat(jamSession)">
              <i class="ti ti-message-circle"></i> Chat
            </button>

            

            <!-- Songlist -->
            <div v-if="jamSession.songlist && jamSession.songlist.length > 0" class="songlist">
              <div class="songlist-label">Songlist:</div>
              <div v-for="song in jamSession.songlist" :key="song" class="songlist-item">
                <i class="ti ti-minus"></i> {{ song }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, inject} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, extractError } from '../stores/auth'
import { useJamSessionsStore } from '../stores/jamSessions'
import { jamSessionsApi } from '../api/jamSessions'
import BottomNav from '../components/BottomNav.vue'
import MatchmakingRadar from '../components/MatchmakingRadar.vue'

const router = useRouter()
const auth = useAuthStore()
const store = useJamSessionsStore()

let jamSessionData = ref('')
let requestDeleteSent = ref(false)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const saved = ref(false)
const jamSessions = ref([])
const expandedJamSessions = ref([])
const showRadar = ref(false)
const radarMessage = ref('Sedang mencari jam session untukmu')
const radarShownOnce = ref(false)
const RADAR_KEY = 'rejam_matchmaking_shown'
const showJamSessionLimitModal = ref(false)
const modals = inject('globalModals');
const userHasCreatedJamSession = computed(() => {
  // Pastikan jamSessions sudah terisi
  if (!jamSessions.value || !auth.user) return false;
  // Cek apakah ada jam session di list yang created_by-nya adalah user yang sedang login
  return jamSessions.value.some(js => js.created_by === auth.user.id);
});
const handleCreateJamSessionClick = () => {
  if (userHasCreatedJamSession.value) {
    showJamSessionLimitModal.value = true // Gunakan nama baru
  } else {
    router.push('/jam-sessions/create')
  }
}

onMounted(async () => {
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
    jamSessions.value = store.jamSessions
    if (jamSessions.value.length === 0 && !radarShownOnce.value) {
      radarMessage.value = 'Mencari ulang jam session yang cocok untukmu'
      showRadar.value = true
      radarShownOnce.value = true
      return
    }
  } catch {
    error.value = store.error || 'Gagal memuat jam session.'
  } finally {
    loading.value = false
  }
}

async function onRadarDone() {
  showRadar.value = false
  await fetchJamSessions()
}

function toggleJamSession(jamSessionId) {
  if (expandedJamSessions.value.includes(jamSessionId)) {
    expandedJamSessions.value = expandedJamSessions.value.filter((id) => id !== jamSessionId)
  } else {
    expandedJamSessions.value.push(jamSessionId)
  }
}

function openChat(jamSession) {
  router.push(`/chats/${jamSession.id}`)
}

function memberName(jamSession, role) {
  // If user is invited for this role and status is accepted+, show user's name
  const acceptedStatuses = ['accepted', 'negotiating', 'waiting_payment', 'ready']
  if (jamSession.invited_role === role && acceptedStatuses.includes(jamSession.conversation_status)) {
    return auth.user?.nama_panggung || auth.user?.nama || 'Kamu'
  }
  return jamSession[`${role}_nama`] || '[empty seat]'
}

function statusLabel(status) {
  const labels = {
    pending: 'Invited',
    accepted: 'Accepted',
    negotiating: 'Discussion',
    declined: 'Declined',
    waiting_payment: 'Waiting for Payment',
    ready: 'Ready to Jam',
  }
  return labels[status] || status
}

function statusClass(status) {
  const classes = {
    pending: 'status-red',
    accepted: 'status-green',
    negotiating: 'status-yellow',
    declined: 'status-red',
    waiting_payment: 'status-red',
    ready: 'status-green',
  }
  return classes[status] || ''
}

function statusIcon(status) {
  const icons = {
    pending: 'ti ti-alert-circle',
    accepted: 'ti ti-circle-check',
    negotiating: 'ti ti-clock',
    declined: 'ti ti-circle-x',
    waiting_payment: 'ti ti-alert-circle',
    ready: 'ti ti-circle-check',
  }
  return icons[status] || 'ti ti-circle'
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// async function handleRequestDelete(jamSession) {
//   if (!confirm("Apakah Anda yakin ingin mengajukan penghapusan jam session ini?")) return;

//   try {
//     await jamSessionsApi.requestDelete(jamSession.id);
//     jamSession.delete_request = true; // Update status lokal agar UI langsung bereaksi
//     alert("Request penghapusan berhasil dikirim ke admin.");
//   } catch (err) {
//     alert("Gagal mengirim request: " + (err.response?.data?.error || "Terjadi kesalahan"));
//   }
// }
function showConfirmModal(jamSession) {
  console.log("di showConfirmModal. jamSession:", jamSession)
  jamSessionData = jamSession
  modals.value.confirm = true;
}
function triggerConfirm(jamSession) {
  modals.value.confirm = false; // Tutup modal konfirmasi
  handleDeleteRequest(jamSessionData);                   // Jalankan fungsi hit ke backend Django
  console.log("di triggerConfirm. jamSession:", jamSession)
  console.log("di triggerConfirm. jamSessionData:", jamSessionData)
  console.log("di triggerConfirm. auth:", auth)
}
function exitConfirmModal() {
  modals.value.confirm = false
}

async function handleDeleteRequest(jamSessionData) {
  console.log("sampai handleDeleteRequest")
  // console.log("jamSession:", jamSession)
  error.value = ''
  saved.value = false
  saving.value = true

  try {
    const { data } = await jamSessionsApi.requestDelete(jamSessionData.id,auth)
    // auth.setUser(data)
    // saved.value = true
    setTimeout(() => (saved.value = false), 2000)
    requestDeleteSent = true
    // jamSession.delete_request = true
  } catch (err) {
    error.value = extractError(err)
  } 
  // finally {
  //   saving.value = false
  // }
}

</script>

<style scoped>
.jam-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.jam-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px;
  cursor: pointer;
}

.jam-card-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
}

.jam-card-sub {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 3px;
}

.jam-card-studio {
  color: var(--text-dim);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.jam-card-body {
  padding: 0 14px 14px;
  border-top: 0.5px solid var(--border);
}

.status-badge-row {
  padding: 10px 0 8px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-red {
  background: var(--red-dim);
  color: var(--red);
  border: 1px solid var(--red-border);
}

.status-yellow {
  background: rgba(224, 195, 95, 0.15);
  color: #e0c35f;
  border: 1px solid rgba(224, 195, 95, 0.35);
}

.status-green {
  background: rgba(95, 224, 163, 0.15);
  color: #5fe0a3;
  border: 1px solid rgba(95, 224, 163, 0.35);
}

.jam-detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 10px;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 10px 0;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.member-label {
  color: var(--text-dim);
  font-size: 12px;
  width: 55px;
  flex-shrink: 0;
}

.member-name {
  color: var(--text-white);
  font-size: 12px;
}

.songlist {
  margin-top: 12px;
  border-top: 0.5px solid var(--border);
  padding-top: 10px;
}

.songlist-label {
  color: var(--text-dim);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.songlist-item {
  color: var(--text-muted);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}


.header-action-row {
  display: flex;
  align-items: center; /* Menjajarkan teks dan tombol secara vertikal */
  justify-content: flex-start; /* Mendorong teks ke kiri dan tombol ke kanan */
  margin-bottom: 12px;
  padding: 0 0px;
  gap: 2px;
}

.btn-create-jam-session-small {
  /*margin-left: auto;*/
  width: 33.33%; /* Tepat 1/3 lebar layar */
  padding: 8px 0;
  background: transparent;
  color: var(--text-white);
  border: 1px dashed var(--border);
  border-radius: 8px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-create-jam-session-small:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
}

</style>