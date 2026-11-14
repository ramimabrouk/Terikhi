# Terikhi — Tunisia Explorer

Terikhi is an interactive atlas of Tunisia's 24 governorates. It combines an Angular
frontend with a NestJS API to make exploring Tunisia's geography, history, and local
identity engaging and accessible.

The interface is available in French and Arabic, with English documentation for
developers.

## Highlights

- Explore an interactive map of all 24 governorates.
- Open shareable governorate profiles at `/gouvernorat/:id`.
- Search across governorate profiles and discover the most explored destinations.
- Learn through the horizontal history timeline and regional highlights.
- Complete the map puzzle in Easy or Expert mode, then save scores to the leaderboard.
- Use voice narration powered by the browser's Web Speech API.
- Interact with Élissa, the animated guide inspired by Dido, the founder of Carthage.
- Enjoy responsive visual effects, including the eagle cursor, coastal animation, and
  region emblems.
- Use the contact form and view tracking without requiring a database.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | Angular 20, TypeScript, SCSS |
| Backend | NestJS 11, TypeScript |
| Map rendering | `d3-geo` |
| Animation | GSAP and Lenis |
| Storage | Local JSON files |

## Getting started

### Prerequisites

- Node.js and npm
- A modern browser with JavaScript enabled

### Install dependencies

Install the frontend dependencies from the project root:

```bash
npm install
```

Install the API dependencies:

```bash
cd server
npm install
cd ..
```

### Start the development servers

Run the frontend from the project root:

```bash
npm start
```

The frontend is available at [http://localhost:4200](http://localhost:4200).

In a second terminal, start the API:

```bash
npm run start:dev
```

The API is available at [http://localhost:3000/api](http://localhost:3000/api).
The Angular development server proxies API requests automatically.

The map and governorate profiles can be explored without the API. Features that
write data, such as contact submissions, score saving, and view statistics, require
the API to be running.

## Frontend routes

| Route | Description |
| --- | --- |
| `/` | Home page and interactive map |
| `/gouvernorat/:id` | Shareable governorate profile |
| `/recherche` | Search across governorate profiles |
| `/a-propos` | Project, team, methodology, and credits |
| `/contact` | Contact form |

## Backend API

The API lives in [`server/`](server/) and stores data in JSON files under
`server/data/`. No database setup is required.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API availability |
| `GET` | `/api/scores?mode=easy\|expert&limit=8` | Get puzzle leaderboard scores |
| `POST` | `/api/scores` | Save a validated puzzle score |
| `POST` | `/api/stats/views/:cityId` | Record a governorate profile view |
| `GET` | `/api/stats/views?limit=3` | Get the most explored governorates |
| `POST` | `/api/contact` | Submit a validated contact message |

Score submissions accept `{ name, mode, timeMs, moves }`. Contact submissions
accept `{ name, email, message }` and are protected by IP-based rate limiting.
Contact messages are stored locally in `server/data/contact.json`, which is
excluded from Git.

## Project structure

```text
.
├── public/                 # GeoJSON data and governorate images
├── server/                 # NestJS API and JSON storage
├── src/app/                # Angular application
│   ├── data/               # Governorate and emblem data
│   ├── detail/             # Governorate profile views
│   ├── map/                # Interactive map
│   ├── puzzle/             # Map puzzle
│   └── ui/                 # Shared UI and animation components
└── package.json
```

The files in `public/` are required for the map and images to load, especially
`public/data/tunisia-governorates.geojson` and `public/gouvernorats/`.

## Available scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run build` | Create a production build |
| `npm test` | Run the Angular test suite |
| `npm run watch` | Build continuously in development mode |

### Backend

Run these commands from `server/`:

| Command | Description |
| --- | --- |
| `npm run start:dev` | Build and start the API with watch mode |
| `npm run build` | Build the NestJS API |
| `npm run start:prod` | Start the compiled API |

## Contributing

Before opening a pull request:

1. Keep changes focused and consistent with the existing architecture.
2. Run the relevant frontend or backend build and test commands.
3. Check that the French and Arabic interfaces remain usable.
4. Confirm that map assets and API-dependent features still work locally.
