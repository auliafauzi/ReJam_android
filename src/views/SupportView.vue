<template>
  <div class="screen active" id="s-support">
    <div class="onboard-header">
      <div class="mini-logo"><i class="ti ti-music"></i></div>
      <span class="mini-brand">BandJam</span>
    </div>
    <h2 class="screen-title">Support</h2>
    <p class="screen-subtitle">Butuh bantuan? Kami siap membantu.</p>

    <div class="scroll-body">
      <div class="band-card">
        <div class="band-card-title"><i class="ti ti-mail"></i> Hubungi kami</div>
        <div class="band-card-sub">support@bandjam.app</div>
      </div>
      <div class="band-card">
        <div class="band-card-title"><i class="ti ti-help-circle"></i> FAQ</div>
        <div class="band-card-sub">Pertanyaan yang sering diajukan akan muncul di sini.</div>
      </div>
      <div class="band-card">
        <div class="band-card-title"><i class="ti ti-shield-check"></i> Pedoman komunitas</div>
        <div class="band-card-sub">BandJam adalah komunitas untuk musisi non-profesional — saling menghargai dan hadir jika sudah berkomitmen.</div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue'
</script>
