import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Characters from '../views/CharactersView.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/characters', component: Characters },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
