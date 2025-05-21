import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useArtisteStore = defineStore('artiste', () => {
  const artistes = ref([])
  const artisteSelectionne = ref(null)

  async function Artistes() {
    const { data } = await axios.get('http://localhost:8000/api/artistes')
    artistes.value = data.member
  }

  async function Artiste(id) {
    const { data } = await axios.get(`http://localhost:8000/api/artistes/${id}`)
    artisteSelectionne.value = data
  }

  return { artistes, artisteSelectionne, Artistes, Artiste }
})
