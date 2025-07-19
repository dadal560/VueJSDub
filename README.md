# Scoop Dub — Plateforme Web Dub

[![PHP Version](https://img.shields.io/badge/php-8.2+-blue.svg)](https://php.net)
[![Symfony Version](https://img.shields.io/badge/symfony-6.x-green.svg)](https://symfony.com)
[![Vue.js Version](https://img.shields.io/badge/vue.js-3.x-brightgreen.svg)](https://vuejs.org)
[![Node.js Version](https://img.shields.io/badge/node.js-18+-yellow.svg)](https://nodejs.org)

Scoop Dub est une application web moderne dédiée à l'univers du Dub. Elle permet aux utilisateurs de consulter les événements musicaux, découvrir les artistes et leurs styles, ainsi que d'obtenir des informations détaillées sur les lieux culturels. Le projet s'appuie sur une architecture découplée avec Symfony pour l'API backend et Vue.js pour l'interface utilisateur.

## Fonctionnalités

### Backend — Symfony (API)

- **API RESTful** générée avec API Platform
- **Gestion avancée des fichiers** avec VichUploaderBundle pour l'upload d'images
- **Architecture robuste** avec les entités principales :
  - **Evenement** : titre, description, date, heure, image principale, lieu associé
  - **Artiste** : nom, description, style musical, participations aux événements
  - **Image** : nom, fichier (chemin), type (affiche/profil), rattachée aux événements
  - **Lieu** : nom, adresse, ville, événements hébergés
- **Relations complexes** entre entités définies avec Doctrine ORM
- **Upload sécurisé d'images** avec validation des types et tailles de fichiers
- **Localisation française** avec affichage des dates au format français
- **Validation des données** avec les contraintes Symfony
- **Sérialisation avancée** pour l'API avec des groupes de normalisation

### Frontend — Vue.js (Interface Utilisateur)

- **Interface moderne et responsive** adaptée à tous les appareils
- **Intégration seamless** avec l'API Symfony backend
- **Navigation fluide** avec Vue Router
- **Gestion d'état centralisée** avec Pinia
- **Requêtes HTTP optimisées** avec Axios
- **Composants réutilisables** pour une maintenance facilitée
- **recherche** d'événements et d'artistes
- **Galerie d'images** interactive pour les événements

### Éco-Conception

- **Audit RGAA** : Conformité totale aux règles d'accessibilité web (WCAG 2.1)
- **Audit RGESN** : Respect des bonnes pratiques de sobriété numérique pour minimiser l'empreinte écologique
- **Code minifié** en production pour réduire la bande passante

## Architecture

```
scoop-dub-platform/
├── service/                    # API Symfony
│   ├── config/                # Configuration Symfony
│   ├── src/
│   │   ├── Controller/        # Contrôleurs API
│   │   ├── Entity/           # Entités Doctrine
│   │   ├── Repository/       # Repositories personnalisés
│   │   └── Service/          # Services métier
│   ├── migrations/           # Migrations de base de données
│   ├── public/              # Point d'entrée web
│   └── var/                 # Cache et logs
├── frontend/                  # Application Vue.js
│   ├── src/
│   │   ├── components/       # Composants Vue
│   │   ├── views/           # Pages/Vues
│   │   ├── router/          # Configuration des routes
│   │   ├── stores/          # Stores Pinia
│   │   └── services/        # Services HTTP
│   ├── public/              # Assets statiques
│   └── dist/                # Build de production
├── docker/                   # Configuration Docker
├── docs/                    # Documentation
└── tests/                   # Tests automatisés
```

## Prérequis

### Backend
- **PHP** ≥ 8.2 avec extensions : `curl`, `json`, `mbstring`, `mysql`, `xml`, `zip`, `gd`, `fileinfo`
- **Composer** ≥ 2.0
- **Symfony CLI** (optionnel mais recommandé)
- **Base de données** : MySQL ≥ 8.0 ou MariaDB ≥ 10.5
- **API Platform** ≥ 3.0
- **VichUploaderBundle** pour la gestion des fichiers

### Frontend
- **Node.js** ≥ 18.0
- **npm** ≥ 9.0 ou **yarn** ≥ 1.22

### Développement
- **Git** pour le versioning
- **Docker** (optionnel, pour l'environnement de développement)

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/dadal560/scoop-dub-symfony-vue.git
cd scoop-dub-symfony-vue
```

### 2. Installation du Backend (Symfony)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier de configuration d'environnement
cp .env .env.local

# Générer la clé de chiffrement de l'application
php bin/console secrets:generate-keys

# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Charger les données de démonstration (optionnel)
php bin/console doctrine:fixtures:load
```

### 3. Installation du Frontend (Vue.js)

```bash
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances Node.js
npm install
# ou avec yarn
yarn install
```

## Configuration

### Configuration Backend (.env.local)

```env
# Base de données
DATABASE_URL="mysql://username:password@127.0.0.1:3306/scoop_dub_db"

```

## Utilisation

### Démarrage en mode développement

#### Backend Symfony

```bash
cd backend

# Avec Symfony CLI (recommandé)
symfony server:start

# Ou avec PHP built-in server
php -S 127.0.0.1:8000 -t public
```

L'API sera accessible sur `http://127.0.0.1:8000`

#### Frontend Vue.js

```bash
cd frontend

# Mode développement avec hot-reload
npm run dev
# ou avec yarn
yarn dev
```

L'application sera accessible sur `http://localhost:3000`

### Commandes utiles

#### Backend

```bash
# Vider le cache
php bin/console cache:clear

# Créer une nouvelle migration
php bin/console make:migration

# Valider le schéma de base de données
php bin/console doctrine:schema:validate

# Mettre à jour le schéma
php bin/console doctrine:schema:update --force

# Nettoyer les fichiers orphelins de VichUploader
php bin/console vich:clean

# Valider la configuration de VichUploader
php bin/console debug:config vich_uploader
```

#### Frontend

```bash
# Build de production
npm run build

# Aperçu du build de production
npm run preview
```

## API Documentation

L'API est automatiquement documentée grâce à API Platform. Une fois le serveur backend démarré, accédez à :

### Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/evenements` | Liste tous les événements |
| GET | `/api/evenements/{id}` | Détails d'un événement |
| GET | `/api/artistes` | Liste tous les artistes |
| GET | `/api/artistes/{id}` | Détails d'un artiste |
| GET | `/api/lieux` | Liste tous les lieux |
| GET | `/api/images` | Liste toutes les images |
| POST | `/api/images` | Upload d'une nouvelle image |

## Éco-conception

### Bonnes pratiques implémentées

#### Accessibilité (RGAA)
- **Conformité WCAG 2.1 niveau AA**
- Navigation au clavier optimisée
- Contrastes de couleurs respectés
- Textes alternatifs pour toutes les images
- Structure sémantique HTML5

### Audit de performance

```bash
# Analyser les performances frontend
npm run analyze
```

## Support

### Canaux de support

- **Email** : [gwen.henry56@gmail.com](mailto:gwen.henry56@gmail.com)
- **Issues GitHub** : [GitHub Issues](https://github.com/dadal560/scoop-dub-symfony-vue/issues)
- **Discussions** : [GitHub Discussions](https://github.com/dadal560/scoop-dub-symfony-vue/discussions)

### Problèmes courants

#### Backend
- **Erreur de permissions** : Vérifiez les droits sur les dossiers `var/` et `public/uploads/`
- **Connexion base de données** : Vérifiez les paramètres dans `.env.local`

#### Frontend
- **CORS errors** : Vérifiez la configuration CORS dans Symfony
- **API unreachable** : Vérifiez que l'URL de l'API est correcte dans `.env`

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !


<div align="center">

**Développé avec passion pour la communauté Dub**

[Retour en haut](#scoop-dub--plateforme-web-dub)

</div>
