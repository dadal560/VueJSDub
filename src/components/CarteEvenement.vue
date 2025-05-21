<template>
  <article class="carte-evenement">
    <div class="images">
      <img v-for="(img, index) in images" :key="index" :src="img" alt="Affiche événement" />
    </div>
    <aside>
      <h3>{{ evenement.titre }}</h3>
      <p>{{ evenement.description }}</p>
      <time>{{ formaterDate(evenement.dateEvenement) }}</time>
    </aside>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Définir les props pour recevoir les données de l'événement
const props = defineProps({ evenement: Object })

// Liste des images associées à l'événement
const images = ref([])

// Charger les images associées à l'événement lors du montage du composant
onMounted(() => {
  axios
    .get(`http://127.0.0.1:8000/api/images?evenement=${props.evenement['@id']}`)
    .then((res) => {
      console.log('Images reçues :', res.data)
      images.value = res.data.member.map((img) => `http://127.0.0.1:8000/images/dub/${img.fichier}`)
    })
    .catch((err) => {
      console.error('Erreur API :', err)
    })
})

// Fonction pour formater la date de l'événement
function formaterDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.images {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.images img {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.carte-evenement {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.carte-evenement aside {
  flex: 1;
}
.carte-evenement h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #333;
}
.carte-evenement p {
  margin: 0 0 1rem;
  color: #666;
}
.carte-evenement time {
  font-size: 0.9rem;
  color: #999;
}
</style>
