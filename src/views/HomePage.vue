<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="container mx-auto p-4 flex-1">
      <h1 class="text-3xl font-bold text-center mb-8">Video Highlight Tool</h1>
      
      <div class="max-w-2xl mx-auto">
        <VideoUploader />
      </div>
    </div>
    
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import VideoUploader from '@/components/VideoUploader.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>