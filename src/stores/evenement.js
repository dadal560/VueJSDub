import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axio.js'

export const useEvenementStore = defineStore('evenement', () => {
  const evenements = ref([])
  const imagesParEvenement = ref({})
  const ChargementEvenements = ref(false)
  const lieuxParEvenement = ref({})

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
  async function RecupererLieu(lieuUrl) {
    // Extraire l'id du lieu de l'URL si besoin (ex: "/api/lieux/10" => 10)
    const lieuId = lieuUrl.split('/').pop()
    if (lieuxParEvenement.value[lieuId]) {
      return lieuxParEvenement.value[lieuId]
    }
    try {
      const { data } = await api().get(`lieus/${lieuId}`)
      lieuxParEvenement.value[lieuId] = data
      return data
    } catch (error) {
      console.error(`Erreur lors de la récupération du lieu ${lieuId} :`, error)
      throw error
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
          evenement: `/api/evenements/${evenementId}`,
          'exists[evenements]': true,
        },
      })
      const imagesUrls = res.data.member.map(
        (img) => `http://127.0.0.1:8000/images/dub/${img.fichier}`,
      )
      imagesParEvenement.value[evenementId] = imagesUrls
      return imagesUrls
    } catch (error) {
      console.error('Erreur ImagesEvenement:', error)
      throw error
    }
  }
  // Charger les images pour tous les événements
  async function chargerImagesPourTousLesEvenements() {
    await Promise.all(
      evenements.value.map(async (evenement) => {
        try {
          await ImagesEvenement(evenement.id)
        } catch (error) {
          imagesParEvenement.value[evenement.id] = null
          console.error(
            `Erreur lors du chargement des images pour l'événement ${evenement.id} :`,
            error,
          )
        }
      }),
    )
  }
  return {
    evenements,
    imagesParEvenement,
    ChargementEvenements,
    lieuxParEvenement,
    RecupererEvenements,
    RecupererLieu,
    AjouterEvenement,
    ImagesEvenement,
    chargerImagesPourTousLesEvenements,
  }
})
