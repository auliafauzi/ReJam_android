import http from './http'

export const bandsApi = {
  list() {
    return http.get('/api/bands/')
  },
  create(payload) {
    return http.post('/api/bands/', payload)
  },
  detail(bandId) {
    return http.get(`/api/bands/${bandId}/`)
  },
  update(bandId, payload) {
    return http.patch(`/api/bands/${bandId}/`, payload)
  },
  remove(bandId) {
    return http.delete(`/api/bands/${bandId}/`)
  },
  invite(bandId, payload) {
    // { user_id, invited_role, opening_messages: [...] }
    return http.post(`/api/bands/${bandId}/invite/`, payload)
  },
  conversation(bandId, convId = null) {
    const params = convId ? `?conv_id=${convId}` : ''
    return http.get(`/api/bands/${bandId}/conversation/${params}`)
  },
  requestDelete: (bandId,payload) => {
    return http.post(`/api/bands/${bandId}/request-delete/`, payload)
  },
  forceMatch: (bandId,payload) => {
    return http.post(`/api/bands/${bandId}/force-match/`, payload)
  },
}
