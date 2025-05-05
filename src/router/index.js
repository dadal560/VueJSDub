import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Evenements from '../views/Evenements.vue'

const routes = [
  { path: '/', name: 'Accueil', component: Accueil },
  { path: '/evenements', name: 'Evenements', component: Evenements }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
