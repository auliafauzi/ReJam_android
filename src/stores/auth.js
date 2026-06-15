import { defineStore } from 'pinia'
import { authApi } from '../api/auth'

const TOKEN_KEY = 'bandjam_token'
const USER_KEY = 'bandjam_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    onboardingComplete: (state) => !!state.user?.onboarding_complete,
  },

  actions: {
    _persist(token, user) {
      this.token = token
      this.user = user
      if (token) localStorage.setItem(TOKEN_KEY, token)
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    setUser(user) {
      this.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    async signup(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await authApi.signup(payload)
        this._persist(data.token, data.user)
        return data.user
      } catch (err) {
        this.error = extractError(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await authApi.login(payload)
        this._persist(data.token, data.user)
        return data.user
      } catch (err) {
        this.error = extractError(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      const { data } = await authApi.me()
      this.setUser(data)
      return data
    },

    async logout() {
      try {
        await authApi.logout()
      } catch {
        // ignore network errors on logout — clear local state regardless
      }
      this.token = null
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },

    // ── Onboarding step actions — each updates and persists the user ──
    async submitStep2(payload) {
      this.error = null
      try {
        const { data } = await authApi.onboardingStep2(payload)
        this.setUser(data)
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      }
    },
    async submitStep3(payload) {
      this.error = null
      try {
        const { data } = await authApi.onboardingStep3(payload)
        this.setUser(data)
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      }
    },
    async submitStep4(payload) {
      this.error = null
      try {
        const { data } = await authApi.onboardingStep4(payload)
        this.setUser(data)
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      }
    },
    async submitStep5(payload) {
      this.error = null
      try {
        const { data } = await authApi.onboardingStep5(payload)
        this.setUser(data)
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      }
    },
    async submitStep6(payload) {
      this.error = null
      try {
        const { data } = await authApi.onboardingStep6(payload)
        this.setUser(data)
        return data
      } catch (err) {
        this.error = extractError(err)
        throw err
      }
    },
  },
})

/** Flatten DRF validation error responses into a single readable string. */
export function extractError(err) {
  const data = err?.response?.data
  if (!data) return 'Terjadi kesalahan. Coba lagi.'
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.error) return data.error
  if (data.non_field_errors) return data.non_field_errors.join(' ')
  // Field-level errors: { field: ["msg"] }
  const parts = []
  for (const [key, val] of Object.entries(data)) {
    const msg = Array.isArray(val) ? val.join(' ') : String(val)
    parts.push(`${key}: ${msg}`)
  }
  return parts.join(' | ') || 'Terjadi kesalahan. Coba lagi.'
}
