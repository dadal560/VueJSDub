import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axio.js'

export const useArtisteStore = defineStore('artiste', () => {
  const artistes = ref([])
  const artisteSelectionne = ref(null)
  const ChargementArtistes = ref(false)
  const imagesParArtiste = ref({})

  async function RecupererArtistes() {
    ChargementArtistes.value = true
    try {
      const { data } = await api().get('artistes')
      artistes.value = data.member
    } catch (error) {
      console.error('Erreur chargement artistes', error)
    } finally {
      ChargementArtistes.value = false
    }
  }

  async function Artiste(id) {
    const { data } = await api().get(`artistes/${id}`)
    artisteSelectionne.value = data
  }

  async function ImagesArtiste(artisteId) {
    if (imagesParArtiste.value[artisteId]) {
      return imagesParArtiste.value[artisteId]
    }
    try {
      const res = await api().get(`/images`, {
        params: {
          artiste: `/api/artistes/${artisteId}`,
          'exists[artiste]': true,
        },
      })

      const imagesUrls = res.data.member.map(
        (img) => `http://127.0.0.1:8000/images/dub/${img.fichier}`,
      )
      const firstImage = imagesUrls.length > 0 ? imagesUrls[0] : null
      imagesParArtiste.value[artisteId] = firstImage
      return firstImage
    } catch (error) {
      console.error('Erreur ImagesArtiste:', error)
      imagesParArtiste.value[artisteId] = null
      throw error
    }
  }

  async function chargerImagesPourTousLesArtistes(artistesListe) {
    await Promise.all(
      artistesListe.map(async (artiste) => {
        try {
          await ImagesArtiste(artiste.id)
        } catch {
          imagesParArtiste.value[artiste.id] = null
        }
      }),
    )
  }

  return {
    artistes,
    artisteSelectionne,
    RecupererArtistes,
    Artiste,
    ChargementArtistes,
    ImagesArtiste,
    chargerImagesPourTousLesArtistes,
    imagesParArtiste,
  }
})
