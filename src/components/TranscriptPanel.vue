<template>
  <div class="transcript-panel overflow-y-auto h-full">
    <div v-for="section in videoStore.sections" :key="section.title" class="mb-6">
      <h3 class="font-semibold text-lg mb-3">{{ section.title }}</h3>
      
      <div class="space-y-2">
        <div
          v-for="sentence in section.sentences"
          :key="sentence.id"
          @click="handleSentenceClick(sentence)"
          :class="[
            'sentence-item p-3 rounded cursor-pointer transition-all',
            sentence.selected ? 'bg-blue-500 text-white' : 'bg-gray-50 hover:bg-gray-100',
            currentSentenceId === sentence.id ? 'ring-2 ring-blue-400' : ''
          ]"
          :data-id="sentence.id"
        >
          <span
            @click.stop="jumpToTime(sentence.startTime)"
            class="timestamp text-sm font-mono mr-3 hover:underline"
            :class="sentence.selected ? 'text-blue-100' : 'text-blue-600'"
          >
            {{ sentence.time }}
          </span>
          <span class="sentence-text">{{ sentence.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVideoStore } from '@/stores/video'
import type { Sentence } from '@/stores/video'

const videoStore = useVideoStore()

const currentSentenceId = computed(() => videoStore.currentSentence?.id)

const handleSentenceClick = (sentence: Sentence) => {
  videoStore.toggleSentenceSelection(sentence.id)
}

const jumpToTime = (time: number) => {
  videoStore.setCurrentTime(time)
  // 這會觸發預覽區的影片跳轉
}

// 自動滾動到當前句子
watch(currentSentenceId, (newId) => {
  if (newId && videoStore.isPlaying) {
    // 使用 nextTick 確保 DOM 更新後再滾動
    const element = document.querySelector(`.sentence-item:has([data-id="${newId}"])`)
    if (!element) return
    
    // 獲取容器和元素的位置
    const container = document.querySelector('.transcript-panel')
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    
    // 檢查元素是否在視窗內
    const isInView = elementRect.top >= containerRect.top && 
                     elementRect.bottom <= containerRect.bottom
    
    // 如果不在視窗內，則滾動到中心位置
    if (!isInView) {
      const scrollTop = container.scrollTop + elementRect.top - containerRect.top - containerRect.height / 2 + elementRect.height / 2
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }
})
</script>

<style scoped>
.transcript-panel {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.transcript-panel::-webkit-scrollbar {
  width: 8px;
}

.transcript-panel::-webkit-scrollbar-track {
  background: #f7fafc;
}

.transcript-panel::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

.sentence-item {
  user-select: none;
}
</style>