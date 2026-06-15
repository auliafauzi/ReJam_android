<template>
  <div class="screen active" id="s-chat-detail">
    <div class="onboard-header">
      <button class="btn-ghost" style="padding:8px 10px; border:none;" @click="$router.push('/chats')">
        <i class="ti ti-arrow-left"></i>
      </button>
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">{{ conversation?.band_nama || 'Chat' }}</span>
    </div>

    <div class="scroll-body" ref="scrollEl">
      <div v-if="loading" class="center-state">
        <div class="spinner"></div>
        <span>Memuat pesan...</span>
      </div>

      <div v-else-if="error" class="form-error">{{ error }}</div>

      <div v-else-if="!conversation?.messages?.length" class="center-state">
        <i class="ti ti-message-circle" style="font-size:32px; color: var(--text-dim);"></i>
        <span>Belum ada pesan. Mulai percakapan!</span>
      </div>

      <div v-for="msg in conversation?.messages" :key="msg.id" class="msg-row" :class="{ mine: isMine(msg) }">
        <div class="msg-bubble">
          <div v-if="!isMine(msg)" style="font-size:10px; color: var(--text-dim); margin-bottom:3px;">
            {{ msg.from_band ? conversation.band_nama : msg.sender_nama }}
          </div>
          {{ msg.text }}
          <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
        </div>
      </div>
    </div>

    <div style="display:flex; gap:8px; padding: 0 20px 16px; flex-shrink:0;">
      <input
        v-model="draft"
        type="text"
        placeholder="Tulis pesan..."
        @keyup.enter="send"
      >
      <button class="btn-primary" style="width:auto; padding: 12px 18px;" :disabled="sending || !draft.trim()" @click="send">
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
import { useBandsStore } from '../stores/bands'
import BottomNav from '../components/BottomNav.vue'

const route = useRoute()
const auth = useAuthStore()
const store = useBandsStore()

const loading = ref(true)
const sending = ref(false)
const error = ref('')
const draft = ref('')
const scrollEl = ref(null)

const conversation = computed(() => store.conversation)

const bandId = route.params.bandId

onMounted(async () => {
  try {
    await store.fetchConversation(bandId)
    await scrollToBottom()
  } catch {
    error.value = store.error || 'Gagal memuat percakapan.'
  } finally {
    loading.value = false
  }
})

function isMine(msg) {
  // "from_band" is true if the message was sent by the band admin side.
  // The current user is the invited user, so a message is "mine" if
  // from_band is false AND the sender matches the current user
  // (or simply: not from_band, since this view is the invited user's side).
  return !msg.from_band && msg.sender_id === auth.user?.id
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) {
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
}

async function send() {
  const text = draft.value.trim()
  if (!text) return
  sending.value = true
  try {
    await store.sendMessage(conversation.value.id, text)
    draft.value = ''
    await scrollToBottom()
  } catch {
    error.value = 'Gagal mengirim pesan.'
  } finally {
    sending.value = false
  }
}
</script>
