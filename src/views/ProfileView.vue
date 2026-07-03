<template>
  <div class="screen active" id="s-profile">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">Re:Jam</span>
    </div>
    <h2 class="screen-title">Profile</h2>

    <div class="scroll-body">
      <div v-if="error" class="form-error">{{ error }}</div>
      <div v-if="saved" class="band-card" style="border-color: var(--red); color: var(--red); text-align:center;">Profil diperbarui!</div>

      <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
        <div
          style="width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#fff; flex-shrink:0;"
          :style="{ background: user?.avatar_color || 'var(--red)' }"
        >
          {{ initials }}
        </div>
        <div>
          <div style="color:#fff; font-size:16px; font-weight:700;">{{ user?.nama_panggung || user?.nama }}</div>
          <div style="color: var(--text-muted); font-size:12px;">{{ user?.email }}</div>
        </div>
      </div>

      <label class="field-label" style="margin-top:0;">Nama Panggung</label>
      <input v-model="form.nama_panggung" type="text">

      <label class="field-label">Nama lengkap</label>
      <p style="color: var(--text-white); font-size:13px; padding: 12px 14px; background: var(--bg-card); border-radius: 10px; border: 0.5px solid var(--border);">{{ user?.nama }}</p>

      <label class="field-label">Email</label>
      <p style="color: var(--text-white); font-size:13px; padding: 12px 14px; background: var(--bg-card); border-radius: 10px; border: 0.5px solid var(--border);">{{ user?.email }}</p>

      <label class="field-label">Nomor telepon</label>
      <p style="color: var(--text-white); font-size:13px; padding: 12px 14px; background: var(--bg-card); border-radius: 10px; border: 0.5px solid var(--border);">{{ user?.phone || '-' }}</p>

      <div class="section-tag" style="margin-top:20px;">Musik</div>
      <div style="display:flex; gap:8px; margin-bottom:8px;">
        <div class="chip primary" v-if="user?.alatmusik_utama">{{ user.alatmusik_utama }} <i class="ti ti-star" style="font-size:10px;"></i></div>
        <div class="chip selected" v-for="i in otherInstruments" :key="i">{{ i }}</div>
      </div>
      <div style="display:flex; gap:8px;">
        <div class="chip primary" v-if="user?.genre_utama">{{ user.genre_utama }} <i class="ti ti-star" style="font-size:10px;"></i></div>
        <div class="chip selected" v-for="g in otherGenres" :key="g">{{ g }}</div>
      </div>

      <div class="section-tag" style="margin-top:20px;">Lokasi</div>
      <div class="band-card-sub">{{ user?.kota }}<span v-if="user?.kecamatan">, {{ user.kecamatan }}</span></div>
      <div v-if="user?.kota2" class="band-card-sub" style="margin-top:4px;">{{ user.kota2 }}<span v-if="user?.kecamatan2">, {{ user.kecamatan2 }}</span></div>

      <div class="section-tag" style="margin-top:20px;">Level</div>
      <div class="band-card-sub">{{ levelLabel }}</div>

      <div style="margin-top: 20px; padding-top: 4px; border-top: 0.5px solid var(--border); text-align: center;">
        <p style="color: var(--text-muted); font-size: 11px; margin-bottom: 1px; line-height: 1.4;padding: 0 10px;">
          Ingin berhenti menggunakan layanan kami dan menghapus data Anda?
        </p>
          <a 
            href="https://api.rejam.click/static/legal/delete-account-request.html" 
            target="_blank" 
            style="color: var(--red); font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;padding-bottom: 20px;"
          >
            <i class="ti ti-trash"></i> Permintaan Penghapusan Akun
        </a>
    </div>

    </div>

    <div class="btn-row">
      <button class="btn-ghost" :disabled="saving" @click="handleLogout"><i class="ti ti-logout"></i>Keluar</button>
      <button class="btn-primary" :disabled="saving" @click="showConfirmModal= true">
        {{ saving ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>

    <div v-if="showConfirmModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: #1a1311; border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 320px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
        <h3 style="color: #fff; margin-bottom: 10px; font-size: 18px; font-weight: 700;">Simpan Perubahan?</h3>
        <p style="color: var(--text-muted); font-size: 13px; line-height: 1.5; margin-bottom: 24px;">
          Apakah Anda yakin ingin memperbarui data profil Re:Jam Anda?
        </p>
        
        <div style="display: flex; gap: 12px;">
          <button @click="showConfirmModal = false" class="btn-ghost" style="flex: 1; padding: 10px; margin: 0;">
            Batal
          </button>
          <button @click="triggerSave" class="btn-primary" style="flex: 1; padding: 10px; margin: 0;">
            Ya, Simpan
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, extractError } from '../stores/auth'
import { authApi } from '../api/auth'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const auth = useAuthStore()

const user = computed(() => auth.user)
const error = ref('')
const saving = ref(false)
const saved = ref(false)
const showConfirmModal = ref(false)

const form = reactive({
  nama_panggung: '',
  nama: '',
  email: '',
  phone: '',
})

onMounted(async () => {
  try {
    await auth.fetchMe()
  } catch {
    // fall back to cached user already in store
  }
  syncForm()
})

function syncForm() {
  form.nama_panggung = user.value?.nama_panggung || ''
  // form.nama = user.value?.nama || ''
  // form.email = user.value?.email || ''
  // form.phone = user.value?.phone || ''
}

const initials = computed(() => {
  const name = user.value?.nama_panggung || user.value?.nama || '?'
  return name.slice(0, 2).toUpperCase()
})

const otherInstruments = computed(() =>
  (user.value?.alatmusik || []).filter((i) => i !== user.value?.alatmusik_utama)
)
const otherGenres = computed(() =>
  (user.value?.genre || []).filter((g) => g !== user.value?.genre_utama)
)

const LEVEL_LABELS = {
  beginner: 'Beginner',
  early_intermediate: 'Early Intermediate',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
const levelLabel = computed(() => LEVEL_LABELS[user.value?.level] || '-')

function triggerSave() {
  showConfirmModal.value = false; // Tutup modal konfirmasi
  handleSave();                   // Jalankan fungsi hit ke backend Django
}

async function handleSave() {
  error.value = ''
  saved.value = false
  saving.value = true
  try {
    const { data } = await authApi.updateMe({nama_panggung: form.nama_panggung,})
    auth.setUser(data)
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } catch (err) {
    error.value = extractError(err)
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>
