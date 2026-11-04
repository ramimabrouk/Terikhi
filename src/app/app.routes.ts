import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Atlas de Tunisie — Explorer les 24 gouvernorats',
    loadComponent: () => import('./atlas/atlas.page').then((m) => m.AtlasPage),
  },
  { path: '**', redirectTo: '' },
];
