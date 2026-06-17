import http from './http'

export const authApi = {
  signup(payload) {
    // payload: { username, email, password, nama, phone, gender, avatar_color }
    return http.post('/api/auth/signup/', payload)
  },
  login(payload) {
    // payload: { username, password }
    return http.post('/api/auth/login/', payload)
  },
  logout() {
    return http.post('/api/auth/logout/')
  },
  me() {
    return http.get('/api/auth/me/')
  },
  updateMe(payload) {
    return http.patch('/api/auth/me/', payload)
  },

  // ── Onboarding steps ──
  onboardingStep2(payload) {
    // { alatmusik: [...], alatmusik_utama, genre: [...], genre_utama }
    return http.post('/api/auth/onboarding/step2/', payload)
  },
  onboardingStep3(payload) {
    // { answer: 'a' | 'b' | 'c' }
    return http.post('/api/auth/onboarding/step3/', payload)
  },
  onboardingStep4(payload) {
    // { answer: 'a' | 'b' | 'c' }
    return http.post('/api/auth/onboarding/step4/', payload)
  },
  onboardingStep5(payload) {
    // { kota, kecamatan, kota2?, kecamatan2? }
    return http.post('/api/auth/onboarding/step5/', payload)
  },
  onboardingStep6(payload) {
    // { nama_panggung }
    return http.post('/api/auth/onboarding/step6/', payload)
  },
}
