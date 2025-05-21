<template>
  <article class="carte-evenement">
    <div class="images">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        alt="Affiche événement"
      />
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


const props = defineProps({ evenement: Object })
const images = ref([])


onMounted(() => {
  axios.get(`http://127.0.0.1:8000/api/images?evenement=${props.evenement['@id']}`)
    .then((res) => {
      console.log('Images reçues :', res.data)
      images.value = res.data.member.map(img =>
        `http://127.0.0.1:8000/images/dub/${img.fichier}`
      )
    })
    .catch((err) => {
      console.error('Erreur API :', err)
    })
})

function formaterDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
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
}
.carte-evenement {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
