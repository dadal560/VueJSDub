# Dub — Application Web de la Scène Musicale Dub  

Dub est une application web dédiée à la scène musicale Dub. Elle permet de consulter les événements, de découvrir les artistes, leurs styles musicaux, et d’obtenir des informations sur les lieux.

---

## Fonctionnalités  

### Backend — Symfony  
- API RESTful générée avec **API Platform**.
- Entités principales :
  - `Evenement` : titre, description, date, heure, image principale, lieu.
  - `Artiste` : nom, description, style, lié à plusieurs événements.
  - `Image` : nom, fichier (chemin), type (`affiche`, `profil`), lié à un événement.
  - `Lieu` : nom, adresse, ville, événements associés.
- Relations bien définies entre les entités.
- Gestion des fichiers image pour les affiches et profils.

---

## Éco-Conception  

- **Audit RGAA** : conformité avec les règles d’accessibilité web.
- **Audit RGESN** : démarche de sobriété numérique pour limiter l’empreinte écologique.

---

## Installation  

### Prérequis  
- PHP >= 8.2  
- Composer  
- Symfony CLI  
- MySQL / MariaDB  

---

### Backend — Symfony  

**Cloner le projet :**  
```bash
git clone https://github.com/dadal560/Dub.git
cd Dub
```

**Installer les dépendances PHP :**  
```bash
composer install
```

**Créer le fichier de configuration `.env.local` :**  
```bash
cp .env .env.local
```

Modifier le fichier `.env.local` pour configurer la base de données :  
```
DATABASE_URL="mysql://user:password@127.0.0.1:3306/dub_db"
```
 **Créer la base de données :**  
```bash
php bin/console doctrine:database:create
```

 **Exécuter les migrations :**  
```bash
php bin/console doctrine:migrations:migrate
```

 **Lancer le serveur Symfony :**  
```bash
symfony server:start
```

