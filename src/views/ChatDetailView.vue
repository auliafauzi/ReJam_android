<template>
  <div class="screen active" id="s-chat-detail">
    <!-- Header -->
    <div class="onboard-header">
      <button class="btn-ghost" style="padding:8px 10px; border:none;" @click="$router.push('/chats')">
        <i class="ti ti-arrow-left"></i>
      </button>
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">{{ conversation?.jam_session_nama || 'Chat' }}</span>
      <span v-if="isAdmin && conversation?.user_nama" style="color:var(--text-dim); font-size:11px; margin-left:4px;">
        → {{ conversation.user_nama }}
      </span>
    </div>

    <!-- Status banner for regular user -->
    <div
      v-if="!isAdmin && conversation?.status && conversation.status !== 'pending'"
      style="padding: 8px 20px; font-size:12px; text-align:center; flex-shrink:0;"
      :style="statusBannerStyle"
    >
      {{ statusBannerText }}
    </div>

    <!-- Messages -->
    <div class="scroll-body" ref="scrollEl">
      <div v-if="loading" class="center-state">
        <div class="spinner"></div>
        <span>Memuat pesan...</span>
      </div>

      <div v-else-if="error" class="form-error">{{ error }}</div>

      <div v-else-if="!conversation?.messages?.length" class="center-state">
        <i class="ti ti-message-circle" style="font-size:32px; color: var(--text-dim);"></i>
        <span>Belum ada pesan.</span>
      </div>

      <div v-for="msg in conversation?.messages" :key="msg.id" class="msg-row" :class="{ mine: isMine(msg) }">
        <div class="msg-bubble">
          <div v-if="!isMine(msg)" style="font-size:10px; color: var(--text-dim); margin-bottom:3px;">
            {{ msg.from_session_manager ? conversation.jam_session_nama : msg.sender_nama }}
          </div>
          {{ msg.text }}
          <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- 3 action buttons — only for regular user when status is pending -->
    <div
      v-if="!isAdmin && conversation?.status === 'pending'"
      style="display:flex; flex-direction:column; gap:8px; padding: 0 20px 10px; flex-shrink:0;"
    >
      <button class="btn-primary" :disabled="responding" @click="respond('accepted')">
        <i class="ti ti-check"></i> Gas!
      </button>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn-secondary" :disabled="responding" @click="respond('negotiating')">
          <i class="ti ti-message-2"></i> Tertarik, tapi saya ingin discuss mengenai songlist/jadwal latihan.
        </button>
        <button class="btn-ghost" style="font-size:14px; text-align:center; white-space:normal; line-height:1.4;" :disabled="responding" @click="respond('declined')">
          Sorry, sepertinya saya kurang cocok untuk jam session ini.
        </button>
      </div>
    </div>

    <!-- Message input — shown for admin always, or for user when not declined -->
    <div
      v-if="isAdmin || (conversation?.status !== 'declined' && conversation?.status !== 'pending')"
      style="display:flex; gap:8px; padding: 0 20px 16px; flex-shrink:0;"
    >
      <input
        v-model="draft"
        type="text"
        placeholder="Tulis pesan..."
        @keyup.enter="send"
      >
      <button
        class="btn-primary"
        style="width:auto; padding: 12px 18px;"
        :disabled="sending || !draft.trim()"
        @click="send"
      >
        <i class="ti ti-send"></i>
      </button>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useJamSessionsStore } from '../stores/jamSessions'
import { messagingApi } from '../api/messaging'
import BottomNav from '../components/BottomNav.vue'

const route = useRoute()
const auth = useAuthStore()
const store = useJamSessionsStore()

const loading = ref(true)
const sending = ref(false)
const responding = ref(false)
const error = ref('')
const draft = ref('')
const scrollEl = ref(null)

const conversation = computed(() => store.conversation)
const isAdmin = computed(() => auth.user?.is_superuser)

const jamSessionId = route.params.jamSessionId
const convId = route.params.convId  // only set for admin route

onMounted(async () => {
  try {
    await store.fetchConversation(jamSessionId, isAdmin.value ? convId : null)
    await scrollToBottom()
  } catch {
    error.value = store.error || 'Gagal memuat percakapan.'
  } finally {
    loading.value = false
  }
})

function isMine(msg) {
  if (isAdmin.value) return msg.from_session_manager
  return !msg.from_session_manager && msg.sender_id === auth.user?.id
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

async function send() {
  const text = draft.value.trim()
  if (!text) return
  sending.value = true
  try {
    // Use convId for admin route, otherwise use conversation.value.id
    const targetConvId = conversation.value.id
    await store.sendMessage(targetConvId, text)
    draft.value = ''
    await scrollToBottom()
  } catch {
    error.value = 'Gagal mengirim pesan.'
  } finally {
    sending.value = false
  }
}

async function respond(status) {
  responding.value = true
  try {
    await messagingApi.updateStatus(conversation.value.id, status)
    // Update local state
    store.conversation.status = status
  } catch {
    error.value = 'Gagal memperbarui status.'
  } finally {
    responding.value = false
  }
}

// Status banner
const statusBannerStyle = computed(() => {
  const styles = {
    accepted: 'background: rgba(95,224,163,0.15); color: #5fe0a3;',
    declined: 'background: var(--red-dim); color: var(--red);',
    negotiating: 'background: rgba(224,163,95,0.15); color: #e0a35f;',
  }
  return styles[conversation.value?.status] || ''
})

const statusBannerText = computed(() => {
  const texts = {
    accepted: '✅ Kamu sudah menyatakan tertarik pada jam session ini.',
    declined: '❌ Kamu sudah menolak undangan ini.',
    negotiating: '🔄 Kamu sedang mendiskusikan detail dengan jam session ini.',
  }
  return texts[conversation.value?.status] || ''
})
</script>