<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Breadcrumb (full width for sticky) -->
    <div class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <button
            @click="router.push('/')"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-sm font-medium">Back to Home</span>
          </button>
          <h1 class="text-sm font-semibold text-gray-900">Video Highlight Editor</h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto p-4">
      <!-- Desktop Header -->
      <div class="hidden lg:flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Video Highlight Editor</h1>
        <button
          @click="router.push('/')"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Home
        </button>
      </div>

      <!-- 編輯器主介面 -->
      <div class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
        <!-- 左側：轉錄文字編輯區 -->
        <div class="lg:w-1/2 h-1/2 lg:h-full bg-white rounded-lg shadow-md p-4 flex flex-col">
          <h2 class="text-lg md:text-xl font-semibold mb-4 flex-shrink-0">Transcript</h2>
          <TranscriptPanel class="flex-1 overflow-hidden" />
        </div>

        <!-- 右側：影片預覽區 -->
        <div class="lg:w-1/2 h-2/3 lg:h-full bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
          <h2 class="text-lg md:text-xl font-semibold text-white mb-4 flex-shrink-0">Preview</h2>
          <PreviewPanel class="flex-1 overflow-hidden" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { onMounted } from 'vue'
import TranscriptPanel from '@/components/TranscriptPanel.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'

const router = useRouter()
const videoStore = useVideoStore()

onMounted(() => {
  // 如果沒有影片資料，導回首頁
  if (!videoStore.videoFile || !videoStore.sections.length) {
    router.push('/')
  }
})
</script>