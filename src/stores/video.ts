import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Sentence {
  id: string
  time: string
  text: string
  startTime: number // 秒
  endTime: number // 秒
  selected: boolean
}

export interface Section {
  title: string
  sentences: Sentence[]
}

export const useVideoStore = defineStore('video', () => {
  // 狀態
  const videoFile = ref<File | null>(null)
  const videoUrl = ref<string>('')
  const currentTime = ref<number>(0)
  const isPlaying = ref<boolean>(false)
  const sections = ref<Section[]>([])
  const isProcessing = ref<boolean>(false)

  // 計算屬性
  const selectedSentences = computed(() => {
    return sections.value
      .flatMap(section => section.sentences.filter(sentence => sentence.selected))
      .sort((a, b) => a.startTime - b.startTime)
  })

  const currentSentence = computed(() => {
    return sections.value
      .flatMap(section => section.sentences)
      .find(
        sentence => currentTime.value >= sentence.startTime && currentTime.value <= sentence.endTime
      )
  })

  // 動作
  const setVideoFile = (file: File) => {
    videoFile.value = file
    videoUrl.value = URL.createObjectURL(file)
  }

  const toggleSentenceSelection = (sentenceId: string) => {
    sections.value.forEach(section => {
      section.sentences.forEach(sentence => {
        if (sentence.id === sentenceId) {
          sentence.selected = !sentence.selected
        }
      })
    })
  }

  const setCurrentTime = (time: number) => {
    currentTime.value = time
  }

  const setIsPlaying = (playing: boolean) => {
    isPlaying.value = playing
  }

  return {
    // 狀態
    videoFile,
    videoUrl,
    currentTime,
    isPlaying,
    sections,
    isProcessing,
    // 計算屬性
    selectedSentences,
    currentSentence,
    // 動作
    setVideoFile,
    toggleSentenceSelection,
    setCurrentTime,
    setIsPlaying
  }
})
