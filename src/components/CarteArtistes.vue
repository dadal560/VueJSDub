<template>
  <section class="bloc-artistes" role="region" aria-label="Liste des artistes">
    <h2 class="bloc-artistes__titre" id="titre-artistes">TOUS LES ARTISTES</h2>

    <button
      class="btn-filtre-favoris"
      @click="filtrerFavoris = !filtrerFavoris"
      :aria-pressed="filtrerFavoris"
      aria-label="Filtrer les artistes favoris"
    >
      {{ filtrerFavoris ? 'Voir tous les artistes' : 'Voir uniquement les favoris' }}
    </button>

    <p
      v-if="store.ChargementArtistes"
      class="bloc-artistes__loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      Chargement des artistes...
    </p>

    <p v-else-if="artistesFiltres.length === 0" class="bloc-artistes__vide">
      Aucun artiste trouvé.
    </p>

    <div class="bloc-artistes__container" role="list">
      <article
        v-for="artiste in artistesFiltres"
        :key="artiste.id"
        class="bloc-artistes__item"
        role="listitem"
      >
        <h3 class="bloc-artistes__nom">
          {{ artiste.nom }}
          <button
            class="favori-icone"
            @click.stop="toggleFavori(artiste.id)"
            :aria-label="
              favoris.includes(artiste.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'
            "
            :aria-pressed="favoris.includes(artiste.id)"
          >
            <svg
              v-if="favoris.includes(artiste.id)"
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
          :src="store.imagesParArtiste[artiste.id]"
          :alt="`Photo de ${artiste.nom}`"
          class="bloc-artistes__image"
        />

        <p class="bloc-artistes__bio">{{ artiste.biographie }}</p>
      </article>
    </div>
  </section>

  <section class="uploader-artiste" role="region" aria-label="Uploader un nouvel artiste">
    <UploaderArtiste />
  </section>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useArtisteStore } from '@/stores/artiste'
import UploaderArtiste from '@/components/UploaderArtiste.vue'

const store = useArtisteStore()
const favoris = ref([])
const filtrerFavoris = ref(false)

onMounted(() => {
  initialiserArtistesEtImages()

  const favorisEnMemoire = localStorage.getItem('favorisArtistes')
  if (favorisEnMemoire) {
    favoris.value = JSON.parse(favorisEnMemoire)
  }
})

watch(
  favoris,
  (nouveauxFavoris) => {
    localStorage.setItem('favorisArtistes', JSON.stringify(nouveauxFavoris))
  },
  { deep: true },
)

async function initialiserArtistesEtImages() {
  await store.RecupererArtistes()
  store.chargerImagesPourTousLesArtistes(store.artistes)
}

function toggleFavori(id) {
  if (favoris.value.includes(id)) {
    favoris.value = favoris.value.filter((favId) => favId !== id)
  } else {
    favoris.value.push(id)
  }
}

const artistesFiltres = computed(() => {
  return filtrerFavoris.value
    ? store.artistes.filter((a) => favoris.value.includes(a.id))
    : store.artistes
})
</script>

<style scoped>
.bloc-artistes {
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

.bloc-artistes__titre {
  margin-top: 1rem;
  font-size: 2rem;
  color: #007d3c; /* vert doux, rappel dub */
  margin-bottom: 1.5rem;
  text-shadow: 0 0 8px #007d3c55;
  font-weight: 700;
}

.btn-filtre-favoris {
  margin-bottom: 1.5rem;
  background-color: #ff6a00; /* jaune vif, ambiance reggae */
  color: #222;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.4);
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  width: fit-content;
}

.btn-filtre-favoris:hover,
.btn-filtre-favoris:focus {
  background-color: #ff6a00;
  outline: none;
  box-shadow: 0 4px 12px rgba(230, 194, 0, 0.6);
}

.bloc-artistes__loader {
  font-size: 1.1rem;
  color: #007d3c;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 700;
  margin-bottom: 1rem;
}

.bloc-artistes__vide {
  font-style: italic;
  color: #777;
  margin-top: 1rem;
}

.bloc-artistes__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 1000px;
  width: 100%;
}

.bloc-artistes__item {
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

.bloc-artistes__item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 125, 60, 0.35);
}

.bloc-artistes__nom {
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

.bloc-artistes__image {
  max-width: 220px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.9rem;
  box-shadow: 0 4px 10px rgba(0, 125, 60, 0.1);
  object-fit: cover;
}

.bloc-artistes__bio {
  font-size: 1rem;
  color: #555;
  line-height: 1.3;
  max-height: 7.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.uploader-artiste {
  background-color: #f9fafb; /* même fond clair que CarteEvenement */
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
