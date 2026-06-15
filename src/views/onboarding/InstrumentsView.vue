<template>
  <div class="screen active" id="s-step2">
    <div class="progress-bar">
      <div class="prog-seg done"></div>
      <div class="prog-seg done"></div>
      <div class="prog-seg"></div>
      <div class="prog-seg"></div>
      <div class="prog-seg"></div>
    </div>
    <div class="step-label">LANGKAH 2 DARI 5</div>
    <h2 class="screen-title">Kamu main apa?</h2>
    <p class="screen-subtitle">
      Pilih instrumenmu! <br>
      *Tap sekali untuk pilih, tap lagi untuk jadikan utama <i class="ti ti-star" style="font-size:11px; vertical-align:-1px;"></i>
    </p>

    <div class="scroll-body">
      <div v-if="error" class="form-error">{{ error }}</div>

      <p style="color:var(--text-label); font-size:12px; margin-bottom:8px;">Instrumen</p>
      <div class="chip-group">
        <button
          v-for="label in instruments"
          :key="label"
          class="chip"
          :class="chipClass(label, selectedInstruments, primaryInstrument)"
          @click="cycleChip(label, 'instrument')"
        >
          {{ label }}
          <i v-if="primaryInstrument === label" class="ti ti-star" style="font-size:10px;"></i>
        </button>
      </div>

      <p style="color:var(--text-label); font-size:12px; margin: 18px 0 8px;">
        Genre favoritmu? <br>
        *Tap sekali untuk pilih, tap lagi untuk jadikan utama <i class="ti ti-star" style="font-size:11px; vertical-align:-1px;"></i>
      </p>
      <div class="chip-group">
        <button
          v-for="label in genres"
          :key="label"
          class="chip"
          :class="chipClass(label, selectedGenres, primaryGenre)"
          @click="cycleChip(label, 'genre')"
        >
          {{ label }}
          <i v-if="primaryGenre === label" class="ti ti-star" style="font-size:10px;"></i>
        </button>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-ghost" @click="$router.back()"><i class="ti ti-arrow-left"></i>Kembali</button>
      <button class="btn-primary" :disabled="loading" @click="handleNext">
        {{ loading ? 'Memproses...' : 'Lanjut' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const instruments = ['Gitar', 'Bass', 'Drum', 'Vokal', 'Keyboard', 'Saksofon', 'Biola', 'Perkusi']
const genres = ['Indie rock', 'Jazz', 'Funk', 'Akustik', 'Pop', 'Metal', 'Blues']

const selectedInstruments = ref([])
const primaryInstrument = ref('')
const selectedGenres = ref([])
const primaryGenre = ref('')

const loading = ref(false)
const error = ref('')

// Tap once = selected, tap again = primary (and removed from selected list,
// since the "primary" chip implicitly represents membership too).
function cycleChip(label, kind) {
  const selected = kind === 'instrument' ? selectedInstruments : selectedGenres
  const primary = kind === 'instrument' ? primaryInstrument : primaryGenre

  if (primary.value === label) {
    // primary -> unselected
    primary.value = ''
  } else if (selected.value.includes(label)) {
    // selected -> primary (only one primary allowed)
    selected.value = selected.value.filter((l) => l !== label)
    primary.value = label
  } else {
    // unselected -> selected
    selected.value.push(label)
  }
}

function chipClass(label, selectedList, primary) {
  if (primary === label) return 'primary'
  if (selectedList.includes(label)) return 'selected'
  return ''
}

async function handleNext() {
  error.value = ''

  const alatmusik = [...selectedInstruments.value, ...(primaryInstrument.value ? [primaryInstrument.value] : [])]
  const genre = [...selectedGenres.value, ...(primaryGenre.value ? [primaryGenre.value] : [])]

  if (alatmusik.length === 0) {
    error.value = 'Pilih minimal satu instrumen.'
    return
  }
  if (genre.length === 0) {
    error.value = 'Pilih minimal satu genre.'
    return
  }

  loading.value = true
  try {
    await auth.submitStep2({
      alatmusik,
      alatmusik_utama: primaryInstrument.value || alatmusik[0],
      genre,
      genre_utama: primaryGenre.value || genre[0],
    })
    router.push('/onboarding/performance')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
