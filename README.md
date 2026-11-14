# Terikhi — Tunisia Explorer

Terikhi est un atlas interactif des 24 gouvernorats de Tunisie, construit avec **Angular 20** pour le frontend et **NestJS 11** pour le backend.

## Run it

```bash
# Frontend (http://localhost:4200)
npm install
npm start

# Backend (http://localhost:3000/api), dans un second terminal
npm install
npm run start:dev

# Alternative depuis le dossier server
cd server
npm install
npm run start:dev
```

Le frontend propose la carte, les fiches partageables (`/gouvernorat/:id`), la recherche, un puzzle, ainsi que les pages À propos et Contact. La carte et les fiches restent consultables lorsque l’API est indisponible ; l’envoi du formulaire Contact, lui, affiche une erreur claire si le backend n’est pas lancé.

## Routes frontend

| Route | Fonction |
| --- | --- |
| `/` | Accueil et carte interactive |
| `/gouvernorat/:id` | Fiche partageable et carte centrée sur un gouvernorat |
| `/recherche` | Recherche dans les 24 fiches |
| `/a-propos` | Projet, équipe, méthode et crédits |
| `/contact` | Formulaire de contact |

> The photos and the GeoJSON live in `public/` (`public/gouvernorats/**`, `public/data/tunisia-governorates.geojson`). They must be present for the map and the photos to load.

## Features

| Feature | Where |
| --- | --- |
| **Eagle cursor**: a golden eagle glides behind the mouse pointer, banks in the direction it flies, circles when you stop, and dives onto whatever region or option you click (with impact rings and feathers). It is hidden on touch screens. | `src/app/ui/eagle-cursor.component.ts` |
| **Voice narration**: reads aloud the option you press, the text you select, the governorate you open (name, tagline and what it is known for) and the section you switch to. It uses the browser's Web Speech API and ranks the voices to pick the most natural one (Natural / Neural / Google / Premium). The ▾ menu next to "Narration" lets you choose a voice and a speed. | `src/app/core/narrator.service.ts`, `narration-director.service.ts`, `ui/narration-control.component.ts` |
| **Élissa, the guide**: replaces Hannibal. Élissa (Dido) was the Phoenician queen who founded Carthage in 814 BC. Her head turns and her eyes follow the pointer. She blinks and breathes, and she reacts to what you do: surprised on click, curious on hover, focused while you type, happy on copy, cheering when you win, asleep after 14 s of inactivity. Her lips move while the narration speaks, and a speech bubble shows the text. Click her to hear her introduce herself. | `src/app/ui/elissa.component.ts` |
| **Living sea**: drifting swell lines, sparkles and pulsing coastal foam. | `src/app/map/map.component.*` |
| **Region emblems**: opening a governorate makes its emblem burst out of the map, followed by a photo card, which then docks in a corner. Bizerte → 🐟 fish, Gafsa → ⛏️ phosphates and Roman pools, Tozeur → 🌴 Deglet Nour dates, and so on. The emblem also appears in the map tooltip. | `src/app/data/emblems.data.ts`, `map/region-emblem.component.ts` |
| **Feedback animations**: click ripples, letters that float out of the search field as you type, and a toast with a flying excerpt when you copy (Ctrl+C or the new "Copier" button on each section). | `src/app/ui/fx-layer.component.ts` |
| **Map puzzle**: drag the 24 governorates back into place, in easy mode (borders and names shown) or expert mode (silhouette only), with a timer, a move counter and hints (+5 s). When it's complete, the map flashes red and white, a Tunisian flag rises, confetti falls, the eagle dives and Élissa cheers. You can then save your score to the leaderboard. | `src/app/puzzle/` |
| **Flat timeline**: the History timeline is now horizontal. | `src/app/detail/city-detail.component.scss` |
| **Most explored**: chips in the index show the most opened governorates. | `src/app/index/` |

French ↔ Arabic switching covers all the new features. I also fixed the existing bug where some French labels showed in Arabic (and the reverse).

## Backend API (NestJS, `server/`)

Data is stored as JSON files in `server/data/`, so there is no database to install.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | health check |
| GET | `/api/scores?mode=easy\|expert&limit=8` | puzzle leaderboard |
| POST | `/api/scores` `{ name, mode, timeMs, moves }` | save a score (validated; impossible times are rejected) |
| POST | `/api/stats/views/:cityId` | count a governorate view |
| GET | `/api/stats/views?limit=3` | most explored governorates |
| POST | `/api/contact` | receive `{ name, email, message }` with strict validation and IP rate limiting |

Les messages de contact sont stockés dans `server/data/contact.json` (fichier local exclu de Git). L’API n’ajoute aucune dépendance : elle utilise les contrôleurs NestJS et le stockage JSON déjà présents.
