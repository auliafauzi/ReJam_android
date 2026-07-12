import { defineStore } from 'pinia'
import { bandsApi } from '../api/bands'
import { messagingApi } from '../api/messaging'
import { extractError } from './auth'

export const useBandsStore = defineStore('bands', {
  state: () => ({
    bands: [],
    loading: false,
    error: null,
    // Current conversation being viewed
    conversation: null,
    messagesLoading: false,
  }),

  getters: {
    totalUnread: (state) =>
      state.bands.reduce((sum, b) => sum + (b.unread_count || 0), 0),
  },

  actions: {
    async fetchBands() {
      this.loading = true
      this.error = null
      try {
        const { data } = await bandsApi.list()
        // Paginated (DRF PageNumberPagination) or plain array depending on view
        this.bands = data.results ?? data
      } catch (err) {
        this.error = extractError(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createBand(payload) {
      // console.log("sampai createBand di stores js");
      const { data } = await bandsApi.create(payload)
      this.bands.unshift(data)
      return data
    },

    async forceMatch(payload) {
      console.log("sampai forceMatch di stores js")
      const { data } = await bandsApi.forceMatch(bandId, payload)
      this.bands.unshift(data)
      return data
    },

    async fetchConversation(bandId, convId = null) {
      this.messagesLoading = true
      this.error = null
      try {
        const { data } = await bandsApi.conversation(bandId, convId)
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

    async inviteUser(bandId, payload) {
      const { data } = await bandsApi.invite(bandId, payload)
      return data
    },
  },
})
