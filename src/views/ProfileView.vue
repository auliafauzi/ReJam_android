<template>
  <div class="screen active" id="s-profile">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
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
          <div style="color: var(--text-muted); font-size:12px;">{{ user?.username }}</div>
        </div>
      </div>

      <label class="field-label" style="margin-top:0;">Nama Panggung</label>
      <input v-model="form.nama_panggung" type="text">

      <label class="field-label">Nama lengkap</label>
      <input v-model="form.nama" type="text">

      <label class="field-label">Email</label>
      <input v-model="form.email" type="email">

      <label class="field-label">Nomor telepon</label>
      <input v-model="form.phone" type="tel">

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
    </div>

    <div class="btn-row">
      <button class="btn-ghost" :disabled="saving" @click="handleLogout"><i class="ti ti-logout"></i>Keluar</button>
      <button class="btn-primary" :disabled="saving" @click="handleSave">
        {{ saving ? 'Menyimpan...' : 'Simpan' }}
      </button>
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
  form.nama = user.value?.nama || ''
  form.email = user.value?.email || ''
  form.phone = user.value?.phone || ''
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
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  professional: 'Professional',
}
const levelLabel = computed(() => LEVEL_LABELS[user.value?.level] || '-')

async function handleSave() {
  error.value = ''
  saved.value = false
  saving.value = true
  try {
    const { data } = await authApi.updateMe({ ...form })
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
