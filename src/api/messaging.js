import http from './http'

export const messagingApi = {
  list(conversationId) {
    return http.get(`/api/conversations/${conversationId}/`)
  },
  send(conversationId, text) {
    return http.post(`/api/conversations/${conversationId}/`, { text })
  },
  remove(conversationId, messageId) {
    return http.delete(`/api/conversations/${conversationId}/${messageId}/`)
  },
  updateStatus(conversationId, status) {
    return http.patch(`/api/conversations/${conversationId}/status/`, { status })
  },
}
