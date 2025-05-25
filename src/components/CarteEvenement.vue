<template>
  <section class="bloc-evenements">
    <h2 class="bloc-evenements__titre">TOUS LES ÉVÈNEMENTS</h2>

    <p v-if="store.ChargementEvenements" class="bloc-evenements__loader" aria-live="polite" aria-busy="true">
      Chargement des événements...
    </p>

    <p v-else-if="store.evenements.length === 0" class="bloc-evenements__vide">
      Aucun événement trouvé.
    </p>

    <template v-else>
      <article
        v-for="evenement in store.evenements"
        :key="evenement['@id']"
        class="bloc-evenements__item"
      >
        <h3>{{ evenement.titre }}</h3>
        <img
          v-if="eventImages[evenement['@id']]"
          :src="eventImages[evenement['@id']]"
          :alt="`Affiche de l'événement : ${evenement.titre}`"
          class="bloc-evenements__image"
        />
        <p class="bloc-evenements__description">{{ evenement.description }}</p>
        <time class="bloc-evenements__date">{{ formaterDate(evenement.dateEvenement) }}</time>
      </article>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useEvenementStore } from '@/stores/evenement'

const store = useEvenementStore()
const eventImages = ref({})

function chargerImage(evenementId) {
  if (!evenementId) return
  store.ImagesEvenement(evenementId)
    .then((images) => {
      eventImages.value[evenementId] = images.length > 0 ? images[0] : null
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de l'image:", error)
      eventImages.value[evenementId] = null
    })
}

function formaterDate(dateEvenement) {
  const date = new Date(dateEvenement)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  store.Evenements && store.Evenements()
})

watch(
  () => store.evenements,
  (nouveauxEvenements) => {
    if (nouveauxEvenements && nouveauxEvenements.length > 0) {
      nouveauxEvenements.forEach((evenement) => {
        if (evenement['@id']) {
          chargerImage(evenement['@id'])
        }
      })
    } else {
      eventImages.value = {}
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.bloc-evenements {
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.bloc-evenements__titre {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #222;
}

.bloc-evenements__loader {
  font-size: 1.1rem;
  color: #007acc;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 600;
}

.bloc-evenements__vide {
  font-style: italic;
  color: #666;
}

.bloc-evenements__item {
  margin: 0.3rem 0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.bloc-evenements__image {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.bloc-evenements__description {
  margin: 0.5rem 0;
  color: #666;
}

.bloc-evenements__date {
  font-size: 0.9rem;
  color: #999;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 5px #007acc66;
  }
  50% {
    opacity: 0.6;
    text-shadow: 0 0 15px #007acccc;
  }
}
</style>
