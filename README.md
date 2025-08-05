# Video Highlight Tool

A web application that uses AI to help users create highlight clips from uploaded videos with synchronized transcripts.

🔗 **Live Demo**: [https://video-highlight-tool-gilt.vercel.app/](https://video-highlight-tool-gilt.vercel.app/)

## Features

- 📹 Video upload with drag-and-drop support
- 🤖 Mock AI processing for transcript generation
- ✂️ Select specific sentences to create highlight clips
- 🎬 Preview highlight clips with only selected segments
- 📝 Synchronized transcript overlay on video
- 📱 Responsive design for desktop and mobile
- ⚡ Real-time synchronization between editing and preview areas

## Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
