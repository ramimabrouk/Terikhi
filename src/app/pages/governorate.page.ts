import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AtlasPage } from '../atlas/atlas.page';
import { CITY_BY_ID } from '../data/cities.data';

@Component({
  selector: 'app-governorate-page',
  imports: [AtlasPage, RouterLink],
  template: `
    @if (known) {
      <app-atlas-page />
    } @else {
      <main class="page">
        <nav class="page-nav" aria-label="Navigation principale">
          <a routerLink="/">Accueil</a><a routerLink="/recherche">Recherche</a>
          <a routerLink="/a-propos">À propos</a><a routerLink="/contact">Contact</a>
        </nav>
        <p class="eyebrow">Erreur 404</p>
        <h1>Gouvernorat introuvable</h1>
        <p>Cette fiche n’existe pas dans l’atlas.</p>
        <div class="page-actions"><a class="page-button" routerLink="/">Retour à la carte</a></div>
      </main>
    }
  `,
  styleUrls: ['./page-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernoratePage {
  private readonly route = inject(ActivatedRoute);
  readonly known = CITY_BY_ID.has(this.route.snapshot.paramMap.get('id') ?? '');
}
