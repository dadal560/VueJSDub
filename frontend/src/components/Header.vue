<template>
  <header class="entete" role="banner">
    <img src="@/assets/Scoop.png" alt="Logo Scoop Dub" class="logo" />
    <nav class="navigation" role="navigation" aria-label="Menu principal">
      <RouterLink to="/" aria-label="Accueil">Accueil</RouterLink>
      <RouterLink to="/evenements" aria-label="Voir les événements">Événements</RouterLink>
      <RouterLink to="/artistes" aria-label="Voir les artistes">Artistes</RouterLink>
    </nav>
  </header>
</template>

<style scoped></style>
