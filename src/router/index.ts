import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import PreviewPage from '@/views/PreviewPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewPage,
    },
  ],
})

export default router