<template>
  <div class="screen active" id="s-step5">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>

    <div class="scroll-body" style="padding-top:0;">
      <div v-if="error" class="form-error">{{ error }}</div>

      <p style="color:#fff; font-size:14px; margin-bottom:14px;">Dimana lokasi favoritmu? (maksimal 2)</p>

      <div class="section-tag">Lokasi 1</div>
      <label class="field-label" style="margin-top:8px;">Kota</label>
      <select v-model="form.kota">
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>
      <label class="field-label">Kecamatan</label>
      <select v-model="form.kecamatan">
        <option v-for="k in kecamatans" :key="k" :value="k">{{ k }}</option>
      </select>

      <div class="section-tag" style="margin-top:20px;">Lokasi 2 <span style="color:#555; font-weight:400;">(opsional, gunakan untuk lokasi biasa kamu berkegiatan/bekerja)</span></div>
      <label class="field-label" style="margin-top:8px;">Kota</label>
      <select v-model="form.kota2">
        <option value="">— Pilih kota —</option>
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>
      <label class="field-label">Kecamatan</label>
      <select v-model="form.kecamatan2" :disabled="!form.kota2">
        <option value="">— Pilih kecamatan —</option>
        <option v-for="k in kecamatans" :key="k" :value="k">{{ k }}</option>
      </select>
    </div>

    <div class="btn-row">
      <button class="btn-ghost" @click="$router.back()"><i class="ti ti-arrow-left"></i>Kembali</button>
      <button class="btn-primary" :disabled="loading" @click="handleNext">
        {{ loading ? 'Memproses...' : 'Lanjut' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Medan']
const kecamatans = ['Kebayoran Baru', 'Senopati', 'Menteng', 'Cikini', 'Sudirman']

const form = reactive({
  kota: 'Jakarta',
  kecamatan: 'Kebayoran Baru',
  kota2: '',
  kecamatan2: '',
})

const loading = ref(false)
const error = ref('')

async function handleNext() {
  error.value = ''
  if (!form.kota) {
    error.value = 'Kota wajib diisi.'
    return
  }

  const payload = {
    kota: form.kota,
    kecamatan: form.kecamatan,
  }
  if (form.kota2) {
    payload.kota2 = form.kota2
    payload.kecamatan2 = form.kecamatan2
  }

  loading.value = true
  try {
    await auth.submitStep5(payload)
    router.push('/onboarding/stage-name')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
