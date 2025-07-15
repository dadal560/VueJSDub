# Scoop Dub — Plateforme Web Dub

Scoop Dub est une application web dédiée au Dub. Elle permet de consulter les événements ainsi que de découvrir les artistes, leurs styles musicaux et d’obtenir des informations sur les lieux.  
Le projet repose sur une architecture Symfony (API) pour le backend et Vue.js pour le frontend.

---

## Fonctionnalités

### Backend — Symfony (API)

- API RESTful générée avec API Platform.
- Entités principales :
  - `Evenement` : titre, description, date, heure, image principale, lieu.
  - `Artiste` : nom, description, style, lié à plusieurs événements.
  - `Image` : nom, fichier (chemin), type (`affiche`, `profil`), lié à un événement.
  - `Lieu` : nom, adresse, ville, événements associés.
- Relations entre entités définies avec Doctrine.
- Gestion des fichiers (upload d’images pour affiches et profils).
- Affichage des dates au format français.

### Frontend — Vue.js (Interface Utilisateur)

- Affichage dynamique des événements et artistes.
- Intégration avec l'API Symfony.
- Utilisation de :
  - Vue Router pour la navigation
  - Pinia pour la gestion d'état
  - Axios pour les requêtes HTTP

---

## Éco-Conception

- Audit RGAA : conformité avec les règles d’accessibilité web.
- Audit RGESN : respect des bonnes pratiques de sobriété numérique pour limiter l’empreinte écologique.

---

## Installation du Projet

### Prérequis

- PHP ≥ 8.2  
- Composer  
- Symfony CLI  
- MySQL / MariaDB  
- Node.js ≥ 18  
- npm ou yarn

---

### Backend — Symfony

Cloner le projet :

```bash
git clone https://github.com/dadal560/scoop-dub-symfony-vue.git
cd scoop-dub-symfony-vue/service
