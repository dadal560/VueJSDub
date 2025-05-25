import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axio.js'

export const useEvenementStore = defineStore('evenement', () => {
  const evenements = ref([])
  const imagesParEvenement = ref({})
  const ChargementEvenements = ref(false)

  // Charger les événements depuis l’API
  async function RecupererEvenements() {
    ChargementEvenements.value = true
    try {
      const { data } = await api().get('evenements')
      evenements.value = data.member
    } catch (error) {
      console.error('Erreur lors de la récupération des événements :', error)
    } finally {
      ChargementEvenements.value = false
    }
  }

  // Ajouter un événement (avec ou sans image)
  async function AjouterEvenement(formData) {
    try {
      const { data } = await api().post('evenements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      evenements.value.push(data)
      return data
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’événement :', error)
      throw error
    }
  }

  // Récupérer les images associées à un événement donné
  async function ImagesEvenement(evenementId) {
    if (imagesParEvenement.value[evenementId]) {
      return imagesParEvenement.value[evenementId]
    }
    try {
      const res = await api().get(`images`, {
        params: {
          evenement: `/api/evenements/${evenementId}`
        }
      })
      const imagesUrls = res.data.member.map(
        (img) => `http://127.0.0.1:8000/images/dub/${img.fichier}`
      )
      imagesParEvenement.value[evenementId] = imagesUrls
      return imagesUrls
    } catch (error) {
      console.error('Erreur ImagesEvenement:', error)
      throw error
    }
  }

  // Calcul de l’événement prochain
  const evenementProchain = computed(() => {
    const maintenant = new Date()
    return [...evenements.value]
      .filter(e => new Date(e.dateEvenement) > maintenant)
      .sort((a, b) => new Date(a.dateEvenement) - new Date(b.dateEvenement))[0] || null
  })

  return {
    evenements,
    imagesParEvenement,
    ChargementEvenements,
    RecupererEvenements,
    AjouterEvenement,
    ImagesEvenement,
    evenementProchain,
  }
})
