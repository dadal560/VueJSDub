import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Artistes from '../components/CarteArtistes.vue'
import Evenements from '../components/CarteEvenement.vue'

const routes = [
  { path: '/', name: 'Accueil', component: Accueil },
  { path: '/evenements', name: 'Evenements', component: Evenements },
  { path: '/artistes', name: 'Artistes', component: Artistes }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
