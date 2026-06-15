<template>
  <div class="screen active" id="s-step4">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>

    <div class="scroll-body" style="padding-top:4px;">
      <div v-if="error" class="form-error">{{ error }}</div>

      <p style="color:#fff; font-size:14px; line-height:1.65; margin-bottom:16px;">Seberapa mahir kamu memainkan alat musik?</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button
          v-for="opt in options"
          :key="opt.val"
          class="opt-btn"
          :class="{ selected: answer === opt.val }"
          @click="answer = opt.val"
        >{{ opt.label }}</button>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-ghost" @click="$router.back()"><i class="ti ti-arrow-left"></i>Kembali</button>
      <button class="btn-primary" :disabled="loading || !answer" @click="handleNext">
        {{ loading ? 'Memproses...' : 'Lanjut' }}
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

const options = [
  { val: 'a', label: 'Saya bisa jamming lewat feeling, tahu progres chord, improvisasi melodi lancar, dan bisa menyesuaikan nada dasar penyanyi secara instan' },
  { val: 'b', label: 'Saya nyaman membawakan lagu jika sudah latihan, tapi butuh sedikit waktu jika harus improvisasi mendadak atau pindah nada dasar' },
  { val: 'c', label: 'Saya masih belajar kunci dasar, atau baru bisa main beberapa lagu sederhana' },
]

const answer = ref('')
const loading = ref(false)
const error = ref('')

async function handleNext() {
  error.value = ''
  loading.value = true
  try {
    await auth.submitStep4({ answer: answer.value })
    router.push('/onboarding/location')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
