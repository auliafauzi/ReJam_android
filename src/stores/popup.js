import { defineStore } from 'pinia'
import { popupsApi } from '../api/popups'

export const usePopupStore = defineStore('popup', {
  state: () => ({
    queue: [],
    // Maps popup.id -> impression id, so dismiss/CTA click can report
    // back against the right impression record.
    impressionIds: {},
  }),


  getters: {
    currentPopup: (state) => state.queue[0] || null,
    isVisible: (state) => state.queue.length > 0,
  },

  actions: {
    // console.log("state.queue.length:", this.queue.length)
    async fetchActive() {
      try {
        const { data } = await popupsApi.getActive()
        this.queue = data.results
        if (this.queue.length) {
          await this._recordImpression(this.queue[0])
        }
      } catch {
        // Popups are non-critical — fail silently rather than blocking the app.
        this.queue = []
      }
    },

    async _recordImpression(popup) {
      try {
        const { data } = await popupsApi.createImpression(popup.id)
        this.impressionIds[popup.id] = data.id
      } catch {
        // If impression tracking fails, still let the popup show —
        // just skip frequency/analytics tracking for this one instance.
      }
    },

    async _advanceQueue() {
      this.queue.shift()
      if (this.queue.length) {
        await this._recordImpression(this.queue[0])
      }
    },

    async dismissCurrent() {
      const popup = this.currentPopup
      if (!popup) return
      const impressionId = this.impressionIds[popup.id]
      if (impressionId) {
        popupsApi
          .updateImpression(impressionId, { dismissed_at: new Date().toISOString() })
          .catch(() => {})
      }
      await this._advanceQueue()
    },

    async clickCurrentCta() {
      const popup = this.currentPopup
      if (!popup) return null
      const impressionId = this.impressionIds[popup.id]
      if (impressionId) {
        popupsApi
          .updateImpression(impressionId, {
            clicked_cta: true,
            dismissed_at: new Date().toISOString(),
          })
          .catch(() => {})
      }
      const action = popup.cta_action
      await this._advanceQueue()
      return action
    },
  },
})
