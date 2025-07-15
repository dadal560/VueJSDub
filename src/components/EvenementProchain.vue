<template>
  <article class="evenement-prochain">
    <header class="evenement-header">
      <h1 class="evenement-title" id="titre-evenement-prochain">
        {{ props.evenement.titre }}
      </h1>
      <p class="evenement-date" aria-label="Date de l'événement">
        {{ formatDate(props.evenement.dateEvenement) }}
      </p>
    </header>

    <div class="evenement-image-container">
      <img
        v-if="imagePrincipale"
        :src="imagePrincipale"
        :alt="`Image de l'événement ${props.evenement.titre}`"
        class="evenement-image"
      />
    </div>

    <section class="evenement-details">
      <p v-if="lieu" class="evenement-lieu" aria-label="Lieu de l'événement">
        {{ lieu.nom }} - {{ lieu.adresse }}
      </p>
      <p class="evenement-description">
        {{ props.evenement.description }}
      </p>
    </section>

    <section v-if="artistesDetails.length" class="evenement-artistes">
      <h2 class="evenement-artistes-title" id="artistes-evenement">Artistes</h2>
      <ul class="evenement-artistes-list" role="list">
        <li
          v-for="artiste in artistesDetails"
          :key="artiste.id"
          class="evenement-artiste"
          role="listitem"
        >
          <img
            v-if="artiste.image"
            :src="artiste.image"
            :alt="`Portrait de ${artiste.nom}`"
            class="evenement-artiste-image"
          />
          <span class="evenement-artiste-name">{{ artiste.nom }}</span>
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
  evenement: { type: Object, required: true },
})

const store = useEvenementStore()
const artisteStore = useArtisteStore()

const imagePrincipale = ref(null)
const lieu = ref(null)

onMounted(() => {
  initialiserEvenement()
})

async function initialiserEvenement() {
  // Récupération des images de l'événement
  const images = await store.ImagesEvenement(props.evenement.id)
  imagePrincipale.value = images?.length ? images[0] : null

  // Récupération des informations sur les artistes associés
  if (props.evenement.artistes?.length) {
    const ids = props.evenement.artistes.map((url) => url.split('/').pop())
    await artisteStore.Artiste(ids)
    await artisteStore.chargerImagesPourTousLesArtistes(ids.map((id) => ({ id })))
  }

  // Récupération des informations sur le lieu
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
      return artiste ? { ...artiste, image: artisteStore.imagesParArtiste[id] || null } : null
    })
    .filter(Boolean)
})

function formatDate(dateISO) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateISO).toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
.evenement-prochain {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.evenement-header {
  text-align: center;
  margin-bottom: 1rem;
}

.evenement-title {
  font-size: 2.5rem;
  color: #007d3c;
  margin: 0;
}

.evenement-date {
  font-size: 1.2rem;
  color: #555;
  margin-top: 0.5rem;
}

.evenement-image-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.evenement-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.evenement-details {
  padding: 1rem;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
}

.evenement-lieu {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.evenement-description {
  font-style: italic;
}

.evenement-artistes {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
}

.evenement-artistes-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #222;
}

.evenement-artistes-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.evenement-artiste {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.evenement-artiste-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.evenement-artiste-name {
  font-size: 1rem;
  text-align: center;
  color: #333;
}
</style>
