<template>
  <section class="formulaire-evenement" role="form" aria-labelledby="titre-formulaire-evenement">
    <h2 id="titre-formulaire-evenement">Ajouter un événement</h2>
    <form @submit.prevent="soumettreEvenement" enctype="multipart/form-data">
      <label for="titre">Titre :</label>
      <input type="text" id="titre" v-model="evenement.titre" required />

      <label for="description">Description :</label>
      <textarea id="description" v-model="evenement.description" required></textarea>

      <label for="date">Date :</label>
      <input type="datetime-local" id="date" v-model="evenement.dateEvenement" required />

      <fieldset>
        <legend>Lieu</legend>
        <label for="lieu-nom">Nom du lieu :</label>
        <input type="text" id="lieu-nom" v-model="lieu.nom" required />
        <label for="lieu-adresse">Adresse du lieu :</label>
        <input type="text" id="lieu-adresse" v-model="lieu.adresse" required />
      </fieldset>

      <fieldset>
        <legend>Artistes associés</legend>
        <p v-if="artisteStore.ChargementArtistes" role="status" aria-live="polite">
          Chargement des artistes...
        </p>
        <label v-for="artiste in artistes" :key="artiste.id" class="checkbox-artiste">
          <input type="checkbox" :value="artiste.id" v-model="artistesSelectionnes" />
          {{ artiste.nom }}
        </label>
      </fieldset>

      <fieldset>
        <legend>Image de l’événement</legend>
        <label for="image-nom">Nom de l'image :</label>
        <input type="text" id="image-nom" v-model="image.nom" required />
        <label for="image-type">Type :</label>
        <input type="text" id="image-type" v-model="image.type" />
        <label for="imageFile">Fichier image :</label>
        <input type="file" id="imageFile" @change="chargerImage" accept="image/*" required />
      </fieldset>

      <button type="submit" :disabled="chargement" aria-disabled="chargement">Soumettre</button>
      <p v-if="message" role="alert" class="message">{{ message }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArtisteStore } from '@/stores/artiste'
import api from '@/api/axio.js'

const router = useRouter()
const artisteStore = useArtisteStore()

const evenement = ref({
  titre: '',
  description: '',
  dateEvenement: '',
})

const lieu = ref({
  nom: '',
  adresse: '',
})

const artistes = ref([])
const artistesSelectionnes = ref([])

const image = ref({
  nom: '',
  type: '',
  fichier: null,
})

const message = ref('')
const chargement = ref(false)

onMounted(async () => {
  try {
    await artisteStore.RecupererArtistes()
    artistes.value = artisteStore.artistes
  } catch (error) {
    console.error('Erreur lors du chargement des artistes :', error)
    message.value = 'Erreur lors du chargement des artistes.'
  }
})

function chargerImage(event) {
  image.value.fichier = event.target.files[0]
}

async function soumettreEvenement() {
  if (!image.value.fichier) {
    message.value = 'Veuillez sélectionner un fichier image.'
    return
  }
  chargement.value = true
  message.value = ''

  try {
    const reponseEvenement = await api().post(
      '/evenements',
      {
        ...evenement.value,
        artistes: artistesSelectionnes.value.map((id) => `/api/artistes/${id}`),
      },
      { headers: { 'Content-Type': 'application/ld+json' } },
    )
    const evenementId = reponseEvenement.data.id
    const evenementIri = `/api/evenements/${evenementId}`

    const reponseLieu = await api().post(
      '/lieus',
      {
        nom: lieu.value.nom,
        adresse: lieu.value.adresse,
        evenements: [evenementIri],
      },
      { headers: { 'Content-Type': 'application/ld+json' } },
    )
    const lieuIri = `/api/lieus/${reponseLieu.data.id}`

    await api().patch(
      `/evenements/${evenementId}`,
      { lieu: lieuIri },
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    )

    const formData = new FormData()
    formData.append('nom', image.value.nom)
    formData.append('type', image.value.type)
    formData.append('imageFile', image.value.fichier)
    formData.append('evenement', evenementIri)

    await api().post('/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    message.value = 'Événement créé avec succès !'
    evenement.value = { titre: '', description: '', dateEvenement: '' }
    lieu.value = { nom: '', adresse: '' }
    artistesSelectionnes.value = []
    image.value = { nom: '', type: '', fichier: null }
    setTimeout(() => router.push('/'), 1500)
  } catch (e) {
    console.error('Erreur lors de la création de l’événement :', e)
    message.value = 'Erreur lors de la création de l’événement.'
  } finally {
    chargement.value = false
  }
}
</script>

<style scoped>
.formulaire-evenement {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 450px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9fafb;
}

input[type='text'],
input[type='datetime-local'],
textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  padding: 0.6rem;
  background-color: #ff6a00;
  color: black;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin: 1rem auto;
  width: fit-content;
  text-align: center;
}

button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

.message {
  font-weight: bold;
  margin-top: 1rem;
  color: green;
}

.checkbox-artiste {
  display: block;
  margin-bottom: 0.3rem;
}
</style>
