# BandJam — Vue Frontend

A Vue 3 + Vite single-page app implementing the BandJam mockup, wired to the
Django REST backend in `bandjam-django-v2`.

## Stack

- Vue 3 (`<script setup>`)
- Vue Router 4 (auth + onboarding guards)
- Pinia (auth store, bands/messaging store)
- Axios (DRF Token authentication via `Authorization: Token <key>`)

## Setup

```bash
npm install
cp .env.example .env   # leave VITE_API_BASE_URL empty for local dev
npm run dev
```

By default `vite.config.js` proxies `/api/*` to `http://localhost:8000`, so
run the Django backend on port 8000 (see its own README/docker-compose).

In production, set `VITE_API_BASE_URL` to your deployed API origin, e.g.
`https://api.bandjam.app`, and ensure that origin is in the backend's
`CORS_ALLOWED_ORIGINS`.

## Structure

```
src/
  api/            axios instance + endpoint wrappers (auth, bands, messaging)
  stores/         pinia stores (auth — token/user/onboarding; bands — bands/chat)
  router/         routes + navigation guards
  components/     shared UI (BottomNav)
  views/
    LoginView.vue
    onboarding/   Screens 1-7 from the mockup (signup -> instruments -> quizzes
                   -> location -> stage name -> welcome)
    BandsView.vue, ChatsView.vue, ChatDetailView.vue, SupportView.vue, ProfileView.vue
  assets/main.css design tokens & component styles ported from the HTML mockup
```

## Auth flow

1. `POST /api/auth/signup/` or `/api/auth/login/` returns `{ token, user }`.
   The token is stored in `localStorage` and attached to every request as
   `Authorization: Token <token>`.
2. Router guards check `auth.isAuthenticated` and `user.onboarding_complete`:
   - Not authenticated → `/login`
   - Authenticated but `onboarding_complete: false` → onboarding wizard
   - Onboarding complete → main app (`/bands`, `/chats`, `/support`, `/profile`)
3. Each onboarding screen calls its corresponding
   `POST /api/auth/onboarding/stepN/` endpoint and updates the cached user.
   Step 6 sets `onboarding_complete: true`, unlocking the main app.

## Main app

- **Bands**: `GET /api/bands/` — bands the user has a conversation with
  (invitations), including unread counts.
- **Chats**: same list, filtered to bands with an existing conversation;
  tapping one opens `ChatDetailView`.
- **Chat detail**: `GET /api/bands/:id/conversation/` for messages,
  `POST /api/conversations/:id/` to send a message.
- **Profile**: `GET`/`PATCH /api/auth/me/` to view and edit profile fields,
  plus logout (`POST /api/auth/logout/`, deletes the auth token).
- **Support**: static placeholder (no backend endpoint defined yet).

## Notes / things to revisit

- The mockup's signup screen only asks for "Nama lengkap", but the backend's
  `SignupSerializer` requires a unique `username`. The Vue signup screen adds
  a Username field for this reason.
- "Band creation" and "invite user" endpoints exist on the backend
  (`POST /api/bands/`, `POST /api/bands/:id/invite/`) but have no screens in
  the original mockup — not yet built into the frontend. Add views for these
  if band creation / matchmaking flows are needed next.
- for every changes, remember to `npm run build` then `npx cap copy` before rebuild the apk
