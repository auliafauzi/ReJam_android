import http from './http'

export const optionsApi = {
  genres() {
    return http.get('/api/jam-sessions/genres/')
  },
  instruments() {
    return http.get('/api/jam-sessions/instruments/')
  },
}
