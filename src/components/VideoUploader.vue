<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div
      v-if="!videoStore.videoFile"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-lg p-12 text-center transition-all',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        accept="video/*"
        @change="handleFileUpload"
        class="hidden"
      />

      <svg
        class="mx-auto h-12 w-12 text-gray-400 mb-4"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m0 0v8a4 4 0 004 4h24a4 4 0 004-4V28m-8-20h8m0 0v8m0-8L28 20"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <button
        @click="() => fileInput?.click()"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        選擇影片
      </button>

      <p class="mt-2 text-sm text-gray-600">或拖放影片到此處</p>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
            />
          </svg>
          <div>
            <p class="font-medium">{{ videoStore.videoFile.name }}</p>
            <p class="text-sm text-gray-500">{{ formatFileSize(videoStore.videoFile.size) }}</p>
          </div>
        </div>
        <button @click="removeVideo" class="text-red-600 hover:text-red-700">移除</button>
      </div>

      <button
        @click="processVideo"
        :disabled="videoStore.isProcessing"
        class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="!videoStore.isProcessing">開始 AI 處理</span>
      </button>

      <LoadingSpinner
        v-if="videoStore.isProcessing"
        text="AI 正在分析影片..."
        :progress="processingProgress"
        :showProgress="true"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const videoStore = useVideoStore()
const fileInput = ref<HTMLInputElement>()
const processingProgress = ref(0)
const isDragging = ref(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type.startsWith('video/')) {
    videoStore.setVideoFile(file)
  } else {
    alert('請選擇有效的影片檔案')
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false

  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('video/')) {
    videoStore.setVideoFile(file)
  } else {
    alert('請選擇有效的影片檔案')
  }
}

const removeVideo = () => {
  if (videoStore.videoUrl) {
    URL.revokeObjectURL(videoStore.videoUrl)
  }
  videoStore.videoFile = null
  videoStore.videoUrl = ''
  videoStore.sections = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const processVideo = async () => {
  videoStore.isProcessing = true
  processingProgress.value = 0

  // 模擬進度更新
  const progressInterval = setInterval(() => {
    processingProgress.value += 10
    if (processingProgress.value >= 90) {
      clearInterval(progressInterval)
    }
  }, 200)

  // 模擬 AI 處理
  setTimeout(() => {
    // Mock API 返回的數據
    const mockApiResponse = {
      fullTranscript:
        "Welcome to our product demonstration. Today, we'll be showcasing our latest innovation...",
      sections: [
        {
          title: 'Introduction',
          sentences: [
            {
              id: '1',
              time: '00:00',
              text: 'Welcome to our product demonstration.',
              startTime: 0,
              endTime: 3,
              selected: false
            },
            {
              id: '2',
              time: '00:05',
              text: "Today, we'll be showcasing our latest innovation.",
              startTime: 5,
              endTime: 8,
              selected: true
            }
          ]
        },
        {
          title: 'Key Features',
          sentences: [
            {
              id: '3',
              time: '00:15',
              text: 'Our product has three main features.',
              startTime: 15,
              endTime: 18,
              selected: false
            },
            {
              id: '4',
              time: '00:20',
              text: "First, it's incredibly easy to use.",
              startTime: 20,
              endTime: 23,
              selected: false
            },
            {
              id: '5',
              time: '00:25',
              text: "Second, it's highly efficient.",
              startTime: 25,
              endTime: 28,
              selected: false
            },
            {
              id: '6',
              time: '00:30',
              text: "And third, it's cost-effective.",
              startTime: 30,
              endTime: 33,
              selected: false
            }
          ]
        },
        {
          title: 'Demonstration',
          sentences: [
            {
              id: '7',
              time: '00:40',
              text: 'Let me show you how it works.',
              startTime: 40,
              endTime: 43,
              selected: false
            },
            {
              id: '8',
              time: '00:45',
              text: 'Simply press this button to start.',
              startTime: 45,
              endTime: 48,
              selected: true
            },
            {
              id: '9',
              time: '00:50',
              text: 'The interface is intuitive and user-friendly.',
              startTime: 50,
              endTime: 53,
              selected: true
            }
          ]
        },
        {
          title: 'Conclusion',
          sentences: [
            {
              id: '10',
              time: '01:00',
              text: 'In conclusion, our product is a game-changer.',
              startTime: 60,
              endTime: 63,
              selected: false
            },
            {
              id: '11',
              time: '01:05',
              text: "We're excited to bring this to market.",
              startTime: 65,
              endTime: 68,
              selected: true
            },
            {
              id: '12',
              time: '01:10',
              text: 'Thank you for your attention.',
              startTime: 70,
              endTime: 73,
              selected: false
            }
          ]
        }
      ],
      suggestedHighlights: ['2', '8', '9', '11'] // AI 建議的重點句子 ID
    }

    // 設定數據到 store
    videoStore.sections = mockApiResponse.sections

    // 根據 AI 建議自動選中重點句子
    mockApiResponse.suggestedHighlights.forEach(id => {
      videoStore.toggleSentenceSelection(id)
    })

    processingProgress.value = 100
    setTimeout(() => {
      videoStore.isProcessing = false
      processingProgress.value = 0
      // 處理完成後導航到預覽頁面
      router.push('/preview')
    }, 200)
  }, 2000)
}
</script>
