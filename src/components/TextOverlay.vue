<template>
  <transition name="fade">
    <div class="text-overlay">
      <div class="overlay-content">
        {{ text }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<style scoped>
.text-overlay {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 80%;
  z-index: 10;
}

.overlay-content {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>