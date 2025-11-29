import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/opportunity/',
      name: 'opportunity-risks',
      component: () => import('@/views/OpportunityRisksView.vue'),
    },
  ],
})

export default router
