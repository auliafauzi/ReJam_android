<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2
         C 16.5 2 19.5 6 19.5 10
         C 19.5 15 16 21 12 22
         C 8 21 4.5 15 4.5 10
         C 4.5 6 7.5 2 12 2 Z"
      :fill="color"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 20,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})
</script>