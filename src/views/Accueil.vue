<template>
  <figure class="banniere">
    <img src="@/assets/Dubcamp.png" alt="dubCamp" class="banniere__image" />
  <figcaption class="banniere__legende">
    <h1 class="banniere__titre">Scoop</h1>
    <p class="banniere__sous-titre">Dub</p>
  </figcaption>
  </figure>

  <section class="contenu">
    <section class="contenu__bloc contenu__bloc--evenements">
      <h2 class="contenu__titre">ÉVÉNEMENTS À VENIR</h2>
      <CarteEvenement v-if="evenementProchain" :evenement="evenementProchain" />
      <p v-else class="contenu__texte">Aucun événement à venir</p>
      <a href="#" class="lien lien--primaire">Voir tous les événements →</a>
    </section>

    <section class="contenu__bloc contenu__bloc--artistes">
      <h2 class="contenu__titre">ARTISTES</h2>
      <article class="grille-artistes">
        <figure class="grille-artistes__element">
          <img src="#" alt="O.B.F" class="grille-artistes__image" />
          <figcaption class="grille-artistes__nom">O.B.F</figcaption>
        </figure>
        <figure class="grille-artistes__element">
          <img src="#" alt="Dubquake" class="grille-artistes__image" />
          <figcaption class="grille-artistes__nom">Dubquake Sound System</figcaption>
        </figure>
      </article>
      <a href="#" class="lien lien--primaire">Voir tous les artistes →</a>
    </section>

    <section class="contenu__bloc contenu__bloc--galerie">
      <h2 class="contenu__titre">GALERIE PHOTOS/VIDÉOS</h2>
      <img src="../assets/Scoop.png" alt="Enceinte" class="contenu__image" />
      <a href="#" class="lien lien--primaire">Voir la galerie →</a>
    </section>
  </section>
</template>


<script setup>
import { onMounted } from 'vue'
import { useEvenementStore } from '../store/evenement'
import { storeToRefs } from 'pinia'
import CarteEvenement from '../components/CarteEvenement.vue'

const store = useEvenementStore()
const { evenementProchain  } = storeToRefs(store)

onMounted(() => {
  store.chargerEvenementProchain()
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
  gap: 2rem;
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
