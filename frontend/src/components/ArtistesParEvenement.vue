<template>
  <section class="artistes-evenement" v-if="evenement">
    <h2 class="titre-evenement">Artistes associés à l'événement : {{ evenement.titre }}</h2>

    <section class="liste-artistes" v-if="!chargement">
      <article v-for="artiste in artistesListe" :key="artiste.id" class="carte-artiste">
        <h3 class="nom-artiste">{{ artiste.nom }}</h3>
        <img
          :src="artisteStore.imagesParArtiste[artiste.id]"
          :alt="`Photo de ${artiste.nom}`"
          class="image-artiste"
        />
        <p class="bio-artiste">{{ artiste.biographie }}</p>
      </article>
    </section>

    <p v-else class="bloc-evenements__loader">Chargement des artistes...</p>

    <router-link to="/evenements" class="retour"> ← Retour aux événements </router-link>
  </section>
  <section v-else>
    <p>Chargement de l'événement...</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArtisteStore } from '@/stores/artiste'
import { useEvenementStore } from '@/stores/evenement'

const route = useRoute()
const artisteStore = useArtisteStore()
const evenementStore = useEvenementStore()

const artistesListe = ref([])
const evenement = ref(null)
const chargement = ref(true)

const id = route.params.id

onMounted(async () => {
  try {
    await evenementStore.EvenementParId(id)
    evenement.value = evenementStore.evenements[0]

    const idsArtistes = evenement.value.artistes.map((url) => {
      const segments = url.split('/')
      return parseInt(segments[segments.length - 1])
    })

    const artistes = await Promise.all(
      idsArtistes.map(async (id) => {
        await artisteStore.Artiste(id)
        return { ...artisteStore.artisteSelectionne }
      }),
    )

    artistesListe.value = artistes
    await artisteStore.chargerImagesPourTousLesArtistes(artistes)
  } catch (error) {
    console.error('Erreur lors du chargement des artistes :', error)
  } finally {
    chargement.value = false
  }
})
</script>

<style scoped>
.artistes-evenement {
  background-color: #f9fafb;
  color: #222;
  padding: 2rem 1rem;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titre-evenement {
  font-size: 2rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
  color: #007d3c; /* vert doux rappelant CarteEvenement */
  text-shadow: 0 0 8px #007d3c55;
  font-weight: 700;
}

.liste-artistes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
}

.carte-artiste {
  background-color: #ffffff;
  padding: 1.3rem 1.5rem;
  border-radius: 1.2rem;
  width: 250px;
  box-shadow: 0 6px 18px rgba(0, 125, 60, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  text-align: center;
}

.carte-artiste:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 125, 60, 0.35);
}

.nom-artiste {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #004d24;
}

.image-artiste {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
}

.bio-artiste {
  font-size: 0.9rem;
  color: #555;
}

.retour {
  margin-top: 2rem;
  color: #ff6a00;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.retour:hover,
.retour:focus {
  color: #ce5600;
}

.bloc-evenements__loader {
  font-size: 1.1rem;
  color: #007d3c;
  animation: pulse 1.5s infinite ease-in-out;
  font-weight: 700;
  margin-bottom: 1rem;
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
