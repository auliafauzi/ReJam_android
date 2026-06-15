import axios from 'axios'

// In dev, VITE_API_BASE_URL is empty and Vite's proxy forwards /api -> Django.
// In production, set VITE_API_BASE_URL to the deployed backend origin.
const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const http = axios.create({
  baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true', // 👈 KUNCI UTAMA UNTUK NGROK
    // 'Content-Type': 'application/json'
  }
})

// Attach the auth token (DRF TokenAuthentication) to every request if present.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('bandjam_token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
    // config.headers.Authorization = `Token 3FAIJ9WuDuIlvEHWWIQhHMiRvT5_2ArsTUy6PJCWMGsWihBSH` //authtoken ngrok
  }
  return config
})

// On 401, clear the stored session so the user is sent back to login.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bandjam_token')
      localStorage.removeItem('bandjam_user')
    }
    return Promise.reject(error)
  }
)

export default http
