import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Levels from "@/views/Levels.vue";
import Stages from "@/views/Stages.vue";
import Exercises from "@/views/Exercises.vue";
import Lectures from "@/views/Lectures.vue";
import Callback from '@/views/Callback'
import ErrorPage from '@/views/Error'

import { routeGuard } from '@/auth'

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: routeGuard
  },
  {
    path: "/levels",
    name: "Levels",
    component: Levels,
    beforeEnter: routeGuard
  },
  {
    path: "/stages",
    name: "Stages",
    component: Stages,
    beforeEnter: routeGuard
  },
  {
    path: "/exercises",
    name: "Exercises",
    component: Exercises,
    beforeEnter: routeGuard
  },
  {
    path: "/lectures",
    name: "Lectures",
    component: Lectures,
    beforeEnter: routeGuard
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
