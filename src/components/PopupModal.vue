<template>
  <transition name="fade">
    <div v-if="popupStore.isVisible" class="popup-overlay" @click.self="handleDismiss">
      <div class="popup-card">
        <button class="popup-close" @click="handleDismiss" aria-label="Tutup">
          <i class="ti ti-x"></i>
        </button>

        <img
          v-if="popupStore.currentPopup.image_url"
          :src="popupStore.currentPopup.image_url"
          class="popup-image"
          alt=""
        />

        <div class="popup-body">
          <span class="popup-type-tag">{{ typeLabel }}</span>
          <h3 class="popup-title">{{ popupStore.currentPopup.title }}</h3>
          <p class="popup-text">{{ popupStore.currentPopup.body }}</p>
        </div>

        <div class="popup-actions">
          <button
            v-if="popupStore.currentPopup.cta_text"
            class="btn-primary"
            @click="handleCta"
          >
            {{ popupStore.currentPopup.cta_text }}
          </button>
          <!-- <button class="btn-ghost" @click="handleDismiss">Tutup</button> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePopupStore } from '../stores/popup';

const popupStore = usePopupStore();
const router = useRouter();

const typeLabel = computed(() => {
  const labels = { info: 'Info', ad: 'Promo', announcement: 'Pengumuman' };
  return labels[popupStore.currentPopup?.popup_type] || '';
});

function handleDismiss() {
  popupStore.dismissCurrent();
}

async function handleCta() {
  const action = await popupStore.clickCurrentCta();
  if (action) {
    router.push(action);
  }
}
</script>

<style scoped>
.popup-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 8, 6, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.popup-card {
  position: relative;
  width: 100%;
  max-width: 300px;
  background: var(--bg-card, #2a2220);
  border: 0.5px solid var(--border, #3a3230);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}

.popup-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  font-size: 14px;
}

.popup-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}

.popup-body {
  padding: 18px 18px 4px;
}

.popup-type-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--red, #e0635f);
  background: var(--red-dim, rgba(224, 99, 95, 0.15));
  border: 1px solid var(--red-border, rgba(224, 99, 95, 0.35));
  padding: 3px 8px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.popup-title {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
}

.popup-text {
  color: var(--text-muted, #aaa);
  font-size: 13px;
  line-height: 1.6;
}

.popup-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px 18px;
}
</style>
