<template>
  <section class="bloc-evenements" role="region" aria-label="Liste des événements">
    <h2 class="bloc-evenements__titre" id="titre-evenements">TOUS LES ÉVÈNEMENTS</h2>
    <button
      class="btn-filtre-favoris"
      @click="filtrerFavoris = !filtrerFavoris"
      :aria-pressed="filtrerFavoris"
      aria-label="Filtrer les événements favoris"
    >
      {{ filtrerFavoris ? 'Voir tous les événements' : 'Voir uniquement les favoris' }}
    </button>
    <p
      v-if="store.ChargementEvenements"
      class="bloc-evenements__loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      Chargement des événements...
    </p>
    <p v-else-if="evenementsFiltres.length === 0" class="bloc-evenements__vide">
      Aucun événement trouvé.
    </p>
    <div class="bloc-evenements__container" role="list">
      <article
        v-for="evenement in evenementsFiltres"
        :key="evenement['@id']"
        class="bloc-evenements__item"
        role="listitem"
      >
        <h3 class="bloc-evenements__nom">
          {{ evenement.titre }}
          <button
            class="favori-icone"
            @click.stop="toggleFavori(evenement.id)"
            :aria-label="
              favoris.includes(evenement.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'
            "
            :aria-pressed="favoris.includes(evenement.id)"
          >
            <svg
              v-if="favoris.includes(evenement.id)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#e63946"
              width="18"
              height="18"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
                   4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81
                   14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4
                   6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e63946"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="18"
              height="18"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
                   4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81
                   14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4
                   6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>
        </h3>

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
          :to="{ name: 'ArtistesEvenement', params: { id: evenement.id } }"
          class="bloc-evenements__lien-artistes"
          role="link"
          aria-label="Voir les artistes associés"
        >
          Voir les artistes associés
        </router-link>
      </article>
    </div>
  </section>

  <section class="uploader-evenement">
    <UploaderEvenement />
  </section>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useEvenementStore } from '@/stores/evenement'
import UploaderEvenement from './UploaderEvenement.vue'

const store = useEvenementStore()
const favoris = ref([])
const filtrerFavoris = ref(false)

onMounted(() => {
  initialiserEvenementEtImages()

  const favorisEnMemoire = localStorage.getItem('favorisEvenements')
  if (favorisEnMemoire) {
    favoris.value = JSON.parse(favorisEnMemoire)
  }
})

watch(
  favoris,
  (nouveauxFavoris) => {
    localStorage.setItem('favorisEvenements', JSON.stringify(nouveauxFavoris))
  },
  { deep: true },
)

async function initialiserEvenementEtImages() {
  await store.RecupererEvenements()
  store.chargerImagesPourTousLesEvenements(store.evenements)

  if (store.evenements?.length > 0) {
    await Promise.all(
      store.evenements.filter((e) => e.lieu).map((e) => store.RecupererLieu(e.lieu)),
    )
  }
}

function toggleFavori(id) {
  if (favoris.value.includes(id)) {
    favoris.value = favoris.value.filter((favId) => favId !== id)
  } else {
    favoris.value.push(id)
  }
}

const evenementsFiltres = computed(() => {
  if (filtrerFavoris.value) {
    return store.evenements.filter((e) => favoris.value.includes(e.id))
  }
  return store.evenements
})

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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #f9fafb;
  color: #222;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  text-align: center;
}

.bloc-evenements__titre {
  margin-top: 1rem;
  font-size: 2rem;
  color: #007d3c;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 8px #007d3c55;
  font-weight: 700;
}

.btn-filtre-favoris {
  margin-bottom: 1.5rem;
  background-color: #ff6a00;
  color: #222;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.4);
  transition: background-color 0.3s ease;
  width: fit-content;
}

.btn-filtre-favoris:hover,
.btn-filtre-favoris:focus {
  background-color: #ff6a00;
  outline: none;
  box-shadow: 0 4px 12px rgba(230, 194, 0, 0.6);
}

.bloc-evenements__loader {
  font-size: 1.1rem;
  color: #007d3c;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 700;
  margin-bottom: 1rem;
}

.bloc-evenements__vide {
  font-style: italic;
  color: #777;
  margin-top: 1rem;
}

.bloc-evenements__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 1000px;
  width: 100%;
}

.bloc-evenements__item {
  background-color: #ffffff;
  padding: 1.3rem 1.5rem;
  border-radius: 1.2rem;
  box-shadow: 0 6px 18px rgba(0, 125, 60, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 360px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.bloc-evenements__item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 125, 60, 0.35);
}

.bloc-evenements__nom {
  font-size: 1.4rem;
  font-weight: 700;
  color: #004d24;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.favori-icone {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  user-select: none;
}

.favori-icone:hover,
.favori-icone:focus {
  transform: scale(1.3);
  outline: none;
}

.bloc-evenements__image {
  max-width: 220px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 125, 60, 0.1);
  margin-bottom: 1rem;
}

.bloc-evenements__description {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.4;
  margin-bottom: 0.6rem;
}

.bloc-evenements__date {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
  color: #007d3c;
}

.bloc-evenements p {
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  color: #333;
}

.bloc-evenements__lien-artistes {
  margin-top: auto;
  background-color: #007d3c;
  color: #fff;
  padding: 0.45rem 1.1rem;
  border-radius: 0.6rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

.bloc-evenements__lien-artistes:hover,
.bloc-evenements__lien-artistes:focus {
  background-color: #005921;
  outline: none;
}

.uploader-evenement {
  background-color: #f9fafb;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    text-shadow: 0 0 6px #007d3c88;
  }
  50% {
    opacity: 0.6;
    text-shadow: 0 0 18px #007d3cbb;
  }
}
</style>
