<template>
  <div class="video-progress-bar relative">
    <!-- 進度條容器 -->
    <div
      ref="progressContainer"
      @mouseenter="showPreview = true"
      @mouseleave="showPreview = false"
      @mousemove="handleMouseMove"
      @click="handleClick"
      class="relative h-2 bg-gray-600 rounded-full cursor-pointer group"
    >
      <!-- 緩衝進度 -->
      <div
        class="absolute h-full bg-gray-500 rounded-full"
        :style="{ width: `${bufferedPercent}%` }"
      />
      
      <!-- 高亮片段標記 -->
      <div
        v-for="segment in highlightSegments"
        :key="segment.id"
        class="absolute h-full bg-yellow-400 bg-opacity-50 rounded-full"
        :style="{
          left: `${(segment.startTime / duration) * 100}%`,
          width: `${((segment.endTime - segment.startTime) / duration) * 100}%`
        }"
      />
      
      <!-- 播放進度 -->
      <div
        class="absolute h-full bg-blue-500 rounded-full"
        :style="{ width: `${progressPercent}%` }"
      />
      
      <!-- 進度點 -->
      <div
        class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        :style="{ left: `calc(${progressPercent}% - 8px)` }"
      />

    </div>
    
    <!-- 預覽提示（放在進度條容器外面，確保在最上層） -->
    <div
      v-if="showPreview && previewTime !== null"
      class="absolute bottom-full mb-4 -translate-x-1/2 pointer-events-none z-50"
      :style="{ left: `${previewPosition}px` }"
    >
      <div class="bg-gray-900 text-white rounded-lg shadow-xl p-2">
        <!-- 預覽影片 -->
        <div class="w-40 h-24 bg-black rounded overflow-hidden mb-1">
          <canvas
            ref="previewCanvas"
            class="w-full h-full object-contain"
            width="160"
            height="96"
          />
        </div>
        <!-- 時間顯示 -->
        <div class="text-xs text-center">{{ formatTime(previewTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  currentTime: number
  duration: number
  buffered?: TimeRanges
  videoElement?: HTMLVideoElement
  highlightSegments?: Array<{
    id: string
    startTime: number
    endTime: number
  }>
}>()

const emit = defineEmits<{
  seek: [time: number]
}>()

const progressContainer = ref<HTMLDivElement>()
const previewCanvas = ref<HTMLCanvasElement>()
const previewVideo = ref<HTMLVideoElement | undefined>()
const showPreview = ref(false)
const previewTime = ref<number | null>(null)
const previewPosition = ref(0)

const progressPercent = computed(() => {
  if (!props.duration) return 0
  return (props.currentTime / props.duration) * 100
})

const bufferedPercent = computed(() => {
  if (!props.buffered || props.buffered.length === 0 || !props.duration) return 0
  const bufferedEnd = props.buffered.end(props.buffered.length - 1)
  return (bufferedEnd / props.duration) * 100
})

const handleMouseMove = (event: MouseEvent) => {
  if (!progressContainer.value || !props.duration) return
  
  const rect = progressContainer.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  previewPosition.value = x
  previewTime.value = (x / rect.width) * props.duration
  
  // 更新預覽畫面
  updatePreview()
}

const handleClick = (event: MouseEvent) => {
  if (!progressContainer.value || !props.duration) return
  
  const rect = progressContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const time = (x / rect.width) * props.duration
  emit('seek', time)
}

const updatePreview = async () => {
  if (!props.videoElement || !previewCanvas.value || previewTime.value === null) return
  
  // 創建隱藏的 video 元素用於預覽
  if (!previewVideo.value) {
    previewVideo.value = document.createElement('video')
    previewVideo.value.src = props.videoElement.src
    previewVideo.value.muted = true
    previewVideo.value.preload = 'auto'
    previewVideo.value.style.display = 'none'
    document.body.appendChild(previewVideo.value)
  }
  
  const ctx = previewCanvas.value.getContext('2d')
  if (!ctx) return
  
  try {
    const video = previewVideo.value as HTMLVideoElement
    video.currentTime = previewTime.value
    
    // 等待 seeked 事件
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        ctx.drawImage(video, 0, 0, 160, 96)
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }
      video.addEventListener('seeked', onSeeked)
      
      // 添加超時保護
      setTimeout(() => {
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }, 500)
    })
  } catch (error) {
    console.error('Preview update failed:', error)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 清理資源
onUnmounted(() => {
  if (previewVideo.value) {
    previewVideo.value.pause()
    previewVideo.value.src = ''
    previewVideo.value.load()
    previewVideo.value.remove()
    previewVideo.value = undefined
  }
})
</script>