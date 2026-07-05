<template>
  <div class="screen active" id="s-step5">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">Re:Jam</span>
    </div>

    <div class="scroll-body" style="padding-top:0;">
      <div v-if="error" class="form-error">{{ error }}</div>

      <p style="color:#fff; font-size:14px; margin-bottom:14px;">Dimana lokasi favoritmu? (maksimal 2)</p>

      <div class="section-tag">Lokasi 1</div>
      <label class="field-label" style="margin-top:8px;">Provinsi</label>
      <select v-model="form.provinsiKode" :disabled="provinsiLoading" @change="onProvinsiChange(1)">
        <option value="" disabled>{{ provinsiLoading ? 'Memuat provinsi...' : '— Pilih provinsi —' }}</option>
        <option v-for="p in provinsiList" :key="p.kode" :value="p.kode">{{ p.nama }}</option>
      </select>
      <label class="field-label">Kota</label>
      <select v-model="form.kotaKode" :disabled="!form.provinsiKode || kotaLoading" @change="onKotaChange(1)">
        <option value="" disabled>{{ kotaLoading ? 'Memuat kota...' : '— Pilih kota —' }}</option>
        <option v-for="c in kotaList" :key="c.kode" :value="c.kode">{{ c.nama }}</option>
      </select>
      <label class="field-label">Kecamatan</label>
      <select v-model="form.kecamatanKode" :disabled="!form.kotaKode || kecamatanLoading">
        <option value="" disabled>{{ kecamatanLoading ? 'Memuat kecamatan...' : '— Pilih kecamatan —' }}</option>
        <option v-for="k in kecamatanList" :key="k.kode" :value="k.kode">{{ k.nama }}</option>
      </select>

      <div class="section-tag" style="margin-top:20px;">Lokasi 2 <span style="color:#555; font-weight:400;">(opsional, gunakan untuk lokasi biasa kamu berkegiatan/bekerja)</span></div>
      <label class="field-label" style="margin-top:8px;">Provinsi</label>
      <select v-model="form.provinsiKode2" :disabled="provinsiLoading" @change="onProvinsiChange(2)">
        <option value="">— Pilih provinsi —</option>
        <option v-for="p in provinsiList" :key="p.kode" :value="p.kode">{{ p.nama }}</option>
      </select>
      <label class="field-label">Kota</label>
      <select v-model="form.kotaKode2" :disabled="!form.provinsiKode2 || kotaLoading2" @change="onKotaChange(2)">
        <option value="">{{ kotaLoading2 ? 'Memuat kota...' : '— Pilih kota —' }}</option>
        <option v-for="c in kotaList2" :key="c.kode" :value="c.kode">{{ c.nama }}</option>
      </select>
      <label class="field-label">Kecamatan</label>
      <select v-model="form.kecamatanKode2" :disabled="!form.kotaKode2 || kecamatanLoading2">
        <option value="">{{ kecamatanLoading2 ? 'Memuat kecamatan...' : '— Pilih kecamatan —' }}</option>
        <option v-for="k in kecamatanList2" :key="k.kode" :value="k.kode">{{ k.nama }}</option>
      </select>
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
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { wilayahApi } from '../../api/wilayah'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  provinsiKode: '',
  kotaKode: '',
  kecamatanKode: '',
  provinsiKode2: '',
  kotaKode2: '',
  kecamatanKode2: '',
})

const provinsiList = ref([])
const kotaList = ref([])
const kotaList2 = ref([])
const kecamatanList = ref([])
const kecamatanList2 = ref([])

const provinsiLoading = ref(false)
const kotaLoading = ref(false)
const kotaLoading2 = ref(false)
const kecamatanLoading = ref(false)
const kecamatanLoading2 = ref(false)

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  provinsiLoading.value = true
  try {
    const { data } = await wilayahApi.listProvinsi()
    provinsiList.value = data
    // Default Lokasi 1 to DKI Jakarta if present, mirroring the old default
    const defaultProvinsi = data.find((p) => p.nama.includes('JAKARTA')) || data[0]
    if (defaultProvinsi) {
      form.provinsiKode = defaultProvinsi.kode
      await onProvinsiChange(1, { autoSelectKota: 'JAKARTA SELATAN' })
    }
  } catch {
    error.value = 'Gagal memuat daftar provinsi. Coba lagi.'
  } finally {
    provinsiLoading.value = false
  }
})

async function onProvinsiChange(slot, opts = {}) {
  if (slot === 1) {
    form.kotaKode = ''
    form.kecamatanKode = ''
    kotaList.value = []
    kecamatanList.value = []
    if (!form.provinsiKode) return
    kotaLoading.value = true
    try {
      const { data } = await wilayahApi.listKota(form.provinsiKode)
      kotaList.value = data
      const defaultKota = opts.autoSelectKota
        ? data.find((c) => c.nama.includes(opts.autoSelectKota))
        : null
      if (defaultKota) {
        form.kotaKode = defaultKota.kode
        await onKotaChange(1)
      }
    } catch {
      error.value = 'Gagal memuat daftar kota. Coba lagi.'
    } finally {
      kotaLoading.value = false
    }
  } else {
    form.kotaKode2 = ''
    form.kecamatanKode2 = ''
    kotaList2.value = []
    kecamatanList2.value = []
    if (!form.provinsiKode2) return
    kotaLoading2.value = true
    try {
      const { data } = await wilayahApi.listKota(form.provinsiKode2)
      kotaList2.value = data
    } catch {
      error.value = 'Gagal memuat daftar kota. Coba lagi.'
    } finally {
      kotaLoading2.value = false
    }
  }
}

async function onKotaChange(slot) {
  if (slot === 1) {
    form.kecamatanKode = ''
    kecamatanList.value = []
    if (!form.kotaKode) return
    kecamatanLoading.value = true
    try {
      const { data } = await wilayahApi.listKecamatan(form.kotaKode)
      kecamatanList.value = data
      if (data.length) form.kecamatanKode = data[0].kode
    } catch {
      error.value = 'Gagal memuat daftar kecamatan. Coba lagi.'
    } finally {
      kecamatanLoading.value = false
    }
  } else {
    form.kecamatanKode2 = ''
    kecamatanList2.value = []
    if (!form.kotaKode2) return
    kecamatanLoading2.value = true
    try {
      const { data } = await wilayahApi.listKecamatan(form.kotaKode2)
      kecamatanList2.value = data
    } catch {
      error.value = 'Gagal memuat daftar kecamatan. Coba lagi.'
    } finally {
      kecamatanLoading2.value = false
    }
  }
}

async function handleNext() {
  error.value = ''
  if (!form.kotaKode) {
    error.value = 'Kota wajib diisi.'
    return
  }

  // Backend still expects plain name strings for kota/kecamatan — map the
  // selected kode back to its nama from the already-fetched lists.
  const kotaNama = kotaList.value.find((c) => c.kode === form.kotaKode)?.nama || ''
  const kecamatanNama = kecamatanList.value.find((k) => k.kode === form.kecamatanKode)?.nama || ''

  const payload = {
    kota: kotaNama,
    kecamatan: kecamatanNama,
  }

  if (form.kotaKode2) {
    const kotaNama2 = kotaList2.value.find((c) => c.kode === form.kotaKode2)?.nama || ''
    const kecamatanNama2 = kecamatanList2.value.find((k) => k.kode === form.kecamatanKode2)?.nama || ''
    payload.kota2 = kotaNama2
    payload.kecamatan2 = kecamatanNama2
  }

  loading.value = true
  try {
    await auth.submitStep5(payload)
    router.push('/onboarding/rehearsal')
  } catch {
    error.value = auth.error || 'Gagal menyimpan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
