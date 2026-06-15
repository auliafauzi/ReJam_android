<template>
  <div class="screen active" id="s-welcome">
    <div class="welcome-body">
      <div class="welcome-icon"><i class="ti ti-music"></i></div>
      <h2>Selamat datang di BandJam!</h2>
      <p>Profil musisimu sudah siap. Yuk, mulai cari teman jamming dan band yang cocok denganmu.</p>
      <div class="checklist">
        <div class="check-item"><i class="ti ti-check"></i><span>Akun berhasil dibuat</span></div>
        <div class="check-item"><i class="ti ti-check"></i><span>Profil musisi lengkap</span></div>
        <div class="check-item"><i class="ti ti-check"></i><span>Lokasi favorit tersimpan</span></div>
      </div>
    </div>

    <div class="btn-solo">
      <button class="btn-primary" @click="$router.push('/bands')">Mulai Jamming</button>
    </div>
  </div>
</template>

<script setup>
// Final onboarding step — user.onboarding_complete is already true at this
// point (set by step 6), so the router will allow access to /bands.
</script>
