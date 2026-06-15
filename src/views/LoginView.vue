<template>
  <div class="screen active" id="s-login">
    <div class="bg-texture"></div>
    <div class="rel">
      <div class="hero">
        <div class="logo-mark"><i class="ti ti-music"></i></div>
        <div class="brand-name">BandJam</div>
        <p class="brand-desc">Platform dimana penghobby musik non-profesional bisa bertemu dan bermain musik bersama.</p>
      </div>
      <div class="form-area">
        <h3>Log in</h3>

        <div v-if="error" class="form-error">{{ error }}</div>

        <label class="field-label" style="margin-top:0;">Nomor telepon / email / username</label>
        <input
          v-model="username"
          type="text"
          placeholder="08xx, kamu@email.com, atau username"
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
