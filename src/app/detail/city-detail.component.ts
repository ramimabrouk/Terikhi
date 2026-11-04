import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { AtlasStore } from '../core/atlas.store';
import { formatNumber, pad2 } from '../core/format';
import { MotionService } from '../core/motion.service';
import {
  CITIES,
  SECTION_LABELS,
  type CitySection,
  type SectionId,
  type TunisianCity,
} from '../data/cities.data';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrl: './city-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDetailComponent implements OnDestroy {
  readonly store = inject(AtlasStore);
  private readonly motion = inject(MotionService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly city = input.required<TunisianCity>();

  private readonly scrollRef = viewChild<ElementRef<HTMLElement>>('scroll');
  private readonly sectionPanelRef = viewChild<ElementRef<HTMLElement>>('sectionPanel');

  readonly labels = SECTION_LABELS;
  readonly sectionId = this.store.sectionId;
  readonly currentSection = computed<CitySection>(() => {
    const city = this.city();
    return city.sections.find((section) => section.id === this.sectionId()) ?? city.sections[0];
  });
  readonly sectionNumber = computed(() =>
    pad2(this.city().sections.findIndex((section) => section.id === this.sectionId()) + 1),
  );
  readonly position = computed(() => this.store.position() ?? { index: 1, total: CITIES.length });
  readonly previous = this.store.previous;
  readonly next = this.store.next;

  readonly population = computed(() => formatNumber(this.city().population));
  readonly area = computed(() => formatNumber(this.city().areaKm2));
  readonly statusLabel = computed(() => {
    const city = this.city();
    if (city.isCapital) return 'Capitale';
    return city.coastal ? 'Littoral' : 'Intérieur';
  });
  readonly elevation = computed(() => {
    const value = this.city().elevation;
    return typeof value === 'number' ? formatNumber(value) : null;
  });
  readonly pad = pad2;
  readonly scrollProgress = signal(0);
  readonly scrollable = signal(false);
  readonly heroScrolled = signal(false);

  private lastCityId = '';
  private lastSection: SectionId | null = null;
  private entryCtx: gsap.Context | null = null;
  private sectionCtx: gsap.Context | null = null;
  private lenis: Lenis | null = null;
  private scrollEl: HTMLElement | null = null;

  constructor() {
    afterRenderEffect(() => {
      const city = this.city();
      const section = this.sectionId();
      const cityChanged = city.id !== this.lastCityId;
      const sectionChanged = section !== this.lastSection;
      if (!cityChanged && !sectionChanged) return;

      this.lastCityId = city.id;
      this.lastSection = section;

      if (cityChanged) {
        this.resetScroll();
        this.animateEntry();
      } else {
        this.animateSection();
      }
      requestAnimationFrame(() => this.updateScrollCue());
    });

    afterNextRender(() => this.setupScroll());
  }

  ngOnDestroy(): void {
    this.entryCtx?.revert();
    this.sectionCtx?.revert();
    this.lenis?.destroy();
    this.scrollEl?.removeEventListener('scroll', this.onScroll);
  }

  back(): void {
    this.store.back();
  }

  selectSection(section: SectionId): void {
    if (this.sectionId() === section) return;
    this.store.setSection(section);
    requestAnimationFrame(() => this.scrollToSection());
  }

  private setupScroll(): void {
    const scroll = this.scrollRef()?.nativeElement;
    if (!scroll) return;
    this.scrollEl = scroll;

    if (!this.motion.reduced() && scroll.firstElementChild instanceof HTMLElement) {
      this.lenis = new Lenis({
        wrapper: scroll,
        content: scroll.firstElementChild,
        smoothWheel: true,
        lerp: 0.09,
        autoRaf: true,
        respectReducedMotion: true,
      });
    }

    scroll.addEventListener('scroll', this.onScroll, { passive: true });
    this.updateScrollCue();
  }

  private readonly onScroll = (): void => {
    const scroll = this.scrollEl;
    if (!scroll) return;
    this.updateScrollCue(scroll);
  };

  private updateScrollCue(scroll = this.scrollEl): void {
    if (!scroll) return;
    const max = scroll.scrollHeight - scroll.clientHeight;
    this.scrollable.set(max > 8);
    this.scrollProgress.set(max > 0 ? Math.min(1, Math.max(0, scroll.scrollTop / max)) : 0);
    this.heroScrolled.set(scroll.scrollTop > 140);
  }

  private animateEntry(): void {
    const root = this.host.nativeElement;
    this.entryCtx?.revert();
    this.entryCtx = gsap.context(() => {
      const items = root.querySelectorAll<HTMLElement>('[data-reveal]');

      if (this.motion.reduced()) {
        gsap.set(items, { clearProps: 'opacity,visibility,transform' });
        return;
      }

      gsap.fromTo(
        items,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.055,
          ease: 'power3.out',
          overwrite: true,
          clearProps: 'opacity,visibility,transform',
        },
      );
    }, root);
  }

  private animateSection(): void {
    const panel = this.sectionPanelRef()?.nativeElement;
    if (!panel) return;
    this.sectionCtx?.revert();
    const items = panel.querySelectorAll<HTMLElement>('[data-anim]');
    this.sectionCtx = gsap.context(() => {
      if (this.motion.reduced()) {
        gsap.set(items, { clearProps: 'opacity,visibility,transform' });
        return;
      }
      gsap.fromTo(
        items,
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.045,
          ease: 'power2.out',
          clearProps: 'opacity,visibility,transform',
        },
      );
    }, panel);
  }

  private resetScroll(): void {
    if (!this.scrollEl) return;
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: true });
    } else {
      this.scrollEl.scrollTop = 0;
    }
  }

  private scrollToSection(): void {
    const scroll = this.scrollEl;
    const panel = this.sectionPanelRef()?.nativeElement;
    if (!scroll || !panel) return;
    const mobile = window.matchMedia('(max-width: 900px)').matches;
    const top =
      panel.getBoundingClientRect().top -
      scroll.getBoundingClientRect().top +
      scroll.scrollTop -
      (mobile ? 58 : 12);
    if (this.motion.reduced()) {
      if (this.lenis) this.lenis.scrollTo(top, { immediate: true });
      else scroll.scrollTop = top;
      return;
    }
    if (this.lenis) {
      this.lenis.scrollTo(top, { duration: 0.8 });
    } else {
      scroll.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
