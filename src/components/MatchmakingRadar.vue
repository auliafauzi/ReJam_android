<template>
  <div class="radar-overlay">
    <div class="radar-card">
      <svg class="radar-svg" width="220" height="220" viewBox="0 0 220 220">
        <defs>
          <radialGradient id="sweepGrad" cx="0%" cy="50%" r="100%">
            <stop offset="0%" stop-color="#e0635f" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#e0635f" stop-opacity="0"/>
          </radialGradient>
          <clipPath id="radarClip">
            <circle cx="110" cy="110" r="100"/>
          </clipPath>
        </defs>

        <circle cx="110" cy="110" r="100" fill="#2a1f1c" stroke="#e0635f" stroke-width="1.5" stroke-opacity="0.4"/>
        <circle cx="110" cy="110" r="75"  fill="none" stroke="#e0635f" stroke-width="0.8" stroke-opacity="0.25"/>
        <circle cx="110" cy="110" r="50"  fill="none" stroke="#e0635f" stroke-width="0.8" stroke-opacity="0.25"/>
        <circle cx="110" cy="110" r="25"  fill="none" stroke="#e0635f" stroke-width="0.8" stroke-opacity="0.25"/>

        <line x1="10"  y1="110" x2="210" y2="110" stroke="#e0635f" stroke-width="0.5" stroke-opacity="0.2"/>
        <line x1="110" y1="10"  x2="110" y2="210" stroke="#e0635f" stroke-width="0.5" stroke-opacity="0.2"/>
        <line x1="39"  y1="39"  x2="181" y2="181" stroke="#e0635f" stroke-width="0.5" stroke-opacity="0.15"/>
        <line x1="181" y1="39"  x2="39"  y2="181" stroke="#e0635f" stroke-width="0.5" stroke-opacity="0.15"/>

        <g class="sweep" clip-path="url(#radarClip)">
          <path d="M110 110 L210 110 A100 100 0 0 0 110 10 Z" fill="url(#sweepGrad)" opacity="0.7"/>
          <line x1="110" y1="110" x2="210" y2="110" stroke="#e0635f" stroke-width="1.5" stroke-opacity="0.9"/>
        </g>

        <circle class="ping"       cx="110" cy="110" r="20" fill="none" stroke="#e0635f" stroke-width="1"/>
        <circle class="ping ping2" cx="110" cy="110" r="20" fill="none" stroke="#e0635f" stroke-width="1"/>
        <circle class="ping ping3" cx="110" cy="110" r="20" fill="none" stroke="#e0635f" stroke-width="1"/>

        <circle cx="110" cy="110" r="4" fill="#e0635f"/>

        <circle cx="145" cy="68"  r="3"   fill="#e0635f" opacity="0.8"/>
        <circle cx="72"  cy="140" r="3"   fill="#e0635f" opacity="0.6"/>
        <circle cx="158" cy="135" r="2.5" fill="#e0635f" opacity="0.5"/>
      </svg>

      <p class="radar-text">{{ message }}<span class="dot-anim"></span></p>
    </div>
  </div>
  <BottomNav />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import BottomNav from './BottomNav.vue'

const props = defineProps({
  message: {
    type: String,
    default: 'Sedang mencari band untukmu',
  },
  duration: {
    type: Number,
    default: 3000,
  },
  autoStop: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['done'])

let timer = null

onMounted(() => {
  if (props.autoStop) {
    timer = setTimeout(() => {
      emit('done')
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.radar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-app);
  z-index: 10;
}
.radar-card {
  background: #1a1311;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 280px;
  border: 0.5px solid #3a3230;
}
.radar-svg { display: block; }
.sweep {
  transform-origin: 110px 110px;
  animation: sweep 2s linear infinite;
}
@keyframes sweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.ping {
  animation: ping 2s ease-out infinite;
  transform-origin: 110px 110px;
}
.ping2 { animation-delay: 0.7s; }
.ping3 { animation-delay: 1.4s; }
@keyframes ping {
  0%   { opacity: 0.7; r: 20; }
  100% { opacity: 0;   r: 100; }
}
.radar-text {
  color: #f0e8d4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
  max-width: 200px;
  margin: 0;
}
.dot-anim::after {
  content: '';
  animation: dots 1.5s steps(3, end) infinite;
}
@keyframes dots {
  0%   { content: ''; }
  33%  { content: '.'; }
  66%  { content: '..'; }
  100% { content: '...'; }
}
</style>