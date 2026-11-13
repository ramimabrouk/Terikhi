import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, Injector, effect, inject, untracked } from '@angular/core';
import { AtlasStore } from './atlas.store';
import { LanguageService } from './language.service';
import { NarratorService } from './narrator.service';
import { InteractionService } from './interaction.service';
import { REGION_EMBLEMS } from '../data/emblems.data';

/** Elements that already have richer, dedicated narration. */
const HANDLED_ELSEWHERE = 'path.gov, .city-row, .si-btn, [data-narrate="off"]';
const OPTION = 'button, a[href], [role="button"], .chip, summary';

/**
 * Decides *what* gets read aloud: the option you press, the text you select,
 * the governorate you open and the rubric you switch to.
 */
@Injectable({ providedIn: 'root' })
export class NarrationDirectorService {
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(AtlasStore);
  private readonly i18n = inject(LanguageService);
  private readonly narrator = inject(NarratorService);
  private readonly interaction = inject(InteractionService);
  private readonly injector = inject(Injector);
  private started = false;
  private effectsReady = false;
  private selectionTimer: number | null = null;
  private lastSelection = '';

  start(destroyRef: DestroyRef): void {
    if (this.started) return;
    this.started = true;
    this.document.addEventListener('click', this.onClick, true);
    this.document.addEventListener('mouseup', this.onSelectionGesture);
    this.document.addEventListener('keyup', this.onSelectionGesture);
    destroyRef.onDestroy(() => {
      this.document.removeEventListener('click', this.onClick, true);
      this.document.removeEventListener('mouseup', this.onSelectionGesture);
      this.document.removeEventListener('keyup', this.onSelectionGesture);
      this.started = false;
    });
    if (this.effectsReady) return;
    this.effectsReady = true;

    let lastCity: string | null = null;
    effect(
      () => {
        const city = this.store.selected();
        if (!city || city.id === lastCity) {
          lastCity = city?.id ?? null;
          return;
        }
        lastCity = city.id;
        untracked(() => {
          const arabic = this.i18n.isArabic();
          const emblem = REGION_EMBLEMS[city.id];
          const name = arabic ? city.nameAr : city.name;
          const tagline = arabic ? city.taglineAr : city.tagline;
          const known = emblem
            ? arabic
              ? ` ${this.i18n.t('knownFor')} ${emblem.ar}.`
              : ` ${name} est réputée pour ${emblem.fr}.`
            : '';
          this.narrator.say(`${name}. ${tagline}${known}`, { priority: true });
          this.interaction.react('happy', 2200);
        });
      },
      { injector: this.injector },
    );

    let lastSection = this.store.sectionId();
    let sectionCity: string | null = null;
    effect(
      () => {
        const section = this.store.sectionId();
        const city = this.store.selected();
        if (!city) return;
        if (city.id !== sectionCity) {
          sectionCity = city.id;
          lastSection = section;
          return;
        }
        if (section === lastSection) return;
        lastSection = section;
        untracked(() => {
          const data = city.sections.find((item) => item.id === section);
          if (!data) return;
          const arabic = this.i18n.isArabic();
          const title = this.i18n.t(
            section === 'history'
              ? 'history'
              : section === 'origin'
                ? 'origin'
                : section === 'places'
                  ? 'places'
                  : 'food',
          );
          this.narrator.say(`${title}. ${arabic ? data.bodyAr : data.body}`, { priority: true });
        });
      },
      { injector: this.injector },
    );
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(HANDLED_ELSEWHERE)) return;
    const option = target.closest(OPTION);
    if (!option) return;
    const label =
      option.getAttribute('data-narrate') ||
      option.getAttribute('aria-label') ||
      (option.textContent ?? '').replace(/[←→↗›×↓/]/g, ' ');
    const clean = label.replace(/\s+/g, ' ').trim();
    if (clean.length > 1) this.narrator.say(clean.slice(0, 140));
  };

  private readonly onSelectionGesture = (): void => {
    if (this.selectionTimer !== null) window.clearTimeout(this.selectionTimer);
    this.selectionTimer = window.setTimeout(() => {
      this.selectionTimer = null;
      const active = this.document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      const text = this.document.getSelection()?.toString().replace(/\s+/g, ' ').trim() ?? '';
      if (text.length < 2 || text === this.lastSelection) {
        if (text.length < 2) this.lastSelection = '';
        return;
      }
      this.lastSelection = text;
      this.interaction.react('curious', 1800);
      this.narrator.say(text.slice(0, 900), { priority: true });
    }, 260);
  };
}
