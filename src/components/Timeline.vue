<template>
  <div class="timeline bg-gray-700 rounded-lg p-2">
    <div 
      class="timeline-track relative h-8 bg-gray-600 rounded cursor-pointer"
      @click="handleTrackClick"
      ref="trackRef"
    >
      <!-- 重點片段標記 -->
      <div
        v-for="highlight in highlights"
        :key="highlight.id"
        class="highlight-segment absolute h-full bg-blue-500 opacity-70"
        :style="{
          left: `${(highlight.startTime / duration) * 100}%`,
          width: `${((highlight.endTime - highlight.startTime) / duration) * 100}%`
        }"
      />
      
      <!-- 播放頭 -->
      <div
        class="playhead absolute top-0 h-full w-1 bg-red-500"
        :style="{ left: `${(currentTime / duration) * 100}%` }"
      >
        <div class="absolute -top-1 -left-2 w-5 h-5 bg-red-500 rounded-full" />
      </div>
    </div>
    
    <!-- 時間標記 -->
    <div class="flex justify-between mt-1 text-xs text-gray-400">
      <span>{{ formatTime(0) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Sentence } from '@/stores/video'

interface Props {
  duration: number
  currentTime: number
  highlights: Sentence[]
}

interface Emits {
  (e: 'seek', time: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const trackRef = ref<HTMLDivElement>()

const handleTrackClick = (event: MouseEvent) => {
  if (!trackRef.value) return
  
  const rect = trackRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const time = percentage * props.duration
  
  emit('seek', Math.max(0, Math.min(time, props.duration)))
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.timeline-track {
  position: relative;
  overflow: hidden;
}

.highlight-segment {
  transition: opacity 0.2s ease;
}

.highlight-segment:hover {
  opacity: 0.9;
}

.playhead {
  pointer-events: none;
  transition: left 0.1s linear;
}
</style>