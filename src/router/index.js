import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import SignupView from '../views/onboarding/SignupView.vue'
import InstrumentsView from '../views/onboarding/InstrumentsView.vue'
import PerformanceQuizView from '../views/onboarding/PerformanceQuizView.vue'
import SkillQuizView from '../views/onboarding/SkillQuizView.vue'
import LocationView from '../views/onboarding/LocationView.vue'
import StageNameView from '../views/onboarding/StageNameView.vue'
import WelcomeView from '../views/onboarding/WelcomeView.vue'
import BandsView from '../views/BandsView.vue'
import ChatsView from '../views/ChatsView.vue'
import ChatDetailView from '../views/ChatDetailView.vue'
import SupportView from '../views/SupportView.vue'
import ProfileView from '../views/ProfileView.vue'
import RehearsalView from '../views/onboarding/RehearsalView.vue'
import SupportChatView from '../views/SupportChatView.vue'
import SupportAdminChatView from '../views/SupportAdminChatView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },

  // Onboarding wizard (steps 1-6 from the mockup)
  { path: '/onboarding/signup', name: 'onboarding-signup', component: SignupView, meta: { guestOnly: true } },
  { path: '/onboarding/instruments', name: 'onboarding-instruments', component: InstrumentsView, meta: { requiresAuth: true } },
  { path: '/onboarding/performance', name: 'onboarding-performance', component: PerformanceQuizView, meta: { requiresAuth: true } },
  { path: '/onboarding/skill', name: 'onboarding-skill', component: SkillQuizView, meta: { requiresAuth: true } },
  { path: '/onboarding/location', name: 'onboarding-location', component: LocationView, meta: { requiresAuth: true } },
  { path: '/onboarding/stage-name', name: 'onboarding-stage-name', component: StageNameView, meta: { requiresAuth: true } },
  { path: '/onboarding/welcome', name: 'onboarding-welcome', component: WelcomeView, meta: { requiresAuth: true } },
  { path: '/onboarding/rehearsal', name: 'onboarding-rehearsal', component: RehearsalView, meta: { requiresAuth: true } },

  // Main app (requires completed onboarding)
  { path: '/bands', name: 'bands', component: BandsView, meta: { requiresAuth: true, requiresOnboarding: true } },
  { path: '/chats', name: 'chats', component: ChatsView, meta: { requiresAuth: true, requiresOnboarding: true } },
  { path: '/chats/:bandId', name: 'chat-detail', component: ChatDetailView, meta: { requiresAuth: true, requiresOnboarding: true } },
  { path: '/support', name: 'support', component: SupportView, meta: { requiresAuth: true, requiresOnboarding: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true, requiresOnboarding: true } },

  //Chat view for superadmin
  { path: '/chats/:bandId/:convId', name: 'admin-chat-detail', component: ChatDetailView, meta: { requiresAuth: true, requiresOnboarding: true } },
  //For Support chat
  { path: '/support/:topic', name: 'support-chat', component: SupportChatView, meta: { requiresAuth: true, requiresOnboarding: true } },
  { path: '/support-admin/:convId', name: 'support-admin-chat', component: SupportAdminChatView, meta: { requiresAuth: true, requiresOnboarding: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next(auth.onboardingComplete ? '/chats' : '/onboarding/instruments')
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresOnboarding && auth.isAuthenticated && !auth.onboardingComplete) {
    return next('/onboarding/instruments')
  }

  // If onboarding already done, don't let the user wander back into the wizard
  if (to.path.startsWith('/onboarding') && to.name !== 'onboarding-signup' && auth.onboardingComplete) {
    return next('/chats')
  }

  next()
})

export default router
