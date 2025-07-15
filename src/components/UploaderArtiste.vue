<template>
  <section class="formulaire-artiste" role="form" aria-labelledby="titre-formulaire-artiste">
    <h2 id="titre-formulaire-artiste">Ajouter un artiste</h2>
    <form @submit.prevent="soumettreArtiste" enctype="multipart/form-data">
      <label for="nom">Nom :</label>
      <input type="text" id="nom" v-model="artiste.nom" required />
      <label for="biographie">Biographie :</label>
      <textarea id="biographie" v-model="artiste.biographie"></textarea>
      <h3>Image de l’artiste</h3>
      <label for="image-nom">Nom de l'image :</label>
      <input type="text" id="image-nom" v-model="image.nom" required />
      <label for="image-type">Type :</label>
      <input type="text" id="image-type" v-model="image.type" />
      <label for="imageFile">Fichier image :</label>
      <input type="file" id="imageFile" @change="chargerImage" accept="image/*" required />
      <button type="submit" :disabled="chargement" aria-disabled="chargement">Soumettre</button>
      <p
        v-if="message"
        role="alert"
        :class="{ 'message-success': !erreur, 'message-error': erreur }"
      >
        {{ message }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axio.js' // ton axios configuré

const artiste = ref({
  nom: '',
  biographie: '',
})

const image = ref({
  nom: '',
  type: '',
  fichier: null,
})

const message = ref('')
const erreur = ref(false)
const chargement = ref(false)

function chargerImage(event) {
  image.value.fichier = event.target.files[0]
}

async function soumettreArtiste() {
  if (!image.value.fichier) {
    message.value = 'Veuillez sélectionner un fichier image.'
    erreur.value = true
    return
  }

  chargement.value = true
  message.value = ''
  erreur.value = false

  try {
    // 1 - Création de l'artiste (sans image)
    const reponseArtiste = await api().post('/artistes', artiste.value, {
      headers: { 'Content-Type': 'application/ld+json' },
    })
    const artisteId = reponseArtiste.data.id
    const artisteIri = `/api/artistes/${artisteId}`

    // 2 - Upload de l'image liée à l'artiste
    const formData = new FormData()
    formData.append('nom', image.value.nom)
    formData.append('type', image.value.type)
    formData.append('imageFile', image.value.fichier)
    formData.append('artiste', artisteIri) // lien vers l'artiste

    await api().post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    message.value = 'Artiste créé avec succès !'
    erreur.value = false

    // Reset formulaire
    artiste.value = { nom: '', biographie: '' }
    image.value = { nom: '', type: '', fichier: null }
  } catch (e) {
    console.error('Erreur lors de la création de l’artiste :', e)
    message.value = 'Erreur lors de la création de l’artiste.'
    erreur.value = true
  } finally {
    chargement.value = false
  }
}
</script>

<style scoped>
.formulaire-artiste {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f9fafb;
}

input[type='text'],
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

.message-success {
  color: green;
  font-weight: bold;
}

.message-error {
  color: red;
  font-weight: bold;
}
</style>
