<!-- views/TousEvenements.vue -->
<template>
  <section class="bloc-evenements">
    <h2>TOUS LES ÉVÉNEMENTS</h2>
    <CarteEvenement v-for="event in evenements" :key="event.id" :evenement="event" />
    <p v-if="evenements.length === 0">Aucun événement trouvé.</p>
  </section>
  <section>
    <ImageUploadForm />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEvenementStore } from '../store/evenement'
import CarteEvenement from '../components/CarteEvenement.vue'
import ImageUploadForm from '../components/ImageUploadForm.vue'

const store = useEvenementStore()

onMounted(() => {
  store.Evenements()
})
</script>

<style scoped>
.bloc-evenements {
  padding: 2rem;
}
</style>
