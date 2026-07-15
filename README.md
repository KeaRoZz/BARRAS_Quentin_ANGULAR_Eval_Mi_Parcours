# Tier List — Évaluation Mi-Parcours Angular

Application de tier-list permettant à un utilisateur connecté de gérer ses catégories et ses images, avec un système complet de déplacement et de réordonnancement.

## Stack

**Frontend**
- Angular 21
- TypeScript
- Signals + syntaxe `@for` / `@if`
- SCSS
- Angular Material (icônes)

**Backend**
- Node.js + Express
- MySQL (via `mysql2`)
- JWT pour l'authentification
- CORS

**Environnement**
- Docker Compose (MySQL + phpMyAdmin)

## Prérequis

- Node.js ≥ 20
- Docker Desktop
- Angular CLI (`npm install -g @angular/cli`)

## Installation

### 1. Cloner le dépôt

```bash
git clone git@github.com:KeaRoZz/BARRAS_Quentin_ANGULAR_Eval_Mi_Parcours.git
cd BARRAS_Quentin_ANGULAR_Eval_Mi_Parcours
```

### 2. Base de données

Depuis le dossier contenant `docker-compose.yml` :

```bash
docker compose up -d
```

Services démarrés :
- MySQL sur `localhost:3306`
- phpMyAdmin sur `http://localhost:81`

Créer la base `tier_list` et son schéma via phpMyAdmin en exécutant le script SQL fourni. La table `categorie` doit inclure une colonne `ordre INT NOT NULL DEFAULT 0` pour permettre le réordonnancement.

### 3. Backend

```bash
cd demo-dw1-26-back-main
npm install
node index.js
```

Serveur disponible sur `http://localhost:7777`.

### 4. Frontend

Dans un second terminal :

```bash
cd demo-dw1-26-master
npm install
ng serve
```

Application disponible sur `http://localhost:4200`.

## Fonctionnalités

### Gestion des images
- Ajout d'image par URL (persistance en base)
- Suppression d'image
- Déplacement vers la catégorie précédente / suivante via boutons de flèches
- **Mode déplacement direct** : clic sur l'icône centrale au survol d'une image, puis clic sur l'en-tête de la catégorie cible

### Gestion des catégories
- Création d'une nouvelle catégorie
- Suppression d'une catégorie (avec confirmation)
- Réordonnancement via boutons haut / bas sur l'en-tête (visibles au survol)

### Authentification
- Connexion / déconnexion via JWT
- Toutes les données affichées sont filtrées par utilisateur connecté

## API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/login` | ❌ | Authentification, renvoie un JWT |
| GET | `/categories` | ✅ | Liste les catégories et images de l'utilisateur, triées par ordre |
| POST | `/ajout-image` | ✅ | Ajoute une image en base pour l'utilisateur |
| DELETE | `/supprimer-image/:id` | ✅ | Supprime une image de l'utilisateur |
| PATCH | `/deplacement-image/:id` | ✅ | Déplace une image d'une catégorie à la suivante (body : `{ haut: boolean }`) |
| PATCH | `/deplacement-image/:id/categorie/:idCategorie` | ✅ | Déplace une image vers une catégorie cible précise |
| POST | `/categorie` | ✅ | Crée une nouvelle catégorie |
| PATCH | `/categorie/:id/deplacement` | ✅ | Déplace une catégorie vers le haut ou le bas (body : `{ haut: boolean }`) |
| DELETE | `/categorie/:id` | ✅ | Supprime une catégorie et ses images (cascade) |

## Sécurité

Deux intercepteurs vérifient les autorisations :
- `jwtInterceptor` : valide le JWT et attache `req.user` à la requête.
- `imageOwnerInterceptor` : vérifie que l'image ciblée appartient à une catégorie de l'utilisateur connecté, expose `req.idImage` et `req.idCategorie`.

Toutes les routes de modification effectuent une vérification supplémentaire sur la catégorie ciblée pour s'assurer qu'elle appartient bien à l'utilisateur connecté (`SELECT id FROM categorie WHERE id = ? AND user_id = ?`).

## Structure

```
BARRAS_Quentin_ANGULAR_Eval_Mi_Parcours
├── demo-dw1-26-back-main/         # Backend Express
│   ├── index.js
│   ├── connection.js
│   ├── jwt-interceptor.js
│   └── image-owner-interceptor.js
│
└── demo-dw1-26-master/            # Frontend Angular
└── src/app/
├── pages/
│   ├── accueil/
│   └── connexion/
└── models/
```
