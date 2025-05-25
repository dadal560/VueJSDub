<template>
  <section class="bloc-artistes">
    <h2 class="bloc-artistes__titre">TOUS LES ARTISTES</h2>

    <p v-if="store.ChargementArtistes" class="bloc-artistes__loader" aria-live="polite" aria-busy="true">
      Chargement des artistes...
    </p>

    <p v-else-if="store.artistes.length === 0" class="bloc-artistes__vide">
      Aucun artiste trouvé.
    </p>

    <template v-else>
      <article
        v-for="artiste in store.artistes"
        :key="artiste.id"
        class="bloc-artistes__item"
      >
        <h3 class="bloc-artistes__nom">{{ artiste.nom }}</h3>
        <img
          :src="store.imagesParArtiste[artiste.id]"
          :alt="`Photo de ${artiste.nom}`"
          class="bloc-artistes__image"
        />
        <p class="bloc-artistes__bio">{{ artiste.biographie }}</p>
      </article>
    </template>
  </section>
</template>

<script setup>
import {onMounted } from 'vue'
import { useArtisteStore } from '@/stores/artiste'

const store = useArtisteStore()

onMounted(() => {
  initialiserArtistesEtImages()
})


async function initialiserArtistesEtImages() {
  await store.Artistes()
  store.chargerImagesPourTousLesArtistes(store.artistes)
}
</script>

<style scoped>
.bloc-artistes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background-color: #111;
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.bloc-artistes__titre {
  grid-column: 1 / -1;
  font-size: 2rem;
  color: #ffd700;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #ffd70055;
}

.bloc-artistes__loader {
  grid-column: 1 / -1;
  font-size: 1.1rem;
  color: #00ffff;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 600;
  text-align: center;
}

.bloc-artistes__vide {
  grid-column: 1 / -1;
  font-style: italic;
  color: #888;
  text-align: center;
}

.bloc-artistes__item {
  background-color: #1c1c1e;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.bloc-artistes__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

.bloc-artistes__nom {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
}

.bloc-artistes__image {
  max-width: 200px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
}

.bloc-artistes__bio {
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.4;
}

/* Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 5px #00ffff66;
  }
  50% {
    opacity: 0.6;
    text-shadow: 0 0 15px #00ffffaa;
  }
}
</style>
