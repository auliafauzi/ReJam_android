<template>
  <nav class="nav-bar"> 
    <router-link to="/chats" class="nav-item" :class="{ active: isActive('chats') }">
      <i class="ti ti-message-circle"></i><span>Chats</span>
      <span v-if="unread > 0" class="badge" style="margin-top:-2px;">{{ unread }}</span>
    </router-link>
    <router-link to="/bands" class="nav-item" :class="{ active: isActive('bands') }">
      <GuitarPickIcon :size="20" />
      <span>Jam</span>
    </router-link>
    <router-link to="/support" class="nav-item" :class="{ active: isActive('support') }">
      <i class="ti ti-headphones"></i><span>Support</span>
    </router-link>
    <router-link to="/profile" class="nav-item" :class="{ active: isActive('profile') }">
      <i class="ti ti-user"></i><span>Profile</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useBandsStore } from '../stores/bands'
import GuitarPickIcon from './GuitarPickIcon.vue'

const route = useRoute()
const bandsStore = useBandsStore()
const unread = bandsStore.totalUnread

function isActive(section) {
  return route.path.startsWith(`/${section}`)
}
</script>
