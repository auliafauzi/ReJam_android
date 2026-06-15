<template>
  <div class="phone">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// The .phone shell mimics the mockup's device frame and is shared across
// every screen. Each view renders its own <div class="screen active"> content
// (nav bar, progress bar, etc.) inside this frame.
</script>
