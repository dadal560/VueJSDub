<template>
  <form @submit.prevent="submitForm" enctype="multipart/form-data">
    <label for="nom">Nom :</label>
    <input v-model="form.nom" type="text" id="nom" required />

    <label for="type">Type :</label>
    <input v-model="form.type" type="text" id="type" />

    <label for="imageFile">Fichier image :</label>
    <input type="file" @change="handleFileUpload" id="imageFile" required />

    <label for="evenement">ID Événement :</label>
    <input v-model="form.evenementId" type="number" id="evenement" />

    <label for="artiste">ID Artiste :</label>
    <input v-model="form.artisteId" type="number" id="artiste" />

    <button type="submit">Envoyer</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  nom: '',
  type: '',
  evenementId: '',
  artisteId: '',
  imageFile: null
})

const handleFileUpload = (event) => {
  form.value.imageFile = event.target.files[0]
}

const submitForm = async () => {
  const formData = new FormData()
  formData.append('nom', form.value.nom)
  formData.append('type', form.value.type)

  if (form.value.imageFile) {
    formData.append('imageFile', form.value.imageFile)
  }

  if (form.value.evenementId) {
    formData.append('evenement', `/api/evenements/${form.value.evenementId}`)
  }
  if (form.value.artisteId) {
    formData.append('artiste', `/api/artistes/${form.value.artisteId}`)
  }

  try {
    const response = await axios.post('http://localhost:8000/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert('Image envoyée !')
    console.log(response.data)
  } catch (error) {
    alert('Échec de l’envoi')
    console.error(error.response?.data || error)
  }
}
</script>
