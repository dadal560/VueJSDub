<template>
  <section class="bloc-evenements">
    <h2 class="bloc-evenements__titre">TOUS LES ÉVÈNEMENTS</h2>

    <p
      v-if="store.ChargementEvenements"
      class="bloc-evenements__loader"
      aria-live="polite"
      aria-busy="true"
    >
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
        <h3 class="bloc-evenements__nom">{{ evenement.titre }}</h3>

        <img
          :src="store.imagesParEvenement[evenement.id]"
          :alt="`Affiche de l'événement : ${evenement.titre}`"
          class="bloc-evenements__image"
        />

        <p class="bloc-evenements__description">{{ evenement.description }}</p>

        <time class="bloc-evenements__date">
          {{ formaterDate(evenement.dateEvenement) }}
        </time>

        <p>
          Lieu :
          <span v-if="evenement.lieu && store.lieuxParEvenement[extraireId(evenement.lieu)]">
            {{ store.lieuxParEvenement[extraireId(evenement.lieu)].nom }} -
            {{ store.lieuxParEvenement[extraireId(evenement.lieu)].adresse }}
          </span>
          <span v-else>Non défini</span>
        </p>
        <router-link
          :to="`/evenement/${evenement.id}/artistes`"
          class="bloc-evenements__lien-artistes"
        >
          Voir les artistes associés
        </router-link>
      </article>
    </template>
  </section>

  <section>
    <UploaderEvenement />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEvenementStore } from '@/stores/evenement'
import UploaderEvenement from './UploaderEvenement.vue'

const store = useEvenementStore()

onMounted(() => {
  initialiserEvenementEtImages()
})

async function initialiserEvenementEtImages() {
  await store.RecupererEvenements()
  store.chargerImagesPourTousLesEvenements(store.evenements)

  if (store.evenements?.length > 0) {
    await Promise.all(
      store.evenements.filter((e) => e.lieu).map((e) => store.RecupererLieu(e.lieu)),
    )
  }
}

function formaterDate(dateEvenement) {
  const date = new Date(dateEvenement)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function extraireId(iri) {
  return iri.split('/').pop()
}
</script>

<style scoped>
.bloc-evenements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background-color: #fefefe;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.bloc-evenements__titre {
  grid-column: 1 / -1;
  font-size: 2rem;
  color: #000000;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #007acc55;
}

.bloc-evenements__loader {
  grid-column: 1 / -1;
  font-size: 1.1rem;
  color: #007acc;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 600;
  text-align: center;
}

.bloc-evenements__vide {
  grid-column: 1 / -1;
  font-style: italic;
  color: #888;
  text-align: center;
}

.bloc-evenements__item {
  background-color: #fff;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.bloc-evenements__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 122, 204, 0.3);
}

.bloc-evenements__nom {
  font-size: 1.7rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 0.5rem;
}

.bloc-evenements__image {
  max-width: 300px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.bloc-evenements__description {
  font-size: 1rem;
  color: #555;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.bloc-evenements__date {
  font-size: 1rem;
  font-weight: bold;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    text-shadow: 0 0 5px #007acc66;
  }
  50% {
    opacity: 0.6;
    text-shadow: 0 0 15px #007accaa;
  }
}
</style>
