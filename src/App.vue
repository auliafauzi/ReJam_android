<template>
  <div class="phone">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
 
    <transition name="fade">
      <div v-if="showExitToast" class="exit-toast">
        Tekan sekali lagi untuk keluar
      </div>
    </transition>
 
    <PopupModal />
  </div>
</template>

<script setup>
// The .phone shell mimics the mockup's device frame and is shared across
// every screen. Each view renders its own <div class="screen active"> content
// (nav bar, progress bar, etc.) inside this frame.

import { App } from '@capacitor/app';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, provide } from 'vue';
// import { useBackButton, showExitToast } from './composables/useBackButton';
import PopupModal from './components/PopupModal.vue';
import { usePopupStore } from './stores/popup';

// Pastikan Anda mengimpor state modal Anda di sini
// Jika modal dikelola di file lain, gunakan store (Pinia/Vuex)
// import { showModal } from '@/stores/uiStore'; 
// import { showModal } from 'src/views/onboarding/SignupView';

const router = useRouter();
const route = useRoute();
const backPressedOnce = ref(false);
const popupStore = usePopupStore();
const modals = ref({
  confirm: false,
  edit: false,
  success: false,
  ads: false,
  info: false,
  privacyAndTerms: false,
});
provide('globalModals', modals);

onMounted(() => {
  App.addListener('backButton', () => {
    // 0. Logic Menutup Popup Modal (dari usePopupStore) — prioritas tertinggi,
    // karena popup ini render di atas semua layar termasuk modal lainnya.
    if (popupStore.isVisible) {
      popupStore.dismissCurrent();
      return;
    }

    const openModalKey = Object.keys(modals.value).find(key => modals.value[key] === true);

    // 1. Logic Menutup Modal (Prioritas Utama)
    if (openModalKey) {
      if (modals.value.privacyAndTerms === true){
        modals.value[openModalKey] = false;
        router.push('/login');
        return;
      }
      modals.value[openModalKey] = false; // Tutup modal yang ditemukan
      return; // Berhenti, jangan jalankan navigasi router
    }

    const currentPath = route.path;

    // 2. Logic kembali ke Home Chat dari Chat Room
    if (currentPath.includes('/chats/')) {
      router.push('/chats');
      return;
    }

    // 3. Logic kembali ke Home Chat dari tab lain
    if (currentPath !== '/chats') {
      router.push('/chats');
      return;
    }

    // 4. Logic Double Back to Exit
    if (currentPath === '/chats') {
      if (backPressedOnce.value) {
        App.exitApp();
      } else {
        backPressedOnce.value = true;
        alert("Tekan sekali lagi untuk keluar");
        setTimeout(() => { backPressedOnce.value = false; }, 1500);
      }
    }
  });
});

</script>

<style scoped>
/*.exit-toast {
  position: absolute;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  background: rgba(20, 16, 14, 0.95);
  color: var(--text-white, #f0e8d4);
  font-size: 13px;
  padding: 10px 18px;
  border-radius: 20px;
  border: 0.5px solid var(--border, #3a3230);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 50;
  white-space: nowrap;
}*/
</style>