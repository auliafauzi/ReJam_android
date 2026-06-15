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
}
