<template>
  <div class="screen active" id="s-step6">
    <div class="progress-bar">
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
    </div>
    <div class="step-label">LANGKAH 5 DARI 5</div>
    <div class="onboard-header" style="padding-top:6px;">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>

    <div class="scroll-body" style="padding-top:0;">
      <div v-if="error" class="form-error">{{ error }}</div>

      <p style="color:#fff; font-size:14px; line-height:1.65; margin-bottom:20px;">Biar seru, coba cari nama panggung yang pas buatmu!</p>
      <label class="field-label" style="margin-top:0; font-weight:500;">Nama Panggung</label>
      <input v-model="namaPanggung" type="text" placeholder="Nama panggilamu di atas panggung">
      <p class="helper-text">Nama ini akan muncul saat kamu bergabung atau diundang ke sesi jam.</p>
    </div>

    <div class="btn-row">
      <button class="btn-ghost" @click="$router.back()"><i class="ti ti-arrow-left"></i>Kembali</button>
      <button class="btn-primary" :disabled="loading || !namaPanggung.trim()" @click="handleFinish">
        {{ loading ? 'Memproses...' : 'Selesai' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const namaPanggung = ref('')
const loading = ref(false)
const error = ref('')

async function handleFinish() {
  error.value = ''
  loading.value = true
  try {
    await auth.submitStep6({ nama_panggung: namaPanggung.value.trim() })
    router.push('/onboarding/welcome')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
