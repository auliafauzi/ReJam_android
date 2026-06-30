<template>
  <div class="screen active" id="s-rehearsal">
    <div class="progress-bar">
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg"></div>
    </div>
    <div class="step-label">LANGKAH 5 DARI 6</div>
    <div class="onboard-header" style="padding-top:6px;">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">Re:Jam</span>
    </div>

    <h2 class="screen-title">Kapan kamu bisa latihan?</h2>
    <p class="screen-subtitle">Pilih waktu yang cocok untukmu. Boleh lebih dari satu.</p>

    <div class="scroll-body">
      <div v-if="error" class="form-error">{{ error }}</div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <button
          v-for="opt in options"
          :key="opt.key"
          class="opt-btn"
          :class="{ selected: selected.includes(opt.key) }"
          @click="toggle(opt.key)"
        >
          <div style="display:flex; align-items:center; gap:10px;">
            <i :class="opt.icon" style="font-size:18px; flex-shrink:0;"></i>
            <div>
              <div style="font-weight:600; font-size:13px;">{{ opt.label }}</div>
              <div style="font-size:11px; color: var(--text-muted); margin-top:2px;">{{ opt.desc }}</div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-ghost" @click="$router.back()"><i class="ti ti-arrow-left"></i>Kembali</button>
      <button class="btn-primary" :disabled="loading || selected.length === 0" @click="handleNext">
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
  {
    key: 'weekdays_after_office',
    label: 'Weekday setelah jam kerja',
    desc: 'Senin – Jumat, sekitar pukul 19.00 ke atas',
    icon: 'ti ti-briefcase',
  },
  {
    key: 'weekend_morning',
    label: 'Weekend pagi/siang',
    desc: 'Sabtu atau Minggu, pukul 08.00 – 14.00',
    icon: 'ti ti-sun',
  },
  {
    key: 'weekend_evening',
    label: 'Weekend sore/malam',
    desc: 'Sabtu atau Minggu, pukul 15.00 ke atas',
    icon: 'ti ti-moon',
  },
]

const selected = ref([])
const loading = ref(false)
const error = ref('')

function toggle(key) {
  if (selected.value.includes(key)) {
    selected.value = selected.value.filter((k) => k !== key)
  } else {
    selected.value.push(key)
  }
}

async function handleNext() {
  error.value = ''
  if (selected.value.length === 0) {
    error.value = 'Pilih minimal satu preferensi waktu latihan.'
    return
  }
  loading.value = true
  try {
    await auth.submitStep5b({ rehearsal_preference: selected.value })
    router.push('/onboarding/stage-name')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>