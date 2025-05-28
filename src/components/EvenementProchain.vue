<template>
  <h2 class="contenu__titre">ÉVÉNEMENTS</h2>

  <article class="evenement" v-if="props.evenement">
    <h3 class="evenement__titre">{{ props.evenement.titre }}</h3>

    <!-- Image principale -->
    <img
      v-if="imagePrincipale"
      :src="imagePrincipale"
      :alt="`Image de l'événement ${props.evenement.titre}`"
      class="evenement__image"
    />

    <p class="evenement__description">{{ props.evenement.description }}</p>
    <p class="evenement__date">{{ formatDate(props.evenement.dateEvenement) }}</p>

    <p class="evenement__lieu" v-if="lieu">📍 Lieu : {{ lieu.nom }} - {{ lieu.adresse }}</p>

    <!-- Artistes -->
    <section v-if="artistesDetails.length" class="evenement__artistes">
      <h4 class="evenement__sous-titre">Artistes :</h4>
      <ul class="evenement__liste-artistes">
        <li v-for="artiste in artistesDetails" :key="artiste.id" class="evenement__artiste">
          <img
            v-if="artiste.image"
            :src="artiste.image"
            :alt="`Image de ${artiste.nom}`"
            class="evenement__artiste-image"
          />
          <span>{{ artiste.nom }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useEvenementStore } from '@/stores/evenement'
import { useArtisteStore } from '@/stores/artiste'

const props = defineProps({
  evenement: {
    type: Object,
    required: true,
  },
})

const store = useEvenementStore()
const artisteStore = useArtisteStore()

const imagePrincipale = ref(null)
const lieu = ref(null)

onMounted(() => {
  initialiserEvenement()
})

async function initialiserEvenement() {
  // Image principale
  const images = await store.ImagesEvenement(props.evenement.id)
  imagePrincipale.value = images.length > 0 ? images[0] : null

  // Artistes
  if (props.evenement.artistes?.length) {
    const ids = props.evenement.artistes.map((url) => url.split('/').pop())
    await artisteStore.Artiste(ids)
    await artisteStore.chargerImagesPourTousLesArtistes(ids.map((id) => ({ id })))
  }

  // Lieu
  if (props.evenement.lieu) {
    lieu.value = await store.RecupererLieu(props.evenement.lieu)
  }
}

const artistesDetails = computed(() => {
  if (!props.evenement.artistes) return []

  return props.evenement.artistes
    .map((url) => {
      const id = url.split('/').pop()
      const artiste = artisteStore.artistes.find((a) => a.id == id)
      return artiste
        ? {
            ...artiste,
            image: artisteStore.imagesParArtiste[id] || null,
          }
        : null
    })
    .filter(Boolean)
})

function formatDate(dateISO) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateISO).toLocaleDateString('fr-FR', options)
}
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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.evenement__artiste {
  background: #ffd700;
  color: black;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.evenement__artiste-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}
</style>
