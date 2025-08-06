# Video Highlight Tool 專案知識庫

## 專案概述

這是一個影片重點剪輯工具的前端作業專案，為 GliadCloud 的面試作業。使用者可以上傳影片，透過 AI 輔助創建重點片段並添加字幕。

線上演示：https://video-highlight-tool-gilt.vercel.app/

## 核心需求分析 (requirements.md)

### 交付內容

- GitHub 程式碼
- 技術選擇文檔
- 線上運行網址

### 支援平台

- 桌面：Windows & Mac，最新版 Chrome
- 行動裝置：iOS & Android，最新版 Chrome & Safari

### 主要功能需求

1. **影片上傳**：支援影片檔案上傳
2. **Mock AI 處理**：模擬 AI 分析，返回 JSON 格式的轉錄資料
3. **分割畫面設計**：左側編輯區，右側預覽區
4. **編輯功能**：選擇/取消選擇句子，點擊時間戳跳轉
5. **預覽功能**：只播放選中片段，顯示字幕覆蓋
6. **雙向同步**：編輯區和預覽區即時互動

### 評估標準

- 功能實作完整性
- 程式碼品質與組織
- 文檔品質
- 使用者體驗設計
- 響應式網頁設計
- Mock 資料品質
- 整體完成度

## 技術架構

### 核心技術棧

- **前端框架**：Vue 3 (Composition API)
- **建構工具**：Vite
- **程式語言**：TypeScript
- **狀態管理**：Pinia
- **樣式框架**：Tailwind CSS
- **工具庫**：@vueuse/core

### 依賴版本

```json
{
  "vue": "^3.5.18",
  "pinia": "^3.0.3",
  "@vueuse/core": "^11.2.0",
  "vite": "^7.0.6",
  "typescript": "~5.8.0",
  "tailwindcss": "^3.4.17"
}
```

## 專案結構

```
src/
├── App.vue              # 主應用組件（分割畫面布局）
├── main.ts              # 應用入口
├── style.css            # 全域樣式（Tailwind）
├── components/          # UI 組件
│   ├── VideoUploader.vue    # 影片上傳
│   ├── TranscriptPanel.vue  # 轉錄編輯區
│   ├── PreviewPanel.vue     # 預覽播放器
│   ├── TextOverlay.vue      # 字幕覆蓋
│   ├── Timeline.vue         # 時間軸顯示
│   └── LoadingSpinner.vue   # 載入動畫
└── stores/              # 狀態管理
    └── video.ts         # 影片相關狀態
```

## 重要實作細節

### 純前端影片處理

- 使用 `URL.createObjectURL()` 處理本地影片
- 無需上傳到伺服器，保護使用者隱私
- HTML5 `<video>` 元素進行播放控制

### Mock AI 實作

- 模擬 2-3 秒處理延遲
- 生成包含章節、句子、時間戳的轉錄資料
- 自動標記建議的重點句子

### 播放控制邏輯

- 監聽 `timeupdate` 事件
- 自動跳過未選中片段
- 支援手動拖動進度條時的智能定位
- 播放結束自動停止

### 響應式設計策略

- 桌面：水平分割（md:grid-cols-2）
- 行動裝置：垂直堆疊
- 使用 Tailwind 響應式類別實現

### 雙向同步機制

- Vue 響應式系統實現即時更新
- 點擊時間戳 → 影片跳轉
- 播放進度 → 高亮當前句子
- 自動滾動保持當前句子可見

## 開發指令

**重要：請始終使用 yarn 作為套件管理工具**

```bash
# 安裝依賴
yarn install

# 開發模式
yarn dev

# 類型檢查
yarn type-check

# 建構生產版本
yarn build

# 預覽生產版本
yarn preview

# 格式化程式碼
yarn prettier --write "src/**/*.{js,ts,vue,css}" "*.{js,ts,json,md}"
```

## 效能優化考量

1. 組件懶加載（如需要）
2. 防抖處理頻繁事件
3. 使用計算屬性優化重複計算
4. Tailwind PurgeCSS 減少 CSS 大小

## 未來擴展方向

1. 整合真實 AI 服務替換 Mock API
2. 支援更多影片格式
3. 添加影片匯出功能
4. 多語言字幕支援
5. 協作編輯功能

## 注意事項

- 確保瀏覽器支援 ES2015+ 特性
- 影片檔案大小可能影響效能
- Mock API 僅用於演示，實際應用需要後端支援
