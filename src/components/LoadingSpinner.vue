<template>
  <div class="loading-container">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
    <div v-if="showProgress" class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  progress?: number
  showProgress?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '處理中...',
  progress: 0,
  showProgress: false
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}
</style>
