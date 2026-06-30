<template>
  <div class="screen active" id="s-support-chat">
    <!-- Header -->
    <div class="onboard-header">
      <button class="btn-ghost" style="padding:8px 10px; border:none;" @click="$router.push('/support')">
        <i class="ti ti-arrow-left"></i>
      </button>
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">Re:Jam Support</span>
    </div>

    <div class="scroll-body" ref="scrollEl">
      <div v-if="loading" class="center-state">
        <div class="spinner"></div>
        <span>Memuat percakapan...</span>
      </div>

      <div v-else-if="error" class="form-error">{{ error }}</div>

      <template v-else>
        <!-- Messages -->
        <div
          v-for="msg in conversation?.messages"
          :key="msg.id"
          class="msg-row"
          :class="{ mine: msg.from_user }"
        >
          <div class="msg-bubble">
            <div v-if="!msg.from_user" style="font-size:10px; color: var(--text-dim); margin-bottom:3px;">
              ReJam Team
            </div>
            {{ msg.text }}
            <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!conversation?.messages?.length" class="center-state">
          <i class="ti ti-message-circle" style="font-size:32px; color: var(--text-dim);"></i>
          <span>Mulai percakapan dengan menekan tombol di bawah.</span>
        </div>
      </template>
    </div>

    <!-- Opening message button — shown when not yet unlocked -->
    <div
      v-if="!loading && !conversation?.is_unlocked"
      style="padding: 0 20px 12px; flex-shrink:0;"
    >
      <button
        class="btn-primary"
        :disabled="sending"
        @click="sendOpeningMessage"
      >
        {{ openingMessage }}
      </button>
    </div>

    <!-- Free chat input — shown after unlocked -->
    <div
      v-if="!loading && conversation?.is_unlocked"
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
import { supportApi } from '../api/support'
import BottomNav from '../components/BottomNav.vue'

const route = useRoute()

const topic = route.params.topic
const loading = ref(true)
const sending = ref(false)
const error = ref('')
const draft = ref('')
const conversation = ref(null)
const scrollEl = ref(null)

const OPENING_MESSAGES = {
  investor: 'Hai, saya tertarik untuk menjadi investor di Re:Jam',
  donate: 'Hai, saya tertarik untuk berdonasi',
  join_team: 'Hai, saya tertarik untuk bekerja bersama tim Re:Jam, apakah kalian sedang open for opportunity',
  add_studio: 'Hai, saya ingin mendaftarkan studio band di database Re:Jam',
  additional_player: 'Hai, saya tertarik untuk menjadi additional player',
}

const openingMessage = computed(() => OPENING_MESSAGES[topic] || 'Hai, saya ingin menghubungi Re:Jam')

onMounted(async () => {
  try {
    const { data } = await supportApi.start(topic)
    conversation.value = data
    await scrollToBottom()
  } catch {
    error.value = 'Gagal memuat percakapan. Coba lagi.'
  } finally {
    loading.value = false
  }
})

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

async function sendOpeningMessage() {
  sending.value = true
  try {
    const { data } = await supportApi.send(conversation.value.id, openingMessage.value)
    conversation.value = data
    await scrollToBottom()
  } catch {
    error.value = 'Gagal mengirim pesan.'
  } finally {
    sending.value = false
  }
}

async function send() {
  const text = draft.value.trim()
  if (!text) return
  sending.value = true
  try {
    const { data } = await supportApi.send(conversation.value.id, text)
    conversation.value = data
    draft.value = ''
    await scrollToBottom()
  } catch {
    error.value = 'Gagal mengirim pesan.'
  } finally {
    sending.value = false
  }
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>