import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AtlasStore } from '../core/atlas.store';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page">
      <nav class="page-nav" aria-label="Navigation principale">
        <a routerLink="/">Accueil</a><a routerLink="/recherche" aria-current="page">Recherche</a>
        <a routerLink="/a-propos">À propos</a><a routerLink="/contact">Contact</a>
      </nav>
      <p class="eyebrow page-kicker">Terikhi · Index</p>
      <h1>Rechercher un gouvernorat</h1>
      <div class="page-card search-card">
        <label for="query">Nom, région ou sujet</label>
        <input id="query" type="search" [(ngModel)]="query" (ngModelChange)="onQuery($event)" />
        @if (results.length) {
          <ul class="results">
            @for (city of results; track city.id) {
              <li><a class="text-link" [routerLink]="['/gouvernorat', city.id]">{{ city.name }}</a><span>{{ city.region }}</span></li>
            }
          </ul>
        } @else {
          <p class="empty">Aucun résultat pour cette recherche.</p>
        }
      </div>
    </main>
  `,
  styles: [`
    label { display: block; margin-bottom: 8px; font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; }
    input { width: 100%; padding: 13px; border: 1px solid var(--line); background: var(--paper); font-size: 20px; }
    .results { padding-left: 0 !important; list-style: none !important; }
    .results li { display: flex; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--line-soft); padding: 10px 0; }
    .results span { color: var(--ink-3); font-family: var(--font-mono); font-size: 12px; }
    .empty { margin-top: 24px; color: var(--ink-3); }
  `],
  styleUrls: ['./page-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {
  private readonly store = inject(AtlasStore);
  query = '';
  results = [...this.store.filteredCities()];

  onQuery(value: string): void {
    this.query = value;
    this.store.setQuery(value);
    this.results = [...this.store.filteredCities()];
  }
}
