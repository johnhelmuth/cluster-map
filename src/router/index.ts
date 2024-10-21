import { createRouter, createWebHistory } from 'vue-router'
import ClusterMapView from '@/views/ClusterMapView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ClusterMapView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // @ts-ignore
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: ClusterMapView,
    }

  ],
})

export default router
