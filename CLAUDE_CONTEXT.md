# Re:Jam — Claude Context Document

> Paste this at the start of every new Claude session to restore full project context.
> Last updated: June 2026 (Session 3)

---

## Project Overview

**Re:Jam** (formerly BandJam) is a mobile-first platform for non-professional musicians to randomly meet up and jam together. The platform automatically matches musicians to bands based on location, genre, instrument, rehearsal preference, and skill level.

**Key concept**: Bands are created and managed by a superadmin (the founder). The system automatically invites matched users via a matchmaking engine. Users receive invitations, chat with the "band manager" (superadmin posing as the band), and decide whether to join.

---

## Tech Stack

### Backend
- **Django 5.0.6** + **Django REST Framework**
- **PostgreSQL**
- **Token Authentication** (DRF TokenAuthentication)
- **Gunicorn** for production
- **Whitenoise** for static files
- Deployed on **GCP** at **https://api.rejam.click/**
- Local dev via **Docker Compose** (`docker-compose.yml` in the Django project folder)

### Frontend
- **Vue 3** (`<script setup>`) + **Vite**
- **Pinia** (auth store, bands store)
- **Vue Router 4** (auth + onboarding guards)
- **Axios** with Token auth interceptor
- **Capacitor** for Android APK (`appId: com.rejam.app`)
- **Leaflet** (planned, backlog)

### Infrastructure
- **Production backend**: `https://api.rejam.click/` (GCP, real domain)
- **Local dev**: Docker on `localhost:8000`, Vue dev server on `localhost:5173`
- For local dev: Vite proxies `/api` to `localhost:8000` (leave `VITE_API_BASE_URL` empty)
- For APK/production: `VITE_API_BASE_URL=https://api.rejam.click`
- **ngrok** no longer needed for APK builds (real domain available)
- **Important**: add `ngrok-skip-browser-warning: '1'` header in `src/api/http.js` if using ngrok for local testing

---

## Repository Structure

```
Django backend (deployed to GCP):
  apps/
    users/                  ← User model, auth, onboarding
    bands/                  ← Band, Conversation, MessageTemplate, Genre, Instrument models
    messaging/              ← Message, SupportConversation, SupportMessage models
  docker-compose.yml        ← Volume mount: .:/app (for local dev)

Vue frontend:
  src/
    api/
      http.js               ← Axios instance + ngrok header + token interceptor
      auth.js               ← Auth API calls
      bands.js              ← Bands API calls
      messaging.js          ← Messaging API calls + updateStatus
      options.js            ← Genre + Instrument API calls
      support.js            ← Support conversation API calls
    stores/
      auth.js               ← Pinia auth store (token, user, onboarding steps, quiz1 in localStorage)
      bands.js              ← Pinia bands store (band list, conversations, messages)
    router/index.js         ← Routes + auth/onboarding guards
    components/
      BottomNav.vue         ← Shared bottom navigation (Chats, Jam, Support, Profile)
      GuitarPickIcon.vue    ← Custom SVG guitar pick icon for Jam tab
      MatchmakingRadar.vue  ← Radar animation (6s, emits 'done')
    views/
      LoginView.vue
      BandsView.vue         ← "Jam" tab — expandable band cards with member list, songlist, status
      ChatsView.vue         ← Superadmin: band-grouped tree + Support section; User: conversations + Support section
      ChatDetailView.vue    ← Chat with 3 action buttons (accept/negotiate/decline)
      ProfileView.vue       ← View-only: nama, email, phone; editable: nama_panggung
      SupportView.vue       ← "Support Us" tab — two sections: Support Us + Ask for Support
      SupportChatView.vue   ← User support chat (locked until opening message sent)
      SupportAdminChatView.vue ← Superadmin reply to support conversations
      onboarding/
        SignupView.vue      ← Step 1: email, password, nama, phone, gender
        InstrumentsView.vue ← Step 2: instruments + genres (fetched from DB)
        PerformanceQuizView.vue ← Step 3: quiz1 (stored in localStorage)
        SkillQuizView.vue   ← Step 4: quiz2 (combined with quiz1 → level matrix)
        LocationView.vue    ← Step 5: kota, kecamatan (up to 2 locations)
        RehearsalView.vue   ← Step 5b: rehearsal time preference
        StageNameView.vue   ← Step 6: nama_panggung
        WelcomeView.vue     ← Onboarding complete
  capacitor.config.json     ← appId: com.rejam.app, appName: Re:Jam
  .env.production           ← VITE_API_BASE_URL=https://api.rejam.click
```

---

## Key Design Decisions

### Authentication
- **Login**: accepts `identifier` (email or phone) + `password`
- **Signup**: email used as `username` (Django AbstractUser requirement hidden from users)
- `nama`, `email`, `phone` are **read-only** after signup (cannot be changed in profile)
- Only `nama_panggung` is editable in profile
- Email and phone must be unique — validated on signup and profile update
- When email changes, `username` is synced automatically

### Navigation
- **Default screen after login**: `/chats`
- **Bottom nav order**: Chats, Jam, Support, Profile
- **Chats tab** is the main/home screen
- Unread badge on Chats icon — positioned top-right via absolute positioning

### User Model — Key Fields
- `email`, `phone`, `gender`, `nama`, `nama_panggung`, `avatar_color`
- `alatmusik` (ArrayField), `alatmusik_utama`, `genre` (ArrayField), `genre_utama`
- `level` choices: `beginner`, `early_intermediate`, `intermediate`, `advanced`
- `performance_experience` (from quiz1), `level` (calculated from quiz1+quiz2 matrix)
- `kota`, `kecamatan`, `kota2`, `kecamatan2`
- `rehearsal_preference` (ArrayField) — choices: `weekdays_after_office`, `weekend_morning`, `weekend_evening`
- `onboarding_complete` (Boolean)
- `subscription` (free/pro), `payment`, `discount`
- `is_superuser` — used to detect Band Manager role

### Level Matrix (quiz1 × quiz2)
| quiz1 | quiz2 | level |
|-------|-------|-------|
| a | a | advanced |
| b | a | intermediate |
| c | a | intermediate |
| a | b | intermediate |
| b | b | early_intermediate |
| c | b | early_intermediate |
| a | c | early_intermediate |
| b | c | beginner |
| c | c | beginner |

### Band Model — Key Fields
- `nama`, `genre` (ArrayField), `kota`, `kecamatan`, `level`
- `vokalis`, `gitaris`, `bassist`, `drummer` (FK to User, nullable = vacant)
- `rehersal_place`, `rehersal_datetime`
- `rehearsal_preference` (ArrayField)
- `songlist` (ArrayField) — editable in Django Admin via newline-separated textarea
- `admin` (FK to User — the band manager)

### Conversation Status Flow
| Status | Set by | Meaning | Badge color |
|--------|--------|---------|-------------|
| `pending` | System | Matchmaking created invitation | 🔴 Red |
| `accepted` | User | User is interested | 🟢 Green |
| `declined` | User | User rejected | 🔴 Red |
| `negotiating` | User | User interested but wants to discuss | 🟡 Yellow |
| `waiting_payment` | Superadmin | Awaiting payment | 🔴 Red |
| `ready` | Superadmin | Ready to jam | 🟢 Green |

### Jam Tab (BandsView)
- Expandable cards — all collapsed by default
- Collapsed: band name, genre, location, studio
- Expanded: status badge, rehearsal datetime, member list, Chat button, songlist
- Member list colored dots: Vokalis=red, Gitaris=yellow, Bassist=blue, Drummer=green
- User shown in their role slot when status is `accepted`/`negotiating`/`waiting_payment`/`ready`
- `[empty seat]` shown for unfilled roles

### Matchmaking Logic (`apps/bands/matchmaking.py`)
Triggered by Django signals (`post_save`) on:
- `Band` (created) → find matching users
- `User` (onboarding_complete flips True) → find matching bands

Match criteria (ALL must be true):
1. `set(band.genre) ∩ set(user.genre)` — at least one genre overlap
2. `band.kota` in `[user.kota, user.kota2]` — location match
3. `set(band.rehearsal_preference) ∩ set(user.rehearsal_preference)` — at least one time overlap (skipped if either is empty)
4. Band has at least one vacant role that maps to user's instrument

On match: creates `Conversation` + sends `MessageTemplate` messages (scenario=`invitation`, ordered by `order`, with placeholders `{nama_panggung}`, `{nama_band}`, `{role}`, `{kota}`, `{genre}`)

Message sender: always the superuser (`User.objects.filter(is_superuser=True).first()`)

### Support Conversations
- `SupportConversation` and `SupportMessage` models in `apps/messaging/`
- Topics: `investor`, `donate`, `join_team`, `add_studio`, `additional_player`
- Each topic has a pre-written opening message (defined in `SupportChatView.vue`)
- Chat locked until user taps the opening message button → `is_unlocked=True`
- User sees their support conversations in Chats tab Support section
- Superadmin sees all support conversations in Chats tab Support section
- Superadmin replies via `SupportAdminChatView`

### Radar Animation (`MatchmakingRadar.vue`)
- Shows on Jam + Chats tab
- Duration: **6 seconds** (`duration: 6000`)
- First login: shown once (controlled by `bandjam_matchmaking_shown` in localStorage)
- No-match scenario: shown once per tab visit via `radarShownOnce` ref
- `bandjam_matchmaking_shown` cleared on login + logout

### Genre/Instrument — Dynamic from DB
- `Genre` and `Instrument` models in `apps/bands/`
- Managed via Django Admin
- Fetched at `GET /api/bands/genres/` and `GET /api/bands/instruments/`
- Used in `InstrumentsView.vue` onboarding step

### Android APK
- Built with Capacitor
- `capacitor.config.json`: `appId: com.rejam.app`, `appName: Re:Jam`, `webDir: dist`
- `.env.production`: `VITE_API_BASE_URL=https://api.rejam.click`
- Rebuild flow: `npm run build` → `npx cap copy android` → Build APK in Android Studio
- App icon: coral-red background, white guitar pick

---

## API Endpoints

### Auth (`/api/auth/`)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `signup/` | Register (email → username auto-set) |
| POST | `login/` | Login with identifier (email/phone) + password |
| POST | `logout/` | Invalidate token |
| GET/PATCH | `me/` | Get/update current user |
| POST | `onboarding/step2/` | Instruments + genre |
| POST | `onboarding/step3/` | Quiz1 (performance experience) |
| POST | `onboarding/step4/` | Quiz2 + Quiz1 combined → calculates level |
| POST | `onboarding/step5/` | Location |
| POST | `onboarding/step5b/` | Rehearsal preference |
| POST | `onboarding/step6/` | Stage name → sets onboarding_complete=True |

### Bands (`/api/bands/`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/` | Superadmin: all bands; User: their invited bands |
| POST | `/` | Create band (superadmin) |
| GET | `/:id/conversation/` | Get conversation (user: by bandId; admin: +?conv_id=) |
| GET | `genres/` | List active genres |
| GET | `instruments/` | List active instruments |

### Conversations (`/api/conversations/`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/:id/` | List messages |
| POST | `/:id/` | Send message |
| DELETE | `/:id/:msg_id/` | Delete message |
| PATCH | `/:id/status/` | Update conversation status |
| POST | `support/start/` | Create/get support conversation |
| GET | `support/:id/` | Get support conversation messages |
| POST | `support/:id/` | Send support message |
| GET | `support/` | Superadmin: list all support conversations |
| GET | `support/mine/` | User: list their own support conversations |

---

## LocalStorage Keys
| Key | Purpose | Cleared on |
|-----|---------|------------|
| `bandjam_token` | Auth token | Logout |
| `bandjam_user` | Cached user object | Logout |
| `bandjam_quiz1` | Temp quiz1 answer | After step4 submit |
| `bandjam_matchmaking_shown` | Radar shown flag | Login + Logout |

---

## Current Backlog

1. **Push notifications** — FCM via Firebase + Capacitor
2. **Map picker for location input** — fullscreen Leaflet/OSM, draggable pin, reverse geocode to auto-fill kota/kecamatan, store latitude/longitude/latitude2/longitude2 in DB
3. ~~**Login with email/phone + hide username**~~ ✅ Done
4. ~~**Dynamic genres and instruments from DB**~~ ✅ Done
5. ~~**Rehearsal time preference onboarding step**~~ ✅ Done
6. ~~**Jam tab (rename from Band tab)**~~ ✅ Done
7. ~~**Support Us tab**~~ ✅ Done
8. ~~**Change user level by quiz and level matrix**~~ ✅ Done
9. **Exclude superuser and is_staff from matchmaking** — they are managers, not band personnel
10. ~~**Matchmaking search animation**~~ ✅ Done
11. **Auto-create band if no match found** — random name, same kota + genre_utama as user
12. **Generate unique names** — two new tables `band_names_bank` and `user_name_bank` (adjective + noun columns, ~100 rows each); 🎲 dice button on stage name screen
13. **Confirmation modal for profile changes**
14. **Inline style cleanup** — replace scattered `style="..."` attributes with named CSS classes
15. ~~**Rebrand to Re:Jam**~~ ✅ Done
16. **Prioritize alatmusik_utama in matchmaking** — check primary instrument first before falling back to full alatmusik array

---

## Working Rules (Claude behavior preferences)
- **Don't execute immediately** — present strategy/plan first, wait for confirmation
- **One file at a time** — when making changes, go file by file
- **Write changes as text** — user edits manually, doesn't want code executed in sandbox
- **Backend first, then frontend** — default order for feature development
- **No migration edits** — never edit existing migration files, always create new ones
- **Full file on request** — when user asks for entire file, provide complete code

---

## Infrastructure Notes
- **Production**: GCP + `https://api.rejam.click/` — fully deployed, real domain
- **Local dev DB**: Docker port `5433:5432` on host (to avoid conflict with native Postgres on Windows)
- DBeaver connects to `localhost:5433`, user: `rejam` (was `bandjam`), pass: check docker-compose, db: `rejam`
- After `docker-compose.yml` env var changes: must `docker compose down && docker compose up -d` (not just restart)
- `docker compose restart` only picks up code changes (via volume), NOT env var changes

---

## 🚀 Before Release Checklist

### ✅ Completed
- [x] App icon (guitar pick, coral background, all densities generated)
- [x] Privacy Policy + Terms & Conditions modal in `SignupView.vue`
- [x] Privacy Policy hosted at `https://api.rejam.click/static/legal/privacy-policy.html`
- [x] Privacy Policy link in `LoginView.vue`
- [x] Production backend deployed on GCP at `https://api.rejam.click/`
- [x] `appId: com.rejam.app` set in `capacitor.config.json`
- [x] `.env.production` pointing to `https://api.rejam.click`
- [x] `is_terms_agreed` + `agreed_at` fields added to User model
- [x] Keystore file generated (`rejam-release.jks`) — **back up securely!**
- [x] Release AAB built and signed in Android Studio

### ❌ Pending
- [ ] **Splash screen** — set up via Capacitor Assets
- [ ] **Google Play Developer account** — $25 one-time fee at play.google.com/console
- [ ] **Store listing assets**:
  - [ ] App description (short + long, Indonesian + English)
  - [ ] Screenshots (phone)
  - [ ] Feature graphic (1024×500px banner)
  - [ ] Content rating questionnaire (18+)
  - [ ] Privacy policy URL entry in Play Console
- [ ] **Fix SignupView blank screen** — after modal closes, form is blank (CSS/template structure issue, under investigation)
- [ ] **Frontend brand name** — some "BandJam" references may still exist in frontend files

### ⚠️ Important Notes
- Keystore file (`rejam-release.jks`) must be backed up — losing it means you can never update the app on Play Store
- Keystore passwords must be saved securely
- `collectstatic` must be run on GCP after any static file changes: `docker compose exec api python manage.py collectstatic --noinput`
