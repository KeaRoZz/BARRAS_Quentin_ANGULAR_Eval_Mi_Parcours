# Tier List — Évaluation Mi-Parcours Angular

Application de tier-list permettant à un utilisateur connecté de gérer ses images réparties en catégories (Top / Moyen / Nul), avec un système de déplacement inter-catégories.

## Stack

**Frontend**
- Angular 21
- TypeScript
- Signals + syntaxe `@for` / `@if`
- SCSS

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

Créer la base `tier_list` et son schéma via phpMyAdmin en exécutant le script SQL fourni.

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

- Connexion / déconnexion via JWT
- Affichage des catégories et images de l'utilisateur connecté
- Ajout d'image par URL
- Suppression d'image
- Déplacement d'image vers la catégorie précédente / suivante (boutons `+` / `-`)
- **Mode déplacement direct** : clic sur l'icône `✥` au centre de l'image, puis clic sur l'en-tête de la catégorie cible

## API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/login` | ❌ | Authentification, renvoie un JWT |
| GET | `/categories` | ✅ | Liste les catégories et images de l'utilisateur |
| POST | `/ajout-image` | ❌ | Ajoute une image (in-memory legacy) |
| DELETE | `/supprimer-image/:id` | ✅ | Supprime une image de l'utilisateur |
| PATCH | `/deplacement-image/:id` | ✅ | Déplace une image d'une catégorie à la suivante (body : `{ haut: boolean }`) |
| PATCH | `/deplacement-image/:id/categorie/:idCategorie` | ✅ | Déplace une image vers une catégorie cible précise |

## Sécurité

Deux intercepteurs vérifient les autorisations :
- `jwtInterceptor` : valide le JWT et attache `req.user` à la requête.
- `imageOwnerInterceptor` : vérifie que l'image ciblée appartient à une catégorie de l'utilisateur connecté, expose `req.idImage` et `req.idCategorie`.

Sur la route de déplacement direct, une vérification supplémentaire s'assure que la **catégorie de destination** appartient bien à l'utilisateur connecté (`SELECT id FROM categorie WHERE id = ? AND user_id = ?`).

## Structure

```
│ BARRAS_Quentin_ANGULAR_Eval8Mi_Parcours
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
