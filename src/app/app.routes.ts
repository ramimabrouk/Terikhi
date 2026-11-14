import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Terikhi — Explorer les 24 gouvernorats',
    loadComponent: () => import('./atlas/atlas.page').then((m) => m.AtlasPage),
  },
  {
    path: 'gouvernorat/:id',
    title: 'Fiche gouvernorat — Terikhi',
    loadComponent: () => import('./pages/governorate.page').then((m) => m.GovernoratePage),
  },
  {
    path: 'recherche',
    title: 'Recherche — Terikhi',
    loadComponent: () => import('./pages/search.page').then((m) => m.SearchPage),
  },
  {
    path: 'a-propos',
    title: 'À propos — Terikhi',
    loadComponent: () => import('./pages/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'contact',
    title: 'Contact — Terikhi',
    loadComponent: () => import('./pages/contact.page').then((m) => m.ContactPage),
  },
  {
    path: '**',
    title: 'Page introuvable — Terikhi',
    loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage),
  },
];
