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
        class="w-full h-full object-contain"
        controls
      >
        您的瀏覽器不支援影片播放
      </video>

      <!-- 文字覆蓋層 -->
      <TextOverlay v-if="currentOverlayText" :text="currentOverlayText" />
    </div>

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

const videoStore = useVideoStore()
const videoPlayer = ref<HTMLVideoElement>()
const videoDuration = ref(0)
const currentSegmentIndex = ref(0)

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
  // 從第一個選中片段開始播放
  if (videoStore.selectedSentences.length > 0 && videoPlayer.value) {
    const firstSegment = videoStore.selectedSentences[0]
    if (
      videoPlayer.value.currentTime < firstSegment.startTime ||
      videoPlayer.value.currentTime >
        videoStore.selectedSentences[videoStore.selectedSentences.length - 1].endTime
    ) {
      videoPlayer.value.currentTime = firstSegment.startTime
      currentSegmentIndex.value = 0
    } else {
      // 找到當前所在的片段
      currentSegmentIndex.value = videoStore.selectedSentences.findIndex(
        s =>
          videoPlayer.value!.currentTime >= s.startTime &&
          videoPlayer.value!.currentTime <= s.endTime
      )
      if (currentSegmentIndex.value === -1) {
        currentSegmentIndex.value = 0
        videoPlayer.value.currentTime = firstSegment.startTime
      }
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
