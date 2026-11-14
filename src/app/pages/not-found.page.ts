import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      <nav class="page-nav" aria-label="Navigation principale">
        <a routerLink="/">Accueil</a><a routerLink="/recherche">Recherche</a>
        <a routerLink="/a-propos">À propos</a><a routerLink="/contact">Contact</a>
      </nav>
      <p class="eyebrow">Erreur 404</p>
      <h1>Page introuvable</h1>
      <p>La page demandée n’existe pas.</p>
      <div class="page-actions"><a class="page-button" routerLink="/">Retour à la carte</a></div>
    </main>
  `,
  styleUrls: ['./page-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
