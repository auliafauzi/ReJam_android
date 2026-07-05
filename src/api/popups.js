import http from './http'

export const popupsApi = {
  getActive() {
    return http.get('/api/popups/active/')
  },
  createImpression(popupId) {
    return http.post(`/api/popups/${popupId}/impression/`)
  },
  updateImpression(impressionId, payload) {
    // payload: { dismissed_at } and/or { clicked_cta: true }
    return http.patch(`/api/popups/impression/${impressionId}/`, payload)
  },
}
