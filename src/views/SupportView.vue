<template>
  <div class="screen active" id="s-support">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">Re:Jam</span>
    </div>
    <h2 class="screen-title">Support Us</h2>
    <p class="screen-subtitle">Dukung kami atau butuh bantuan? Kami siap.</p>

    <div class="scroll-body">

      <!-- GROUP 1: SUPPORT US -->
      <div class="support-group">
        <div class="support-group-label">Support Us</div>

        <div class="support-card" @click="handleAction('Investor')">
          <div class="support-card-title">
            <i class="ti ti-briefcase"></i> Be our investor
          </div>
        </div>

        <div class="support-card" @click="handleAction('Donate')">
          <div class="support-card-title">
            <i class="ti ti-coin"></i> Donate
          </div>
        </div>

        <div class="support-card" @click="handleAction('Join Our Team')">
          <div class="support-card-title">
            <i class="ti ti-users"></i> Join our team
          </div>
        </div>

        <div class="support-card" @click="handleAction('Add Studio')">
          <div class="support-card-title">
            <i class="ti ti-building-community"></i> Add studio to our database
          </div>
        </div>

        <div class="support-card" @click="handleAction('Additional Player')">
          <div class="support-card-title">
            <i class="ti ti-user-plus"></i> Apply to be our additional player
          </div>
        </div>
      </div>

      <!-- GROUP 2: ASK FOR SUPPORT -->
      <div class="support-group">
        <div class="support-group-label">Ask for Support</div>

        <a href="mailto:support@rejam.app" class="support-link">
          <div class="support-card">
            <div class="support-card-title">
              <i class="ti ti-mail"></i> Hubungi kami
            </div>
          </div>
        </a>

        <div class="support-card" @click="toggleGuidelines">
          <div class="support-card-title dropdown-title">
            <span><i class="ti ti-shield-check"></i> Pedoman komunitas</span>
            <i :class="['ti', isGuidelinesOpen ? 'ti-chevron-up' : 'ti-chevron-down']"></i>
          </div>
          <div v-if="isGuidelinesOpen" class="guidelines-body">
            <p><strong>1. Saling Menghargai</strong><br>
            Re:Jam adalah wadah komunitas untuk musisi non-profesional dari segala tingkat keahlian. Jaga tutur kata dan hargai proses belajar sesama member.</p>
            <p><strong>2. Komitmen Kehadiran</strong><br>
            Jika kamu sudah menyepakati jadwal latihan bersama sebuah band, pastikan untuk hadir tepat waktu demi menghargai waktu rekan musisi lainnya.</p>
          </div>
        </div>
      </div>

    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()

const isGuidelinesOpen = ref(false)

function toggleGuidelines() {
  isGuidelinesOpen.value = !isGuidelinesOpen.value
}

const TOPIC_MAP = {
  'Investor': 'investor',
  'Donate': 'donate',
  'Join Our Team': 'join_team',
  'Add Studio': 'add_studio',
  'Additional Player': 'additional_player',
}

function handleAction(name) {
  const topic = TOPIC_MAP[name]
  if (topic) {
    router.push(`/support/${topic}`)
  }
}
</script>

<style scoped>
.support-group {
  border: 0.5px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
  background: var(--bg-card2);
}

.support-group-label {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  opacity: 0.9;
}

.support-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border);
  border-radius: 10px;
  padding: 13px 14px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.support-card:last-child {
  margin-bottom: 0;
}

.support-card:active {
  opacity: 0.7;
  transform: scale(0.98);
}

.support-card-title {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.support-card-title i {
  color: var(--red);
  font-size: 16px;
  flex-shrink: 0;
}

.dropdown-title {
  justify-content: space-between;
}

.dropdown-title span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.support-link {
  text-decoration: none;
  display: block;
  color: inherit;
  margin-bottom: 8px;
}

.support-link .support-card {
  margin-bottom: 0;
}

.guidelines-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 0.5px solid var(--border);
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.7;
}

.guidelines-body p {
  margin-bottom: 10px;
}

.guidelines-body p:last-child {
  margin-bottom: 0;
}

.guidelines-body strong {
  color: var(--text-white);
}
</style>