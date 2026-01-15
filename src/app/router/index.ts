import { createRouter, createWebHistory } from 'vue-router'
import { Routes } from '@/shared/lib'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: Routes.home,
      name: 'home',
      component: () => import('@/pages/home/HomePage.vue'),
    },
    {
      path: Routes.login,
      name: 'login',
      component: () => import('@/pages/login/LoginPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: Routes.home,
    },
  ],
})

export default router
