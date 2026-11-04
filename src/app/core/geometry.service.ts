import { Injectable, computed, signal } from '@angular/core';
import { geoCentroid, geoConicConformal, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson';
import { CITY_BY_GEO, type TunisianCity } from '../data/cities.data';

export type GeoStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface MapViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LabelAnchor {
  x: number;
  y: number;
}

export interface GovernorateShape {
  id: string;
  geoName: string;
  city: TunisianCity;
  d: string;
  bounds: [[number, number], [number, number]];
  centroid: [number, number];
  lonLat: [number, number];
  detailViewBox: string;
  area: number;
  labelAnchors: readonly LabelAnchor[];
}

interface GovernorateProperties {
  shapeName: string;
}

const MIN_VIEWPORT = 40;
const MAX_VIEWPORT = 3000;
const MIN_HOLE_AREA = 12;

const LABEL_OFFSETS: readonly LabelAnchor[] = [
  { x: 0, y: 0 },
  { x: -12, y: 0 },
  { x: 12, y: 0 },
  { x: 0, y: -15 },
  { x: 0, y: 15 },
  { x: -12, y: -15 },
  { x: 12, y: -15 },
  { x: -12, y: 15 },
  { x: 12, y: 15 },
  { x: 0, y: -30 },
  { x: 0, y: 30 },
  { x: -24, y: 0 },
  { x: 24, y: 0 },
  { x: -24, y: -15 },
  { x: 24, y: -15 },
  { x: -24, y: 15 },
  { x: 24, y: 15 },
  { x: 0, y: -46 },
  { x: 0, y: 46 },
  { x: -38, y: 0 },
  { x: 38, y: 0 },
  { x: -38, y: -20 },
  { x: 38, y: -20 },
  { x: -38, y: 20 },
  { x: 38, y: 20 },
];

@Injectable({ providedIn: 'root' })
export class GeometryService {
  private readonly _shapes = signal<readonly GovernorateShape[]>([]);
  private readonly _viewportRect = signal<MapViewBox>({
    x: 0,
    y: 0,
    width: 720,
    height: 1040,
  });
  private readonly _viewportReady = signal(false);

  readonly shapes = this._shapes.asReadonly();
  readonly viewportReady = this._viewportReady.asReadonly();
  readonly viewBoxRect = this._viewportRect.asReadonly();
  readonly status = signal<GeoStatus>('idle');
  readonly shapeByCityId = computed(
    () => new Map(this._shapes().map((shape) => [shape.id, shape])),
  );
  readonly viewBox = computed(() => {
    const v = this._viewportRect();
    return `${v.x} ${v.y} ${v.width} ${v.height}`;
  });

  private rawFeatures: readonly Feature<Geometry, GovernorateProperties>[] = [];
  private viewportWidth = 720;
  private viewportHeight = 1040;

  async load(): Promise<void> {
    if (this.status() === 'loading' || this.status() === 'ready') return;
    this.status.set('loading');
    try {
      const response = await fetch('/data/tunisia-governorates.geojson');
      if (!response.ok) {
        throw new Error(`GeoJSON request failed with ${response.status}`);
      }
      const payload: unknown = await response.json();
      if (!isFeatureCollection(payload)) {
        throw new Error('GeoJSON payload is not a FeatureCollection');
      }
      const features = payload.features.filter(isGovernorateFeature);
      if (features.length === 0) {
        throw new Error('GeoJSON payload contains no governorate features');
      }
      this.rawFeatures = features.map((feature) => ({
        ...feature,
        geometry: rewindGeometry(feature.geometry),
      }));
      this.applyProjection();
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  setViewport(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height)) return;
    const nextWidth = Math.round(Math.min(Math.max(width, MIN_VIEWPORT), MAX_VIEWPORT));
    const nextHeight = Math.round(Math.min(Math.max(height, MIN_VIEWPORT), MAX_VIEWPORT));
    if (
      this._viewportReady() &&
      nextWidth === this.viewportWidth &&
      nextHeight === this.viewportHeight
    ) {
      return;
    }
    this.viewportWidth = nextWidth;
    this.viewportHeight = nextHeight;
    this._viewportRect.set({ x: 0, y: 0, width: nextWidth, height: nextHeight });
    this._viewportReady.set(true);
    if (this.rawFeatures.length > 0) {
      this.applyProjection();
    }
  }

  private applyProjection(): void {
    const shapes = this.project(this.rawFeatures);
    if (shapes.length > 0) {
      this._shapes.set(shapes);
    }
  }

  private project(
    features: readonly Feature<Geometry, GovernorateProperties>[],
  ): GovernorateShape[] {
    const collection: FeatureCollection<Geometry, GovernorateProperties> = {
      type: 'FeatureCollection',
      features: [...features],
    };
    const width = this.viewportWidth;
    const height = this.viewportHeight;
    const padding = Math.max(10, Math.min(24, Math.min(width, height) * 0.03));
    const projection = geoConicConformal()
      .parallels([31, 37])
      .rotate([-9.5, 0])
      .fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding],
        ],
        collection,
      );
    const path = geoPath(projection);

    const shapes: GovernorateShape[] = [];
    for (const feature of features) {
      const city = CITY_BY_GEO.get(feature.properties.shapeName);
      if (!city) continue;
      const renderFeature = filterTinyHoles(feature, projection);
      const d = path(renderFeature);
      if (!d) continue;
      const bounds = path.bounds(renderFeature);
      const centroid = path.centroid(renderFeature);
      const lonLat = geoCentroid(renderFeature);
      const shapeWidth = Math.max(bounds[1][0] - bounds[0][0], 1);
      const shapeHeight = Math.max(bounds[1][1] - bounds[0][1], 1);
      const detailPad = Math.max(shapeWidth, shapeHeight) * 0.09 + 4;
      const labelAnchors = labelCandidates(
        centroid,
        bounds,
        width,
        height,
      );

      shapes.push({
        id: city.id,
        geoName: city.geoName,
        city,
        d,
        bounds: [
          [bounds[0][0], bounds[0][1]],
          [bounds[1][0], bounds[1][1]],
        ],
        centroid: [centroid[0], centroid[1]],
        lonLat: [lonLat[0], lonLat[1]],
        detailViewBox: `${bounds[0][0] - detailPad} ${bounds[0][1] - detailPad} ${
          shapeWidth + detailPad * 2
        } ${shapeHeight + detailPad * 2}`,
        area: path.area(renderFeature),
        labelAnchors,
      });
    }
    return shapes;
  }
}

function labelCandidates(
  centroid: [number, number],
  bounds: [[number, number], [number, number]],
  viewportWidth: number,
  viewportHeight: number,
): LabelAnchor[] {
  const candidates: LabelAnchor[] = [];
  const add = (x: number, y: number): void => {
    if (
      x < 4 ||
      x > viewportWidth - 4 ||
      y < 4 ||
      y > viewportHeight - 4 ||
      candidates.some((point) => Math.abs(point.x - x) < 0.5 && Math.abs(point.y - y) < 0.5)
    ) {
      return;
    }
    candidates.push({ x, y });
  };

  const inset = 6;
  const minX = bounds[0][0] + inset;
  const maxX = bounds[1][0] - inset;
  const minY = bounds[0][1] + inset;
  const maxY = bounds[1][1] - inset;

  if (maxX >= minX && maxY >= minY) {
    for (let row = 0; row < 10; row += 1) {
      for (let column = 0; column < 10; column += 1) {
        add(
          minX + ((maxX - minX) * column) / 9,
          minY + ((maxY - minY) * row) / 9,
        );
      }
    }
  }

  for (const offset of LABEL_OFFSETS) {
    add(centroid[0] + offset.x, centroid[1] + offset.y);
  }
  add(centroid[0], centroid[1]);

  return candidates.sort(
    (a, b) =>
      (a.x - centroid[0]) ** 2 +
      (a.y - centroid[1]) ** 2 -
      ((b.x - centroid[0]) ** 2 + (b.y - centroid[1]) ** 2),
  );
}

function filterTinyHoles(
  feature: Feature<Geometry, GovernorateProperties>,
  projection: ReturnType<typeof geoConicConformal>,
): Feature<Geometry, GovernorateProperties> {
  const geometry = feature.geometry;
  if (geometry.type === 'Polygon') {
    const [outer, ...holes] = geometry.coordinates;
    const kept = holes.filter((ring) => projectedRingArea(ring, projection) >= MIN_HOLE_AREA);
    return {
      ...feature,
      geometry: { type: 'Polygon', coordinates: [outer, ...kept] },
    };
  }
  if (geometry.type === 'MultiPolygon') {
    const coordinates = geometry.coordinates.map((polygon) => {
      const [outer, ...holes] = polygon;
      const kept = holes.filter((ring) => projectedRingArea(ring, projection) >= MIN_HOLE_AREA);
      return [outer, ...kept];
    });
    return {
      ...feature,
      geometry: { type: 'MultiPolygon', coordinates },
    };
  }
  return feature;
}

function projectedRingArea(
  ring: Position[],
  projection: ReturnType<typeof geoConicConformal>,
): number {
  let area = 0;
  for (let index = 0; index < ring.length; index += 1) {
    const point = ring[index];
    const prior = ring[(index - 1 + ring.length) % ring.length];
    if (!point || !prior) continue;
    const current = projection([point[0], point[1]]);
    const previous = projection([prior[0], prior[1]]);
    if (!current || !previous) continue;
    area += previous[0] * current[1] - current[0] * previous[1];
  }
  return Math.abs(area) / 2;
}

function isFeatureCollection(
  value: unknown,
): value is { type: 'FeatureCollection'; features: unknown[] } {
  if (!isRecord(value) || value['type'] !== 'FeatureCollection') return false;
  return Array.isArray(value['features']);
}

function isGovernorateFeature(
  value: unknown,
): value is Feature<Geometry, GovernorateProperties> {
  if (!isRecord(value) || value['type'] !== 'Feature') return false;
  const properties = value['properties'];
  const geometry = value['geometry'];
  if (!isRecord(properties) || !isRecord(geometry)) return false;
  if (typeof properties['shapeName'] !== 'string') return false;
  return geometry['type'] === 'Polygon' || geometry['type'] === 'MultiPolygon';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function rewindGeometry(geometry: Geometry): Geometry {
  if (geometry.type === 'Polygon') {
    return { type: 'Polygon', coordinates: geometry.coordinates.map(reverseRing) };
  }
  if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map((polygon) => polygon.map(reverseRing)),
    };
  }
  return geometry;
}

function reverseRing(ring: Position[]): Position[] {
  return ring.slice().reverse();
}
