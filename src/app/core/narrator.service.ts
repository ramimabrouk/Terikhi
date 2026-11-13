import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, computed, effect, inject, signal } from '@angular/core';
import { LanguageService } from './language.service';

const STORAGE_KEY = 'tunisia-explorer:narration';
const ARABIC_RE = /[؀-ۿ]/;

interface NarrationPrefs {
  enabled: boolean;
  voiceFr: string | null;
  voiceAr: string | null;
  rate: number;
}

/**
 * Voice narration built on the browser's Web Speech API.
 *
 * Voices differ per OS/browser, so we rank them and pick the most natural one:
 * "Natural"/"Neural"/"Online" voices (Edge, Windows 11), Google voices (Chrome),
 * "Premium"/"Enhanced" voices (Safari/macOS) come first.
 */
@Injectable({ providedIn: 'root' })
export class NarratorService {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly i18n = inject(LanguageService);
  private readonly synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  readonly supported = this.synth !== null;
  readonly voices = signal<readonly SpeechSynthesisVoice[]>([]);
  readonly enabled = signal(true);
  readonly rate = signal(0.98);
  readonly speaking = signal(false);
  /** Text currently being read, shown in the guide's speech bubble. */
  readonly caption = signal('');
  /** Increments on every word boundary — the avatar uses it to move her lips. */
  readonly syllable = signal(0);
  private readonly chosenFr = signal<string | null>(null);
  private readonly chosenAr = signal<string | null>(null);

  readonly frVoices = computed(() => rankVoices(this.voices(), 'fr'));
  readonly arVoices = computed(() => rankVoices(this.voices(), 'ar'));
  readonly currentVoices = computed(() =>
    this.i18n.isArabic() ? this.arVoices() : this.frVoices(),
  );
  readonly currentVoiceName = computed(() => {
    const chosen = this.i18n.isArabic() ? this.chosenAr() : this.chosenFr();
    const list = this.currentVoices();
    return list.find((voice) => voice.name === chosen)?.name ?? list[0]?.name ?? null;
  });

  private pending: number | null = null;
  private lastText = '';
  private lastAt = 0;

  constructor() {
    this.readPrefs();
    if (!this.synth) return;
    const load = (): void => this.zone.run(() => this.voices.set(this.synth?.getVoices() ?? []));
    load();
    this.synth.addEventListener?.('voiceschanged', load);
    // Some browsers populate voices lazily.
    window.setTimeout(load, 600);
    window.setTimeout(load, 2000);

    effect(() => {
      const prefs: NarrationPrefs = {
        enabled: this.enabled(),
        voiceFr: this.chosenFr(),
        voiceAr: this.chosenAr(),
        rate: this.rate(),
      };
      try {
        this.document.defaultView?.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } catch {
        /* storage unavailable */
      }
    });
  }

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    if (!next) this.stop();
    else this.say(this.i18n.t('narrationOn'), { force: true });
  }

  chooseVoice(name: string): void {
    if (this.i18n.isArabic()) this.chosenAr.set(name);
    else this.chosenFr.set(name);
  }

  setRate(rate: number): void {
    this.rate.set(Math.min(1.4, Math.max(0.7, rate)));
  }

  stop(): void {
    if (this.pending !== null) window.clearTimeout(this.pending);
    this.pending = null;
    this.synth?.cancel();
    this.speaking.set(false);
  }

  /**
   * Speak a text. Calls made within a few milliseconds of each other are
   * coalesced and the last one wins, so a click that both "presses a button"
   * and "opens a governorate" only narrates the more meaningful sentence.
   */
  say(text: string, options: { force?: boolean; priority?: boolean } = {}): void {
    if (!this.synth || (!this.enabled() && !options.force)) return;
    const clean = text.replace(/\s+/g, ' ').trim();
    if (!clean) return;
    const now = performance.now();
    if (clean === this.lastText && now - this.lastAt < 900) return;
    if (this.pending !== null) {
      if (!options.priority && now - this.lastAt < 120) return;
      window.clearTimeout(this.pending);
    }
    this.lastText = clean;
    this.lastAt = now;
    this.pending = window.setTimeout(() => {
      this.pending = null;
      this.utter(clean);
    }, 70);
  }

  private utter(text: string): void {
    const synth = this.synth;
    if (!synth) return;
    synth.cancel();
    this.zone.run(() => this.caption.set(text));
    const arabic = ARABIC_RE.test(text);
    const list = arabic ? this.arVoices() : this.frVoices();
    const chosen = arabic ? this.chosenAr() : this.chosenFr();
    const voice = list.find((item) => item.name === chosen) ?? list[0] ?? null;

    // Long passages are split into sentences: Chrome stops long utterances
    // after ~15 s, and sentence-sized chunks sound more natural.
    const chunks = splitSentences(text);
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = voice?.lang ?? (arabic ? 'ar-SA' : 'fr-FR');
      if (voice) utterance.voice = voice;
      utterance.rate = this.rate();
      utterance.pitch = 1.04;
      utterance.volume = 1;
      utterance.onstart = () => this.zone.run(() => this.speaking.set(true));
      utterance.onboundary = () => this.zone.run(() => this.syllable.update((n) => n + 1));
      const done = (): void => {
        if (index === chunks.length - 1) this.zone.run(() => this.speaking.set(false));
      };
      utterance.onend = done;
      utterance.onerror = done;
      synth.speak(utterance);
    });
  }

  private readPrefs(): void {
    try {
      const raw = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const prefs = JSON.parse(raw) as Partial<NarrationPrefs>;
      if (typeof prefs.enabled === 'boolean') this.enabled.set(prefs.enabled);
      if (typeof prefs.voiceFr === 'string') this.chosenFr.set(prefs.voiceFr);
      if (typeof prefs.voiceAr === 'string') this.chosenAr.set(prefs.voiceAr);
      if (typeof prefs.rate === 'number') this.rate.set(prefs.rate);
    } catch {
      /* ignore broken prefs */
    }
  }
}

function voiceScore(voice: SpeechSynthesisVoice, lang: 'fr' | 'ar'): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (/natural|neural/.test(name)) score += 60;
  if (/online/.test(name)) score += 25;
  if (/premium|enhanced|siri/.test(name)) score += 40;
  if (/google/.test(name)) score += 30;
  if (/microsoft/.test(name)) score += 5;
  if (lang === 'fr') {
    if (voice.lang.toLowerCase() === 'fr-fr') score += 15;
    if (/denise|vivienne|eloise|henri|remy|amelie|audrey|thomas|marie/.test(name)) score += 8;
  } else {
    if (/ar-tn/i.test(voice.lang)) score += 25; // Tunisian Arabic when available
    if (/ar-(sa|eg|ae)/i.test(voice.lang)) score += 10;
    if (/hamed|zariyah|salma|reem|fatima|hoda|maged|laila/.test(name)) score += 8;
  }
  if (voice.localService === false) score += 4;
  return score;
}

function rankVoices(
  voices: readonly SpeechSynthesisVoice[],
  lang: 'fr' | 'ar',
): SpeechSynthesisVoice[] {
  return voices
    .filter((voice) => voice.lang.toLowerCase().startsWith(lang))
    .sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang));
}

function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?؟…]+[.!?؟…]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const part of parts) {
    if ((current + part).length > 220 && current) {
      chunks.push(current.trim());
      current = '';
    }
    current += part;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
