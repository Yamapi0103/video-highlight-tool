<template>
  <div class="preview-panel relative h-full flex flex-col">
    <!-- 影片播放器 -->
    <div class="relative bg-black rounded-lg overflow-hidden flex-1 flex items-center justify-center">
      <video
        ref="videoPlayer"
        :src="videoStore.videoUrl"
        @timeupdate="handleTimeUpdate"
        @play="handlePlay"
        @pause="videoStore.setIsPlaying(false)"
        @loadedmetadata="handleVideoLoaded"
        @progress="handleProgress"
        @click="togglePlay"
        class="w-full h-full object-contain cursor-pointer"
      >
        您的瀏覽器不支援影片播放
      </video>

      <!-- 文字覆蓋層 -->
      <TextOverlay v-if="currentOverlayText" :text="currentOverlayText" />
    </div>

    <!-- 自定義控制條 -->
    <VideoControls
      :current-time="videoStore.currentTime"
      :duration="videoDuration"
      :is-playing="videoStore.isPlaying"
      :volume="volume"
      :is-muted="isMuted"
      :buffered="buffered"
      :video-element="videoPlayer"
      :highlight-segments="videoStore.selectedSentences"
      @toggle-play="togglePlay"
      @seek="seekToTime"
      @volume-change="handleVolumeChange"
      @toggle-fullscreen="toggleFullscreen"
      class="mt-2"
    />

    <!-- 時間軸 -->
    <div class="mt-4">
      <Timeline
        :duration="videoDuration"
        :currentTime="videoStore.currentTime"
        :highlights="videoStore.selectedSentences"
        @seek="seekToTime"
      />
    </div>

    <!-- 重點片段資訊 -->
    <div class="mt-4 text-white">
      <p class="text-sm">
        已選擇 {{ videoStore.selectedSentences.length }} 個片段
        <span v-if="totalHighlightDuration > 0">
          （總長度：{{ formatTime(totalHighlightDuration) }}）
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useVideoStore } from '@/stores/video'
import TextOverlay from './TextOverlay.vue'
import Timeline from './Timeline.vue'
import VideoControls from './VideoControls.vue'

const videoStore = useVideoStore()
const videoPlayer = ref<HTMLVideoElement>()
const videoDuration = ref(0)
const currentSegmentIndex = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const buffered = ref<TimeRanges>()

const currentOverlayText = computed(() => {
  const sentence = videoStore.selectedSentences.find(
    s => videoStore.currentTime >= s.startTime && videoStore.currentTime <= s.endTime
  )
  return sentence?.text || ''
})

const totalHighlightDuration = computed(() => {
  return videoStore.selectedSentences.reduce((total, sentence) => {
    return total + (sentence.endTime - sentence.startTime)
  }, 0)
})

const handleTimeUpdate = (event: Event) => {
  const video = event.target as HTMLVideoElement

  // 只播放選中的片段
  if (videoStore.selectedSentences.length > 0 && videoStore.isPlaying) {
    const currentTime = video.currentTime
    const currentSegment = videoStore.selectedSentences[currentSegmentIndex.value]

    if (currentSegment) {
      // 如果當前時間超過當前片段的結束時間
      if (currentTime >= currentSegment.endTime) {
        // 檢查是否有下一個片段
        if (currentSegmentIndex.value < videoStore.selectedSentences.length - 1) {
          currentSegmentIndex.value++
          const nextSegment = videoStore.selectedSentences[currentSegmentIndex.value]
          video.currentTime = nextSegment.startTime
        } else {
          // 所有片段播放完畢
          video.pause()
          currentSegmentIndex.value = 0
          video.currentTime = videoStore.selectedSentences[0].startTime
        }
      }
      // 如果當前時間小於當前片段的開始時間（手動拖動進度條）
      else if (currentTime < currentSegment.startTime) {
        video.currentTime = currentSegment.startTime
      }
    }
  }

  videoStore.setCurrentTime(video.currentTime)
}

const handlePlay = () => {
  // 從最近的下一個選中片段開始播放
  if (videoStore.selectedSentences.length > 0 && videoPlayer.value) {
    const currentTime = videoPlayer.value.currentTime
    
    // 找到當前時間之後最近的選中片段
    const nextSegmentIndex = videoStore.selectedSentences.findIndex(
      s => s.startTime >= currentTime
    )
    
    if (nextSegmentIndex !== -1) {
      // 找到了下一個片段
      currentSegmentIndex.value = nextSegmentIndex
      videoPlayer.value.currentTime = videoStore.selectedSentences[nextSegmentIndex].startTime
    } else {
      // 當前時間在所有片段之後，從第一個片段開始
      currentSegmentIndex.value = 0
      videoPlayer.value.currentTime = videoStore.selectedSentences[0].startTime
    }
  }
  videoStore.setIsPlaying(true)
}

const handleVideoLoaded = (event: Event) => {
  const video = event.target as HTMLVideoElement
  videoDuration.value = video.duration
}

const seekToTime = (time: number) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time
    videoStore.setCurrentTime(time)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (videoPlayer.value) {
    if (videoStore.isPlaying) {
      videoPlayer.value.pause()
    } else {
      videoPlayer.value.play()
    }
  }
}

const handleVolumeChange = (newVolume: number) => {
  if (videoPlayer.value) {
    videoPlayer.value.volume = newVolume
    volume.value = newVolume
    isMuted.value = newVolume === 0
  }
}

const toggleFullscreen = () => {
  const container = document.querySelector('.preview-panel') as HTMLElement
  if (container) {
    if (!document.fullscreenElement) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
}

const handleProgress = () => {
  if (videoPlayer.value) {
    buffered.value = videoPlayer.value.buffered
  }
}

// 監聽從轉錄區傳來的時間跳轉
watch(
  () => videoStore.currentTime,
  newTime => {
    if (videoPlayer.value && Math.abs(videoPlayer.value.currentTime - newTime) > 0.5) {
      videoPlayer.value.currentTime = newTime
    }
  }
)
</script>

<style scoped>
.preview-panel {
  height: 100%;
}
</style>
