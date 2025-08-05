<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-8">Video Highlight Tool</h1>
      
      <!-- 影片上傳區域 -->
      <div v-if="!videoStore.videoFile || !videoStore.sections.length" class="max-w-2xl mx-auto">
        <VideoUploader />
      </div>
      
      <!-- 編輯器主介面 -->
      <div v-else class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
        <!-- 左側：轉錄文字編輯區 -->
        <div class="lg:w-1/2 h-1/2 lg:h-full bg-white rounded-lg shadow-md p-4 flex flex-col">
          <h2 class="text-lg md:text-xl font-semibold mb-4 flex-shrink-0">Transcript</h2>
          <TranscriptPanel class="flex-1 overflow-hidden" />
        </div>
        
        <!-- 右側：影片預覽區 -->
        <div class="lg:w-1/2 h-1/2 lg:h-full bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
          <h2 class="text-lg md:text-xl font-semibold text-white mb-4 flex-shrink-0">Preview</h2>
          <PreviewPanel class="flex-1 overflow-hidden" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVideoStore } from '@/stores/video'
import VideoUploader from '@/components/VideoUploader.vue'
import TranscriptPanel from '@/components/TranscriptPanel.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'

const videoStore = useVideoStore()
</script>

<style scoped>
</style>