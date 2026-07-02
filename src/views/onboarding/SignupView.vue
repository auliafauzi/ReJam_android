<template>
  <div class="signup-page-wrapper" style="position: relative;">
    
    <!-- 1. VUE MODAL MULTI-TAB & MULTI-BAHASA (DRAF DIPERBARUI) -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        
        <!-- Header Modal & Selector Bahasa -->
        <div class="modal-header-row">
          <h2 class="modal-title">
            {{ activeLang === 'ID' ? 'Ketentuan Layanan' : 'Legal Terms' }}
          </h2>
          <div class="lang-selector">
            <button 
              class="lang-tab-btn" 
              :class="{ active: activeLang === 'ID' }" 
              @click="activeLang = 'ID'"
            >ID</button>
            <button 
              class="lang-tab-btn" 
              :class="{ active: activeLang === 'EN' }" 
              @click="activeLang = 'EN'"
            >EN</button>
          </div>
        </div>
        
        <!-- Navigasi Tab Dokumen (Terms vs Privacy) -->
        <div class="doc-tabs-nav">
          <button 
            class="doc-tab-btn" 
            :class="{ active: activeDoc === 'terms' }" 
            @click="activeDoc = 'terms'"
          >
            {{ activeLang === 'ID' ? 'Syarat & Ketentuan' : 'Terms & Conditions' }}
          </button>
          <button 
            class="doc-tab-btn" 
            :class="{ active: activeDoc === 'privacy' }" 
            @click="activeDoc = 'privacy'"
          >
            {{ activeLang === 'ID' ? 'Kebijakan Privasi' : 'Privacy Policy' }}
          </button>
        </div>
        
        <!-- Area Konten Dokumen Legal (Scrollable) -->
        <div class="legal-scroll-body">
          
          <!-- KONTEN: SYARAT & KETENTUAN (TERMS & CONDITIONS) -->
          <div v-if="activeDoc === 'terms'">
            <div v-if="activeLang === 'ID'">
              <p class="doc-date"><strong>Terakhir Diperbarui:</strong> 1 Juli 2026</p>
              <p>Selamat datang di Re:Jam! Syarat & Ketentuan ini merupakan perjanjian mengikat antara Anda sebagai Pengguna dan Re:Jam sebagai penyedia platform.</p>
              <h3>1. Syarat Usia dan Pembuatan Akun</h3>
              <p>Anda wajib berusia 18 (delapan belas) tahun atau lebih untuk dapat menggunakan platform ini. Anda setuju untuk memberikan informasi pendaftaran yang akurat dan menjaga kerahasiaan kata sandi akun Anda.</p>
              <h3>2. Aturan Perilaku Komunitas</h3>
              <p>Re:Jam adalah ruang aman untuk berkolaborasi. Anda dilarang keras menyebarkan konten bermuatan SARA, ujaran kebencian, pornografi, pelecehan, melakukan penipuan identitas, atau melakukan spamming pesan.</p>
              <h3>3. Hak Kekayaan Intelektual</h3>
              <p>Seluruh materi platform (logo, kode, desain) adalah milik sah Re:Jam. Konten yang Anda unggah tetap milik Anda, namun Anda memberi lisensi kepada Re:Jam untuk menampilkannya di aplikasi demi fungsionalitas sistem.</p>
              <h3>4. Pembatasan Tanggung Jawab</h3>
              <p>Re:Jam hanya bertindak sebagai wadah digital. Kami tidak bertanggung jawab atas perselisihan, konflik, atau kerugian finansial yang terjadi antar-pengguna di dunia nyata (offline).</p>
            </div>
            <div v-else>
              <p class="doc-date"><strong>Last Updated:</strong> July 1, 2026</p>
              <p>Welcome to Re:Jam! These Terms & Conditions constitute a legally binding agreement between you as the User and Re:Jam as the platform provider.</p>
              <h3>1. Age Requirements and Account Creation</h3>
              <p>You must be 18 (eighteen) years of age or older to use this platform. You agree to provide accurate registration information and maintain the confidentiality of your account password.</p>
              <h3>2. Community Code of Conduct</h3>
              <p>Re:Jam is a safe space for musical collaboration. You are strictly prohibited from distributing hate speech, discrimination (SARA), pornography, harassment, identity theft, or sending unsolicited spam messages.</p>
              <h3>3. Intellectual Property Rights (IPR)</h3>
              <p>All materials within the platform (logos, source code, designs) are the exclusive property of Re:Jam. User-generated content remains your property, but you grant Re:Jam a license to display it within the app.</p>
              <h3>4. Limitation of Liability</h3>
              <p>Re:Jam solely acts as a digital intermediary. We are not liable for any disputes, conflicts, or losses that occur between users in real life (offline) after connecting through this platform.</p>
            </div>
          </div>

          <!-- KONTEN: KEBIJAKAN PRIVASI (PRIVACY POLICY - VERSI USER) -->
          <div v-if="activeDoc === 'privacy'">
            <div v-if="activeLang === 'ID'">
              <p>Selamat datang di Re:Jam! Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda ketika Anda mendaftar dan menggunakan platform Re:Jam. Re:Jam sepenuhnya tunduk kepada peraturan yang berlaku.</p>
              <p>Dengan mencentang kotak persetujuan saat pendaftaran, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh ketentuan dalam Kebijakan Privasi ini.</p>
              
              <h3>1. Batasan Usia dan Pelindungan Data Anak-Anak</h3>
              <p>Platform reJam dirancang dan ditujukan khusus untuk pengguna yang telah dewasa secara hukum.</p>
              <p><strong>Bukan untuk Anak-Anak:</strong> Layanan ini tidak ditujukan untuk anak-anak di bawah usia 18 (delapan belas) tahun. Kami menghindari pengumpulan, memproses, atau meminta data pribadi dari siapa pun yang berusia di bawah 18 tahun.</p>
              <p><strong>Tindakan Penghapusan Darurat:</strong> Jika kami mengetahui atau menerima laporan bahwa kami telah mengumpulkan data pribadi dari pengguna di bawah usia 18 tahun tanpa persetujuan sah dari orang tua/wali, kami akan segera mengambil tindakan tegas untuk menonaktifkan akun tersebut dan menghapus seluruh data terkait secara permanen dari server kami. Jika Anda meyakini ada kelalaian data anak pada platform kami, silakan hubungi kami melalui kontak yang tersedia.</p>
              
              <h3>2. Informasi yang Kami Kumpulkan</h3>
              <p>Kami mengumpulkan data pribadi yang Anda berikan secara sukarela untuk fungsionalitas platform, meliputi:</p>
              <p>• <strong>Data Identitas Akun:</strong> Nama pengguna (username), alamat email, dan kata sandi.</p>
              <p>• <strong>Data Profil Musik & Band:</strong> Informasi instrumen yang dikuasai, genre musik yang diminati, serta informasi terkait grup band yang Anda kelola atau ikuti.</p>
              <p>• <strong>Data Komunikasi:</strong> Isi pesan teks dan riwayat obrolan (conversations) yang Anda kirimkan antar-pengguna melalui fitur pesan internal reJam.</p>
              <p>• <strong>Data Lokasi:</strong> Lokasi yang diberikan oleh pengguna baik secara langsung maupun dengan penggunaan sistem.</p>
              
              <h3>3. Bagaimana Kami Menggunakan Data Pribadi Anda</h3>
              <p>Sesuai dengan asas legalitas undang-undang yang berlaku, kami memproses data Anda hanya untuk tujuan:</p>
              <p>• Menyediakan, mengoperasikan, dan memelihara fitur utama platform reJam.</p>
              <p>• Menghubungkan antar-musisi atau band berdasarkan kesamaan instrumen dan preferensi musik.</p>
              <p>• Memfasilitasi sistem pengiriman pesan internal yang aman.</p>
              <p>• Mengirimkan notifikasi teknis, pembaruan sistem keamanan, dan pesan administratif.</p>
              
              <h3>4. Keamanan dan Pembagian Data</h3>
              <p>• <strong>Keamanan Data:</strong> Kami menerapkan standar keamanan teknologi terbaik (termasuk enkripsi token dan enkripsi transmisi via protokol HTTPS) untuk mencegah akses tidak sah, kebocoran, atau perubahan data pribadi Anda.</p>
              <p>• <strong>Pembagian Data Terbatas:</strong> Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Profil musik Anda (instrumen/genre) akan ditampilkan di dalam aplikasi agar sesama pengguna Re:Jam dapat berkolaborasi.</p>
              
              <h3>5. Hak Anda sebagai Subjek Data</h3>
              <p>Anda memiliki hak penuh atas data pribadi Anda, yang meliputi:</p>
              <p>• <strong>Hak Akses dan Koreksi:</strong> Mengubah, memperbarui, atau memperbaiki kesalahan pada informasi profil Anda kapan saja melalui menu pengaturan aplikasi.</p>
              <p>• <strong>Hak Mengakhiri Pemrosesan (Penghapusan):</strong> Menghapus akun Anda secara permanen. Setelah akun dihapus, data profil Anda akan dimusnahkan dari sistem aktif kami sesuai dengan regulasi pemusnahan data yang berlaku.</p>
            </div>
            <div v-else>
              <p>Welcome to Re:Jam! We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you register and use the Re:Jam platform. Re:Jam fully complies with applicable regulations.</p>
              <p>By checking the consent box during registration, you acknowledge that you have read, understood, and agree to all terms of this Privacy Policy.</p>
              
              <h3>1. Age Restrictions and Children's Data Protection</h3>
              <p>Re:Jam is designed and intended specifically for users who are legal adults.</p>
              <p><strong>Not for Children:</strong> This Service is not intended for children under the age of 18 (eighteen). We refrain from collecting, processing, or soliciting personal data from anyone under the age of 18.</p>
              <p><strong>Emergency Removal Action:</strong> If we learn or receive a report that we have collected personal data from a user under the age of 18 without valid parental/guardian consent, we will immediately take decisive action to disable the account and permanently delete all related data from our servers. If you believe there has been any omission of child data on our platform, please contact us through the contact information provided.</p>
              
              <h3>2. Information We Collect</h3>
              <p>We collect personal data that you voluntarily provide for platform functionality, including:</p>
              <p>• <strong>Account Identity Data:</strong> Username, email address, and password.</p>
              <p>• <strong>Music & Band Profile Data:</strong> Information about instruments you master, musical genres you're interested in, and information about bands you manage or participate in.</p>
              <p>• <strong>Communication Data:</strong> The content of text messages and chat history you send between users via reJam's internal messaging feature.</p>
              <p>• <strong>Location Data:</strong> Locations provided by users, either given directly or through system usage.</p>
              
              <h3>3. How We Use Your Personal Data</h3>
              <p>In accordance with the legal principles of applicable laws, we process your data only for the following purposes:</p>
              <p>• Provide, operate, and maintain the core features of the reJam platform.</p>
              <p>• Connect musicians or bands based on shared instruments and musical preferences.</p>
              <p>• Facilitate a secure internal messaging system.</p>
              <p>• Send technical notifications, security updates, and administrative messages.</p>
              
              <h3>4. Security and Data Sharing</h3>
              <p>• <strong>Data Security:</strong> We implement the highest standards of technological security (including token encryption and transmission encryption via HTTPS) to prevent unauthorized access, leakage, or alteration of your personal data.</p>
              <p>• <strong>Limited Data Sharing:</strong> We do not sell or rent your personal data to third parties. Your music profile (instrument/genre) will be displayed within the app for collaboration with other Re:Jam users.</p>
              
              <h3>5. Your Rights as a Data Subject</h3>
              <p>You have full rights over your personal data, which include:</p>
              <p>• <strong>Right of Access and Correction:</strong> Change, update, or correct errors in your profile information at any time through the app settings menu.</p>
              <p>• <strong>Right to End Processing (Deletion):</strong> Permanently delete your account. Once your account is deleted, your profile data will be destroyed from our active systems in accordance with applicable data destruction regulations.</p>
            </div>
          </div>

        </div>

        <!-- Checkbox Persetujuan Global -->
        <div class="modal-checkbox-row">
          <input type="checkbox" id="legal-agree" v-model="hasCheckedBox">
          <label for="legal-agree">
            <span v-if="activeLang === 'ID'">
              Saya menyatakan bahwa saya <strong>telah berusia 18 tahun atau lebih</strong>, serta telah membaca dan menyetujui Syarat & Ketentuan serta Kebijakan Privasi Re:Jam.
            </span>
            <span v-else>
              I declare that I am <strong>18 years of age or older</strong>, and I have read and agreed to the Terms & Conditions and Privacy Policy of Re:Jam.
            </span>
          </label>
        </div>

        <!-- Tombol Aksi Modal -->
        <div class="modal-btn-row">
          <button class="btn-ghost" @click="$router.push('/login')">
            {{ activeLang === 'ID' ? 'Batal' : 'Cancel' }}
          </button>
          <button class="btn-primary" :disabled="!hasCheckedBox" @click="showModal = false">
            {{ activeLang === 'ID' ? 'Lanjutkan Pendaftaran' : 'Continue Registration' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 2. FORM EXISTING LANGKAH 1 DARI 6 -->
    <div class="screen active" id="s-step1" :class="{ 'blur-background': showModal }">
      <div class="progress-bar">
        <div class="prog-seg done"></div>
        <div class="prog-seg"></div>
        <div class="prog-seg"></div>
        <div class="prog-seg"></div>
        <div class="prog-seg"></div>
        <div class="prog-seg"></div>
      </div>
      <div class="step-label">LANGKAH 1 DARI 6</div>
      <h2 class="screen-title">Buat akunmu</h2>
      <p class="screen-subtitle">Pertama, ayo daftar dulu. Setelah ini kamu akan mengatur profil musisimu.</p>

      <div class="scroll-body">
        <div v-if="error" class="form-error">{{ error }}</div>

        <label class="field-label" style="margin-top:0;">Nama lengkap</label>
        <input v-model="form.nama" type="text" placeholder="cth. Andra Ramadhan" >

        <label class="field-label">Nomor telepon</label>
        <input v-model="form.phone" type="tel" placeholder="08xx xxxx xxxx" >

        <label class="field-label">Email</label>
        <input v-model="form.email" type="email" placeholder="kamu@contoh.com" >

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
          <button class="pw-toggle" type="button" aria-label="Tampilkan kata sandi"  @click="showPassword = !showPassword">
            <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
          </button>
        </div>

        <p class="helper-text">Dengan mendaftar, kamu setuju bahwa ini adalah komunitas untuk musisi non-profesional yang ingin bertemu dan bermain musik bersama — saling menghargai dan hadir jika sudah berkomitmen.</p>
      </div>

      <div class="btn-row">
        <button class="btn-ghost"  @click="$router.push('/login')"><i class="ti ti-arrow-left"></i>Kembali</button>
        <button class="btn-primary" :disabled="loading || showModal" @click="handleNext">
          {{ loading ? 'Memproses...' : 'Lanjut' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// State Pengendali Modal & Tab Navigasi
const showModal = ref(true)
const hasCheckedBox = ref(false)
const activeDoc = ref('terms')    // 'terms' atau 'privacy'
const activeLang = ref('ID')      // 'ID' atau 'EN'

const form = reactive({
  nama: '',
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

  if (!form.nama || !form.email || !form.password) {
    error.value = 'Nama, email, dan kata sandi wajib diisi.'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Kata sandi minimal 6 karakter.'
    return
  }

  loading.value = true
  try {
    await auth.signup({
      email: form.email,
      password: form.password,
      nama: form.nama,
      phone: form.phone,
      gender: form.gender,
      avatar_color: randomAvatarColor(),
      isTermsAgreed: true
    })
    router.push('/onboarding/instruments')
  } catch {
    error.value = auth.error || 'Gagal mendaftar. Periksa kembali datamu.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ==========================================================================
   CSS MODAL REJAM DENGAN SISTEM NAVIGASI TAB
   ========================================================================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 16px;
  box-sizing: border-box;
}

.modal-box {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

/* Header Modal & Selector Bahasa */
.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.lang-selector {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 6px;
}

.lang-tab-btn {
  border: none;
  background: transparent;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.lang-tab-btn.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Tab Navigasi Dokumen (Terms vs Privacy) */
.doc-tabs-nav {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 16px;
  gap: 16px;
}

.doc-tab-btn {
  background: transparent;
  border: none;
  padding: 8px 4px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.doc-tab-btn.active {
  color: #e0635f;
}

.doc-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #e0635f;
}

/* Kotak Konten Teks Legal Ber-scroll */
.legal-scroll-body {
  height: 220px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  padding: 14px;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
  line-height: 1.6;
  color: #334155;
  margin-bottom: 16px;
}

.doc-date {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}

.legal-scroll-body h3 {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 16px 0 4px 0;
}

.legal-scroll-body p {
  margin: 0 0 10px 0;
}

/* Checkbox & Button Layout */
.modal-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.modal-checkbox-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  cursor: pointer;
}

.modal-checkbox-row label {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
}

.modal-btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn-row button {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}

/* Efek Blur Form */
.blur-background {
  filter: blur(2px);
  pointer-events: none;
}
</style>