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
  bottom: 15%;  /* 相對於影片高度的百分比，而不是固定 60px */
  left: 50%;
  transform: translateX(-50%);
  max-width: 80%;
  z-index: var(--z-overlay);
}

.overlay-content {
  background: var(--overlay-bg);
  color: white;
  padding: 0.75rem 1.5rem;  /* 使用 rem 而不是 px */
  border-radius: 0.5rem;
  font-size: 1.125rem;      /* 18px = 1.125rem */
  text-align: center;
  line-height: 1.5;
  box-shadow: 0 4px 6px var(--shadow-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-slow) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>