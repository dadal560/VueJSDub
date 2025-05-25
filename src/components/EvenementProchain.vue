<template>
  <h2 class="contenu__titre">ÉVÉNEMENTS</h2>
  <article class="evenement" v-if="evenement">
    <h3 class="evenement__titre">{{ evenement.titre }}</h3>

    <img
      v-if="imagePrincipale"
      :src="imagePrincipale"
      :alt="`Image de l'événement ${evenement.titre}`"
      class="evenement__image"
    />

    <p class="evenement__description">{{ evenement.description }}</p>
    <p class="evenement__date">📅 {{ formatDate(evenement.dateEvenement) }}</p>

    <section v-if="evenement.artistes?.length" class="evenement__artistes">
      <h4 class="evenement__sous-titre">Artistes :</h4>
      <ul class="evenement__liste-artistes">
        <li
          v-for="artiste in evenement.artistes"
          :key="artiste.id"
          class="evenement__artiste"
        >
          {{ artiste.nom }}
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEvenementStore } from '../stores/evenement'

const props = defineProps({
  evenement: {
    type: Object,
    required: true,
  },
})

const store = useEvenementStore()
const imagePrincipale = ref(null)

// Formatage de date
function formatDate(dateISO) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateISO).toLocaleDateString('fr-FR', options)
}

// Charger l'image principale dès que l'événement change
async function chargerImage() {
  if (!props.evenement || !props.evenement.id) {
    imagePrincipale.value = null
    return
  }
  const images = await store.ImagesEvenement(props.evenement.id)
  imagePrincipale.value = images.length > 0 ? images[0] : null
}

watch(() => props.evenement, chargerImage, { immediate: true })
</script>

<style scoped>
.evenement {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
}

.evenement__titre {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
}

.evenement__image {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.evenement__description {
  font-style: italic;
  margin-bottom: 0.5rem;
}

.evenement__date {
  font-weight: bold;
  color: #222;
  margin-bottom: 1rem;
}

.evenement__sous-titre {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.evenement__liste-artistes {
  list-style: none;
  padding: 0;
  margin: 0;
}

.evenement__artiste {
  background: #ffd700;
  color: black;
  padding: 0.4rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
}
</style>
