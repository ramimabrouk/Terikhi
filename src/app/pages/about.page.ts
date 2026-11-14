import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      <nav class="page-nav" aria-label="Navigation principale">
        <a routerLink="/">Accueil</a><a routerLink="/recherche">Recherche</a>
        <a routerLink="/a-propos" aria-current="page">À propos</a><a routerLink="/contact">Contact</a>
      </nav>
      <p class="eyebrow page-kicker">Terikhi · Le projet</p>
      <h1>Lire la Tunisie, gouvernorat par gouvernorat.</h1>
      <div class="page-card">
        <p>Terikhi est un atlas éditorial et interactif des 24 gouvernorats de Tunisie. La carte, les fiches et la recherche rendent la découverte accessible sur ordinateur comme sur mobile.</p>
        <h2>Équipe</h2>
        <p>Groupe 5 : Hamdi Sarra, Mabrouk Rami.</p>
        <h2>Méthode</h2>
        <p>Chaque fiche est relue à partir de sources documentaires et comparée avant publication. Les informations présentées sont éditorialisées pour l’exploration ; aucune fiche n’est marquée « vérifiée ».</p>
        <h2>Crédits</h2>
        <p>Contours géographiques : <a class="text-link" href="https://www.geoboundaries.org/" target="_blank" rel="noreferrer">geoBoundaries</a>, licence CC BY 4.0. Typographies : Google Fonts.</p>
      </div>
    </main>
  `,
  styleUrls: ['./page-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {}
