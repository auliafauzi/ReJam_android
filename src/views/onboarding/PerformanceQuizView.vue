<template>
  <div class="screen active" id="s-step3">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>

    <div class="scroll-body" style="padding-top:4px;">
      <div v-if="error" class="form-error">{{ error }}</div>

      <p style="color:#fff; font-size:14px; line-height:1.65; margin-bottom:16px;">Pernahkah kamu tampil sebelumnya?</p>
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
  { val: 'a', label: 'Saya pernah tampil di tempat publik (mall / cafe / event)' },
  { val: 'b', label: 'Saya pernah tampil di acara komunitas (sekolah / kampus / komunitas)' },
  { val: 'c', label: 'Saya belum pernah tampil sebelumnya' },
]

const answer = ref('')
const loading = ref(false)
const error = ref('')

async function handleNext() {
  error.value = ''
  loading.value = true
  try {
    await auth.submitStep3({ answer: answer.value })
    router.push('/onboarding/skill')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
