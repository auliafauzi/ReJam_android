import { defineStore } from 'pinia'
import { jamSessionsApi } from '../api/jamSessions'
import { messagingApi } from '../api/messaging'
import { extractError } from './auth'

export const useJamSessionsStore = defineStore('jamSessions', {
  state: () => ({
    jamSessions: [],
    loading: false,
    error: null,
    // Current conversation being viewed
    conversation: null,
    messagesLoading: false,
  }),

  getters: {
    totalUnread: (state) =>
      state.jamSessions.reduce((sum, js) => sum + (js.unread_count || 0), 0),
  },

  actions: {
    async fetchJamSessions() {
      this.loading = true
      this.error = null
      try {
        const { data } = await jamSessionsApi.list()
        // Paginated (DRF PageNumberPagination) or plain array depending on view
        this.jamSessions = data.results ?? data
      } catch (err) {
        this.error = extractError(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createJamSession(payload) {
      const { data } = await jamSessionsApi.create(payload)
      this.jamSessions.unshift(data)
      return data
    },

    async forceMatch(payload) {
      console.log("sampai forceMatch di stores js")
      const { data } = await jamSessionsApi.forceMatch(jamSessionId, payload)
      this.jamSessions.unshift(data)
      return data
    },

    async fetchConversation(jamSessionId, convId = null) {
      this.messagesLoading = true
      this.error = null
      try {
        const { data } = await jamSessionsApi.conversation(jamSessionId, convId)
        this.conversation = data
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      } finally {
        this.messagesLoading = false
      }
    },

    async fetchConversationById(convId) {
      this.messagesLoading = true
      this.error = null
      try {
        const { data } = await messagingApi.list(convId)
        this.conversation = data
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      } finally {
        this.messagesLoading = false
      }
    },

    async sendMessage(conversationId, text) {
      const { data } = await messagingApi.send(conversationId, text)
      if (this.conversation && this.conversation.id === conversationId) {
        this.conversation.messages.push(data)
      }
      return data
    },

    async deleteMessage(conversationId, messageId) {
      await messagingApi.remove(conversationId, messageId)
      if (this.conversation && this.conversation.id === conversationId) {
        this.conversation.messages = this.conversation.messages.filter(
          (m) => m.id !== messageId
        )
      }
    },

    async inviteUser(jamSessionId, payload) {
      const { data } = await jamSessionsApi.invite(jamSessionId, payload)
      return data
    },
  },
})