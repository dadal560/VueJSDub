<template>
  <main class="page" role="main" tabindex="0">
    <figure class="banniere" role="img" aria-labelledby="banniere-desc">
      <img src="@/assets/Dubcamp.png" alt="Bannière Dubcamp" class="banniere__image" />
      <figcaption id="banniere-desc" class="banniere__legende">
        <h1 class="banniere__titre">Scoop</h1>
        <p class="banniere__sous-titre">Dub</p>
      </figcaption>
    </figure>
    <section class="contenu">
      <section
        class="contenu__bloc contenu__bloc--evenements"
        role="region"
        aria-labelledby="evenements-title"
      >
        <h2 id="evenements-title" class="contenu__titre">Événements à venir</h2>
        <EvenementProchain v-if="evenementProchain" :evenement="evenementProchain" />
        <p v-else class="contenu__texte" role="status" aria-live="polite">
          Aucun événement à venir
        </p>
      </section>
      <section
        class="contenu__bloc contenu__bloc--galerie"
        role="region"
        aria-labelledby="galerie-title"
      >
        <h2 id="galerie-title" class="contenu__titre">GALERIE PHOTOS/VIDÉOS</h2>
        <img src="@/assets/Scoop.png" alt="Enceinte" class="contenu__image" />
        <a href="#" class="lien lien--primaire" role="link" aria-label="Voir la galerie complète">
          Voir la galerie →
        </a>
      </section>
    </section>
  </main>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useEvenementStore } from '../stores/evenement'
import EvenementProchain from '../components/EvenementProchain.vue'

const store = useEvenementStore()

onMounted(async () => {
  await store.RecupererEvenements()
})

const evenementProchain = computed(() => {
  const maintenant = new Date()
  return store.evenements
    .filter((e) => new Date(e.dateEvenement) > maintenant)
    .sort((a, b) => new Date(a.dateEvenement) - new Date(b.dateEvenement))[0]
})
</script>

<style scoped>
.banniere {
  position: relative;
  width: 100%;
  height: 95vh;
}

.banniere__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banniere__legende {
  position: absolute;
  top: 2rem;
  left: 2rem;
  text-align: left;
  color: white;
}

.banniere__titre {
  font-size: 12rem;
  font-weight: bold;
  text-shadow: 15px 8px 6px rgba(0, 0, 0, 0.7);
}

.banniere__sous-titre {
  font-size: 12rem;
  font-weight: bold;
  text-shadow: 15px 8px 6px rgba(0, 0, 0, 0.7);
}

.contenu {
  background: #ff6a00;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.contenu__bloc {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contenu__titre {
  font-size: 1.8rem;
  font-weight: bold;
}

.contenu__texte {
  font-style: italic;
}

.contenu__image {
  max-width: 150px;
  margin-top: 1rem;
}

.grille-artistes {
  display: flex;
  gap: 1rem;
}

.grille-artistes__element {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grille-artistes__image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.grille-artistes__nom {
  font-weight: bold;
  text-align: center;
  margin-top: 0.5rem;
}

.lien {
  text-decoration: none;
  font-weight: bold;
}

.lien--primaire {
  color: black;
}
</style>
