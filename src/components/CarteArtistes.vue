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
      <article v-for="artiste in store.artistes" :key="artiste.id" class="bloc-artistes__item">
        <h3>{{ artiste.nom }}</h3>
        <img :src="image" :alt="`Photo de ${artiste.nom}`" class="bloc-artistes__image" />
        <p class="bloc-artistes__bio">{{ artiste.biographie }}</p>
      </article>
    </template>
  </section>
</template>


<script setup>
import { watch,ref,onMounted} from 'vue'
import { useArtisteStore } from '@/stores/artiste'

const store = useArtisteStore()
const image = ref(null)

onMounted(() => {
  store.Artistes()
})

function chargerImage(artisteId) {
  if (!artisteId) {
    image.value = null
    return
  }
  store.ImagesArtiste(artisteId)
    .then((images) => {
      image.value = images.length > 0 ? images[0] : null
    })
    .catch((error) => {
      console.error('Erreur lors du chargement de l\'image:', error)
      image.value = null
    })
}

watch(() => store.artistes, (nouveauxArtistes) => {
  if (nouveauxArtistes && nouveauxArtistes.length > 0) {
    chargerImage(nouveauxArtistes[0].id)
  } else {
    image.value = null
  }
})
</script>

<style scoped>
.bloc-artistes {
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.bloc-artistes__titre {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #222;
}

/* Loader animé avec une pulsation douce */
.bloc-artistes__loader {
  font-size: 1.1rem;
  color: #007acc;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 600;
}

/* Message vide */
.bloc-artistes__vide {
  font-style: italic;
  color: #666;
}

/* Style pour chaque artiste */
.bloc-artistes__item {
  margin: 0.3rem 0;
  padding-left: 0.5rem;
  font-weight: 500;
}
.bloc-artistes__image {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

/* Animation pulse simple */
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


