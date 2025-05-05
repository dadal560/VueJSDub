<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CarteEvenement from '@/components/CarteEvenement.vue'

const evenements = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:8000/api/evenements')
    evenements.value = data.member || [] 
  } catch (err) {
    console.error('Erreur API :', err)
    error.value = "Impossible de charger les événements. Veuillez réessayer plus tard."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h2>Liste des événements</h2>

    <p v-if="error" style="color: red;">{{ error }}</p>

    <!-- Affichage pendant le chargement -->
    <p v-else-if="loading">Chargement...</p>

    <!-- Affichage des événements -->
    <CarteEvenement
      v-for="event in evenements"
      :key="event.id"
      :evenement="event"
    />

    <!-- Aucun événement trouvé après chargement -->
    <p v-if="!loading && evenements.length === 0 && !error">Aucun événement trouvé.</p>
  </div>
</template>
