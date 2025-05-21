<template>
  <section class="bloc-artistes">
    <h2>TOUS LES ARTISTES</h2>
    <div v-for="artiste in artistes" :key="artiste.id">
      <p>{{ artiste.nom }}</p>
    </div>
    <p v-if="artistes.length === 0">Aucun artiste trouvé.</p>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useArtisteStore } from '../stores/artiste'

const store = useArtisteStore()

onMounted(() => {
  store.Artistes()
})
</script>
