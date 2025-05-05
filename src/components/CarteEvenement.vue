<template>
    <div class="carte">
      <h3>{{ evenement.titre }}</h3>
      <p>{{ evenement.description }}</p>
      <p><strong>Lieu :</strong> {{ evenement.lieu }}</p>
      <p>{{ formatDate(evenement.dateEvenement) }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    evenement: Object
  })
  
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }
  </script>
  
  <style scoped>
  .carte {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  </style>
  