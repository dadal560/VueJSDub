import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEvenementStore = defineStore('evenement', () => {
  const evenements = ref([])
  const evenementProchain = ref(null)

  async function Evenements() {
    const { data } = await axios.get('http://localhost:8000/api/evenements')
    evenements.value = data.member
  }

  async function EvenementProchain() {
    const { data } = await axios.get('http://localhost:8000/api/evenements')
    const tous = data.member
    const maintenant = new Date()
    const prochains = tous
      .filter((e) => new Date(e.dateEvenement) > maintenant)
      .sort((a, b) => new Date(a.dateEvenement) - new Date(b.dateEvenement))
    evenementProchain.value = prochains[0] || null
  }

  return { evenements, evenementProchain, Evenements, EvenementProchain }
})
