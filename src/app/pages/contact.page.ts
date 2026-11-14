import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';

type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact-page',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page">
      <nav class="page-nav" aria-label="Navigation principale">
        <a routerLink="/">Accueil</a><a routerLink="/recherche">Recherche</a>
        <a routerLink="/a-propos">À propos</a><a routerLink="/contact" aria-current="page">Contact</a>
      </nav>
      <p class="eyebrow page-kicker">Terikhi · Écrire à l’équipe</p>
      <h1>Contact</h1>
      <div class="page-card">
        <form #form="ngForm" (ngSubmit)="submit(form)" novalidate>
          <label for="name">Nom</label>
          <input id="name" name="name" [(ngModel)]="name" required minlength="2" maxlength="80" />
          @if (form.submitted && form.controls['name']?.invalid) { <small>Indiquez votre nom (2 à 80 caractères).</small> }

          <label for="email">E-mail</label>
          <input id="email" name="email" type="email" [(ngModel)]="email" required maxlength="160" email />
          @if (form.submitted && form.controls['email']?.invalid) { <small>Indiquez une adresse e-mail valide.</small> }

          <label for="message">Message</label>
          <textarea id="message" name="message" [(ngModel)]="message" required minlength="10" maxlength="2000" rows="7"></textarea>
          @if (form.submitted && form.controls['message']?.invalid) { <small>Le message doit contenir 10 à 2 000 caractères.</small> }

          <button class="page-button" type="submit" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Envoi…' : 'Envoyer' }}
          </button>
          @if (status() === 'success') { <p class="feedback success" role="status">Votre message a bien été envoyé.</p> }
          @if (status() === 'error') { <p class="feedback error" role="alert">L’envoi est indisponible pour le moment. Vérifiez que l’API est lancée, puis réessayez.</p> }
        </form>
      </div>
    </main>
  `,
  styles: [`
    form { display: grid; gap: 8px; max-width: 700px; }
    label { margin-top: 12px; font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; }
    input, textarea { width: 100%; padding: 12px; border: 1px solid var(--line); background: var(--paper); font-size: 18px; }
    small { color: var(--terracotta-deep); }
    .page-button { width: fit-content; margin-top: 16px; }
    .feedback { margin-top: 18px; }
    .success { color: var(--olive); }
    .error { color: var(--terracotta-deep); }
  `],
  styleUrls: ['./page-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  private readonly api = inject(ApiService);
  readonly status = signal<ContactStatus>('idle');
  name = '';
  email = '';
  message = '';

  async submit(form: NgForm): Promise<void> {
    if (form.invalid) {
      this.status.set('idle');
      return;
    }
    this.status.set('sending');
    try {
      await this.api.sendContact({ name: this.name, email: this.email, message: this.message });
      this.status.set('success');
      form.resetForm();
    } catch {
      this.status.set('error');
    }
  }
}
