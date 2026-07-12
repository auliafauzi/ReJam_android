<template>
  <div class="screen active">
    <div class="onboard-header">
      <button class="btn-ghost" style="padding:8px 10px; border:none;" @click="$router.back()">
        <i class="ti ti-arrow-left"></i>
      </button>
      <!-- <span class="header-title">Buat Band Baru</span> -->
      <h2 class ="screen-title" style= "font-size:18px">Buat Band Baru</h2>
    </div>

    <div class="scroll-body" style="padding: 20px;">
      <form @submit.prevent="submitBand" class="band-form">
        
        <div class="form-group">
          <label>Nama Band</label>
          <input v-model="form.nama" type="text" required placeholder="Masukkan nama band">
        </div>

        <div class="form-group">
          <label>Kota</label>
          <select v-model="form.kota" required>
            <option value="" disabled>Pilih kota</option>
            <option v-if="auth.user?.kota" :value="auth.user.kota">{{ auth.user.kota }}</option>
            <option v-if="auth.user?.kota2" :value="auth.user.kota2">{{ auth.user.kota2 }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Genre</label>
          <div class="picker-group">
            <button 
              v-for="g in availableGenres" :key="g"
              type="button"
              class="picker-btn"
              :class="{ selected: form.genre.includes(g) }"
              @click="toggleGenre(g)"
            >{{ g }}</button>
          </div>
        </div>

        <div class="form-group">
          <label>Pilih Instrumen Anda di Band Ini</label>
          <div class="picker-group">
            <button 
              v-for="inst in availableInstruments" :key="inst"
              type="button"
              class="picker-btn"
              :class="{ selected: form.instrumen === inst }"
              @click="form.instrumen = inst"
            >{{ inst }}</button>
          </div>
        </div>

        <div class="form-group">
          <label>Songlist Awal <p style="font-size: 11px">(songlist dapat berubah seiring keberjalanan band)</p></label>
          <textarea 
            v-model="form.songlist_awal" 
            rows="5" 
            placeholder=
            "Tulis lagu, tekan Enter untuk lagu berikutnya: Coldplay - Yellow 
Sheila On 7 - Kita"
          ></textarea>
        </div>

        <div v-if="errorMessage" class="form-error">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading" style="width: 100%; margin-top: 20px;">
          {{ loading ? 'Memproses...' : 'Simpan Band' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBandsStore } from '../stores/bands'
import { optionsApi } from '../api/options'
import { bandsApi } from '../api/bands'

const router = useRouter()
const auth = useAuthStore()
const store = useBandsStore()

const loading = ref(false)
const errorMessage = ref('')

// Data statis (bisa dipindah ke store/config)
// const availableGenres = ['Rock', 'Pop', 'Jazz', 'Blues', 'Metal', 'Funk', 'Indie', 'Dangdut']
// const availableInstruments = ['Vokalis', 'Gitaris', 'Bassist', 'Drummer', 'Keyboardist']

const availableGenres = ref([])
const availableInstruments = ref([])

const form = reactive({
  nama: '',
  kota: '',
  genre: [],
  instrumen: ''
})

onMounted(async () => {
  try {
    const [genreRes, instrumentRes] = await Promise.all([
      optionsApi.genres(),
      optionsApi.instruments(),
    ])
    availableGenres.value = genreRes.data
    availableInstruments.value = instrumentRes.data
  } catch (err) {
    errorMessage.value = 'Gagal memuat pilihan genre atau instrumen.'
  }
})

function toggleGenre(genre) {
  const index = form.genre.indexOf(genre)
  if (index > -1) {
    form.genre.splice(index, 1)
  } else {
    form.genre.push(genre)
  }
}

async function submitBand() {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const processedSonglist = (form.songlist_awal || '')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '')
    const payload = {
      nama: form.nama,
      kota: form.kota,
      genre: form.genre,
      instrumen: form.instrumen,
      songlist: processedSonglist,
      level: auth.user.level // Diambil otomatis dari store user
    }
    const createBandSuccess = await store.createBand(payload)
    // const {data} = await bandsApi.forceMatch(createBandSuccess.id, payload)

    // router.push('/bands')
    // const forceMatch = await store.forceMatch("test_id", "test_payload")
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || 'Gagal membuat band.'
  } finally {
    loading.value = false
    router.push('/bands')
  }
}
</script>

<style scoped>
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; color: var(--text-dim); font-size: 13px; }
.form-group input, .form-group select { 
  width: 100%; padding: 12px; border-radius: 8px; 
  background: var(--bg-card); border: 1px solid var(--border); color: #fff;
}
.picker-group { display: flex; flex-wrap: wrap; gap: 8px; }
.picker-btn {
  padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border);
  background: transparent; color: var(--text-muted); cursor: pointer;
}
.picker-btn.selected {
  background: var(--primary); color: #fff; border-color: var(--primary);
}
.form-error { color: var(--red); font-size: 12px; margin-top: 10px; }
</style>