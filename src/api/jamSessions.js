import http from './http'

export const jamSessionsApi = {
  list() {
    return http.get('/api/jam-sessions/')
  },
  create(payload) {
    return http.post('/api/jam-sessions/', payload)
  },
  detail(jamSessionId) {
    return http.get(`/api/jam-sessions/${jamSessionId}/`)
  },
  update(jamSessionId, payload) {
    return http.patch(`/api/jam-sessions/${jamSessionId}/`, payload)
  },
  remove(jamSessionId) {
    return http.delete(`/api/jam-sessions/${jamSessionId}/`)
  },
  invite(jamSessionId, payload) {
    // { user_id, invited_role, opening_messages: [...] }
    return http.post(`/api/jam-sessions/${jamSessionId}/invite/`, payload)
  },
  conversation(jamSessionId, convId = null) {
    const params = convId ? `?conv_id=${convId}` : ''
    return http.get(`/api/jam-sessions/${jamSessionId}/conversation/${params}`)
  },
  requestDelete: (jamSessionId,payload) => {
    return http.post(`/api/jam-sessions/${jamSessionId}/request-delete/`, payload)
  },
  forceMatch: (jamSessionId,payload) => {
    return http.post(`/api/jam-sessions/${jamSessionId}/force-match/`, payload)
  },
  getGenres() {
    return http.get('/api/jam-sessions/genres/')
  },
  getInstruments() {
    return http.get('/api/jam-sessions/instruments/')
  }
}