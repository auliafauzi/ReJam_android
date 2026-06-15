<template>
  <div class="screen active" id="s-login">
    <div class="bg-texture"></div>
    <div class="rel">
      <div class="hero">
        <div class="logo-mark">
  <svg class="guitar-pick reference-style clean-gradient" viewBox="0 0 100 96" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heavyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color: #FFFFFF; stop-opacity: 1" />
        <stop offset="35%" style="stop-color: #ECECEC; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #A2A2A2; stop-opacity: 1" />
      </linearGradient>

      <filter id="softInnershadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
        <feOffset dy="1" dx="0"/>
        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadow"/>
        <feColorMatrix type="matrix" in="shadow" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.15 0"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M 46.5,96 
             C 48.5,98 51.5,98 53.5,96 
             C 69,76 88,52 88,36
             C 88,21 72,15 50,15
             C 28,15 12,21 12,36
             C 12,52 31,76 46.5,96 
             Z" 
          fill="url(#heavyGrad)" 
          filter="url(#softInnershadow)" />
  </svg>
</div>
        <div class="brand-name">BandJam</div>
        <p class="brand-desc">Platform dimana penghobby musik non-profesional bisa bertemu dan bermain musik bersama.</p>
      </div>
      <div class="form-area">
        <h3>Log in</h3>

        <div v-if="error" class="form-error">{{ error }}</div>

        <label class="field-label" style="margin-top:0;">Nomor telepon / email</label>
        <input
          v-model="username"
          type="text"
          placeholder="08xx, kamu@email.com,"
          autocomplete="username"
        >

        <label class="field-label">Kata sandi</label>
        <div class="pw-wrap">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Kata sandimu"
            autocomplete="current-password"
          >
          <button class="pw-toggle" type="button" aria-label="Tampilkan kata sandi" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
          </button>
        </div>

        <div class="forgot-row"><a href="#">Lupa kata sandi?</a></div>

        <button class="btn-primary" :disabled="loading" @click="handleLogin">
          {{ loading ? 'Memproses...' : 'Log in' }}
        </button>

        <span class="divider-text">Belum punya akun?</span>
        <button class="btn-secondary" @click="$router.push('/onboarding/signup')">Daftar</button>

        <div class="spacer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Nomor telepon/email dan kata sandi wajib diisi.'
    return
  }
  loading.value = true
  try {
    const user = await auth.login({ username: username.value, password: password.value })
    if (user.onboarding_complete) {
      router.push('/bands')
    } else {
      router.push('/onboarding/instruments')
    }
  } catch {
    error.value = auth.error || 'Email/nomor atau kata sandi salah.'
  } finally {
    loading.value = false
  }
}
</script>
