import { createRouter, createWebHistory } from 'vue-router'
import TestPage from '../views/TestPage.vue'

const routes = [
  {
    path: '/',
    name: 'TestPage',
    component: TestPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
