import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import type { GalleryItem } from '../data/gallery.data';

export type GalleryCategory = 'places' | 'food';

export interface GalleryRequest {
  cityId: string;
  cityName: string;
  category: GalleryCategory;
  categoryLabel: string;
  item: GalleryItem;
}

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGalleryComponent {
  readonly request = input<GalleryRequest | null>(null);
  readonly closed = output<void>();
  readonly activeImage = signal<string | null>(null);
  readonly displayedImage = computed(
    () => this.activeImage() ?? this.request()?.item.images[0] ?? '',
  );

  constructor() {
    effect(() => {
      this.request();
      this.activeImage.set(null);
    });
  }

  selectImage(image: string): void {
    this.activeImage.set(image);
  }
}
