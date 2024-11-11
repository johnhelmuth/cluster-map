import { createRouter, createWebHistory } from 'vue-router'
import ClusterMapView from '@/views/ClusterMapView.vue';
import ClustersView from "@/views/ClustersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ClusterMapView,
    },
    {
      path: '/map',
      name: 'map',
      component: ClusterMapView,
    },
    {
      path: '/clusters',
      name: 'clusters',
      component: ClustersView,
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
      path: '/settings',
      name: 'settings',
      // @ts-ignore
      component: () => import('@/views/SettingsView.vue'),
    }

  ],
});

export default router
