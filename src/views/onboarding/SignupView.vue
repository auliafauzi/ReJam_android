<template>
  <div class="screen active" id="s-step1">
    <div class="progress-bar">
      <div class="prog-seg done"></div>
      <div class="prog-seg"></div>
      <div class="prog-seg"></div>
      <div class="prog-seg"></div>
      <div class="prog-seg"></div>
    </div>
    <div class="step-label">LANGKAH 1 DARI 5</div>
    <h2 class="screen-title">Buat akunmu</h2>
    <p class="screen-subtitle">Pertama, ayo daftar dulu. Setelah ini kamu akan mengatur profil musisimu.</p>

    <div class="scroll-body">
      <div v-if="error" class="form-error">{{ error }}</div>

      <label class="field-label" style="margin-top:0;">Nama lengkap</label>
      <input v-model="form.nama" type="text" placeholder="cth. Andra Ramadhan">

      <label class="field-label">Username</label>
      <input v-model="form.username" type="text" placeholder="cth. andraramadhan">
      <p class="helper-text" style="margin-top:4px;">Dipakai untuk login. Hanya huruf, angka, dan underscore.</p>

      <label class="field-label">Nomor telepon</label>
      <input v-model="form.phone" type="tel" placeholder="08xx xxxx xxxx">

      <label class="field-label">Email</label>
      <input v-model="form.email" type="email" placeholder="kamu@contoh.com">

      <label class="field-label">Jenis kelamin</label>
      <div class="gender-group">
        <button
          class="gender-btn"
          :class="{ selected: form.gender === 'M' }"
          @click="form.gender = 'M'"
        >Laki-laki</button>
        <button
          class="gender-btn"
          :class="{ selected: form.gender === 'F' }"
          @click="form.gender = 'F'"
        >Perempuan</button>
      </div>

      <label class="field-label">Kata sandi</label>
      <div class="pw-wrap">
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Buat kata sandi (min. 6 karakter)"
        >
        <button class="pw-toggle" type="button" aria-label="Tampilkan kata sandi" @click="showPassword = !showPassword">
          <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
        </button>
      </div>

      <p class="helper-text">Dengan mendaftar, kamu setuju bahwa ini adalah komunitas untuk musisi non-profesional yang ingin bertemu dan bermain musik bersama — saling menghargai dan hadir jika sudah berkomitmen.</p>
    </div>

    <div class="btn-row">
      <button class="btn-ghost" @click="$router.push('/login')"><i class="ti ti-arrow-left"></i>Kembali</button>
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

const form = reactive({
  nama: '',
  username: '',
  phone: '',
  email: '',
  gender: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const AVATAR_COLORS = ['#e0635f', '#e0a35f', '#5fb0e0', '#8a5fe0', '#5fe0a3', '#e05f9e']

function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

async function handleNext() {
  error.value = ''

  if (!form.nama || !form.username || !form.email || !form.password) {
    error.value = 'Nama, username, email, dan kata sandi wajib diisi.'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Kata sandi minimal 6 karakter.'
    return
  }

  loading.value = true
  try {
    await auth.signup({
      username: form.username,
      email: form.email,
      password: form.password,
      nama: form.nama,
      phone: form.phone,
      gender: form.gender,
      avatar_color: randomAvatarColor(),
    })
    router.push('/onboarding/instruments')
  } catch {
    error.value = auth.error || 'Gagal mendaftar. Periksa kembali datamu.'
  } finally {
    loading.value = false
  }
}
</script>
