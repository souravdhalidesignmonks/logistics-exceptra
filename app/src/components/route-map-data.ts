import type { IconSvgElement } from "@hugeicons/react";
import { gazetteer, type LocationKind } from "@/components/location-gazetteer";
import {
  Airplane01Icon,
  ShipIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";

export type RouteMode = "air" | "ocean" | "road";
export type MapCoordinate = { latitude: number; longitude: number };
export type RouteEnd = {
  label: string;
  country: string;
  coordinate: MapCoordinate;
  /** True when the label matched no known location, so it cannot be placed on the map. */
  unresolved?: boolean;
};
export type RouteMapData = {
  mode: RouteMode;
  from: RouteEnd;
  to: RouteEnd;
  waypoints?: MapCoordinate[];
};

export const routeModeById: Record<string, RouteMode> = {
  "EXC-2481": "ocean",
  "EXC-2457": "ocean",
  "EXC-2479": "air",
  "EXC-2476": "air",
  "EXC-2471": "ocean",
  "EXC-2468": "road",
  "EXC-2464": "road",
  "EXC-2461": "ocean",
  "EXC-2459": "road",
  "EXC-2458": "road",
  "EXC-2456": "air",
};

export const routeModeIcon: Record<RouteMode, IconSvgElement> = {
  air: Airplane01Icon,
  ocean: ShipIcon,
  road: TruckIcon,
};

export const routeModeLabel: Record<RouteMode, string> = {
  air: "Air freight",
  ocean: "Ocean vessel",
  road: "Road freight",
};

const cityCoordinates: Record<string, MapCoordinate> = {
  Delhi: { latitude: 28.61, longitude: 77.21 },
  Mumbai: { latitude: 19.08, longitude: 72.88 },
  Bengaluru: { latitude: 12.97, longitude: 77.59 },
  Chennai: { latitude: 13.08, longitude: 80.27 },
  Kolkata: { latitude: 22.57, longitude: 88.36 },
  Tokyo: { latitude: 35.68, longitude: 139.69 },
  Seoul: { latitude: 37.57, longitude: 126.98 },
  Shanghai: { latitude: 31.23, longitude: 121.47 },
  "Hong Kong": { latitude: 22.32, longitude: 114.17 },
  Beijing: { latitude: 39.9, longitude: 116.4 },
  Vancouver: { latitude: 49.28, longitude: -123.12 },
  Seattle: { latitude: 47.61, longitude: -122.33 },
  "Long Beach": { latitude: 33.77, longitude: -118.19 },
  "Los Angeles": { latitude: 34.05, longitude: -118.24 },
  Dallas: { latitude: 32.78, longitude: -96.8 },
  Chicago: { latitude: 41.88, longitude: -87.63 },
  Toronto: { latitude: 43.65, longitude: -79.38 },
  Dubai: { latitude: 25.2, longitude: 55.27 },
  Riyadh: { latitude: 24.71, longitude: 46.67 },
  Jeddah: { latitude: 21.49, longitude: 39.19 },
  London: { latitude: 51.51, longitude: -0.13 },
  "New York": { latitude: 40.71, longitude: -74.01 },
  "Mexico City": { latitude: 19.43, longitude: -99.13 },
  "São Paulo": { latitude: -23.55, longitude: -46.63 },
  Rotterdam: { latitude: 51.92, longitude: 4.48 },
  "Rotterdam Port": { latitude: 51.95, longitude: 4.13 },
  "Port of Chicago": { latitude: 41.733, longitude: -87.528 },
  Hamburg: { latitude: 53.55, longitude: 9.99 },
  "Port of Kobe": { latitude: 34.67, longitude: 135.2 },
  Antwerp: { latitude: 51.22, longitude: 4.4 },
  "Port of Long Beach": { latitude: 33.75, longitude: -118.22 },
  "Port of Seattle": { latitude: 47.6, longitude: -122.34 },
  Paris: { latitude: 48.86, longitude: 2.35 },
  Madrid: { latitude: 40.42, longitude: -3.7 },
  Lyon: { latitude: 45.76, longitude: 4.84 },
  Frankfurt: { latitude: 50.11, longitude: 8.68 },
  Prague: { latitude: 50.08, longitude: 14.44 },
  Milan: { latitude: 45.46, longitude: 9.19 },
  Vienna: { latitude: 48.21, longitude: 16.37 },
  Warsaw: { latitude: 52.23, longitude: 21.01 },
  "Yantian Port": { latitude: 22.58, longitude: 114.27 },
  "Busan New Port": { latitude: 35.0655, longitude: 128.799 },
  Kobe: { latitude: 34.69, longitude: 135.2 },
  Osaka: { latitude: 34.69, longitude: 135.5 },
  Bangkok: { latitude: 13.76, longitude: 100.5 },
  "Kuala Lumpur": { latitude: 3.14, longitude: 101.69 },
  Jakarta: { latitude: -6.21, longitude: 106.85 },
  Busan: { latitude: 35.18, longitude: 129.08 },
  Shenzhen: { latitude: 22.54, longitude: 114.06 },
  Singapore: { latitude: 1.35, longitude: 103.82 },
  Dhaka: { latitude: 23.81, longitude: 90.41 },
};

export const routeLocationOptions = Object.keys(cityCoordinates);

export const routeMapDataById: Record<string, RouteMapData> = {
  "EXC-2481": {
    mode: "ocean",
    from: { label: "Rotterdam Port", country: "Netherlands", coordinate: { latitude: 51.95, longitude: 4.13 } },
    to: { label: "Port of Chicago", country: "United States", coordinate: { latitude: 41.733, longitude: -87.528 } },
    waypoints: [
      { latitude: 51.4, longitude: 2.6 },
      { latitude: 51.0, longitude: 1.5 },
      { latitude: 50.3, longitude: -1.5 },
      { latitude: 49.8, longitude: -5.5 },
      { latitude: 49.5, longitude: -12 },
      { latitude: 47.5, longitude: -30 },
      { latitude: 46, longitude: -45 },
      { latitude: 45.5, longitude: -55 },
      { latitude: 46.8, longitude: -59.6 },
      { latitude: 48.4, longitude: -62.5 },
      { latitude: 49.05, longitude: -64.3 },
      { latitude: 49.4, longitude: -65.5 },
      { latitude: 49.25, longitude: -66.8 },
      { latitude: 48.6, longitude: -68.6 },
      { latitude: 47.8, longitude: -69.7 },
      { latitude: 46.85, longitude: -71.15 },
      { latitude: 46.35, longitude: -72.5 },
      { latitude: 45.55, longitude: -73.5 },
      { latitude: 45.0, longitude: -74.75 },
      { latitude: 44.35, longitude: -75.9 },
      { latitude: 44.0, longitude: -76.6 },
      { latitude: 43.45, longitude: -78.8 },
      { latitude: 43.22, longitude: -79.22 },
      { latitude: 42.88, longitude: -79.25 },
      { latitude: 42.4, longitude: -80.5 },
      { latitude: 42.0, longitude: -82.0 },
      { latitude: 42.05, longitude: -83.1 },
      { latitude: 42.33, longitude: -83.0 },
      { latitude: 42.45, longitude: -82.7 },
      { latitude: 42.98, longitude: -82.42 },
      { latitude: 43.8, longitude: -82.3 },
      { latitude: 45.0, longitude: -82.9 },
      { latitude: 45.75, longitude: -84.0 },
      { latitude: 45.82, longitude: -84.75 },
      { latitude: 45.6, longitude: -86.0 },
      { latitude: 44.5, longitude: -87.0 },
      { latitude: 43.0, longitude: -87.6 },
      { latitude: 42.2, longitude: -87.45 },
    ],
  },
  "EXC-2457": {
    mode: "ocean",
    from: { label: "Port of Kobe", country: "Japan", coordinate: { latitude: 34.67, longitude: 135.2 } },
    to: { label: "Rotterdam Port", country: "Netherlands", coordinate: { latitude: 51.95, longitude: 4.13 } },
    waypoints: [
      { latitude: 34.45, longitude: 135.2 },
      { latitude: 34.27, longitude: 135.03 },
      { latitude: 33.9, longitude: 134.95 },
      { latitude: 33.0, longitude: 134.4 },
      { latitude: 32.5, longitude: 133 },
      { latitude: 31.0, longitude: 131.2 },
      { latitude: 30.8, longitude: 130.75 },
      { latitude: 30.6, longitude: 129.8 },
      { latitude: 29.5, longitude: 128.5 },
      { latitude: 28, longitude: 127 },
      { latitude: 24.5, longitude: 124.5 },
      { latitude: 21.0, longitude: 121.0 },
      { latitude: 18, longitude: 116 },
      { latitude: 12, longitude: 111 },
      { latitude: 6, longitude: 106 },
      { latitude: 2.5, longitude: 104.8 },
      { latitude: 1.45, longitude: 104.5 },
      { latitude: 1.25, longitude: 104.3 },
      { latitude: 1.18, longitude: 103.9 },
      { latitude: 1.15, longitude: 103.6 },
      { latitude: 1.6, longitude: 102.9 },
      { latitude: 2.2, longitude: 102.0 },
      { latitude: 2.8, longitude: 101.0 },
      { latitude: 5.5, longitude: 97.8 },
      { latitude: 6.2, longitude: 97.0 },
      { latitude: 6.2, longitude: 95.0 },
      { latitude: 6.0, longitude: 94.0 },
      { latitude: 5.5, longitude: 82 },
      { latitude: 5.6, longitude: 80.6 },
      { latitude: 7, longitude: 76 },
      { latitude: 10, longitude: 65 },
      { latitude: 13.3, longitude: 54 },
      { latitude: 12.9, longitude: 51.0 },
      { latitude: 12.6, longitude: 45 },
      { latitude: 12.6, longitude: 43.4 },
      { latitude: 15, longitude: 41.8 },
      { latitude: 20, longitude: 38.6 },
      { latitude: 24.5, longitude: 36 },
      { latitude: 27.7, longitude: 33.85 },
      { latitude: 28.0, longitude: 33.5 },
      { latitude: 28.6, longitude: 33.0 },
      { latitude: 29.2, longitude: 32.75 },
      { latitude: 29.9, longitude: 32.55 },
      { latitude: 31.3, longitude: 32.35 },
      { latitude: 31.6, longitude: 32.4 },
      { latitude: 33.0, longitude: 30 },
      { latitude: 33.5, longitude: 27 },
      { latitude: 34.5, longitude: 23 },
      { latitude: 35.8, longitude: 18 },
      { latitude: 36.6, longitude: 12.5 },
      { latitude: 37.05, longitude: 11.6 },
      { latitude: 37.6, longitude: 10 },
      { latitude: 37.5, longitude: 3 },
      { latitude: 36.1, longitude: -2.5 },
      { latitude: 35.95, longitude: -5.6 },
      { latitude: 36.5, longitude: -9.5 },
      { latitude: 41, longitude: -10 },
      { latitude: 43.5, longitude: -9.8 },
      { latitude: 46.5, longitude: -7 },
      { latitude: 48.8, longitude: -5.7 },
      { latitude: 49.8, longitude: -3 },
      { latitude: 50.5, longitude: 0 },
      { latitude: 51.05, longitude: 1.6 },
      { latitude: 51.6, longitude: 3.2 },
    ],
  },
  "EXC-2471": {
    mode: "ocean",
    from: { label: "Yantian Port", country: "China", coordinate: { latitude: 22.58, longitude: 114.27 } },
    to: { label: "Port of Long Beach", country: "United States", coordinate: { latitude: 33.75, longitude: -118.22 } },
    waypoints: [
      { latitude: 22.0, longitude: 115.5 },
      { latitude: 21.0, longitude: 120.9 },
      { latitude: 24, longitude: 126 },
      { latitude: 28, longitude: 140 },
      { latitude: 31, longitude: 160 },
      { latitude: 32, longitude: 179 },
      { latitude: 32, longitude: -179 },
      { latitude: 33, longitude: -155 },
      { latitude: 34, longitude: -135 },
      { latitude: 33.6, longitude: -119.5 },
    ],
  },
  "EXC-2461": {
    mode: "ocean",
    from: { label: "Busan New Port", country: "South Korea", coordinate: { latitude: 35.0655, longitude: 128.799 } },
    to: { label: "Port of Seattle", country: "United States", coordinate: { latitude: 47.6, longitude: -122.34 } },
    waypoints: [
      { latitude: 34.9, longitude: 129.0 },
      { latitude: 34.95, longitude: 129.6 },
      { latitude: 35.6, longitude: 131.5 },
      { latitude: 39.5, longitude: 136.5 },
      { latitude: 41.3, longitude: 139.6 },
      { latitude: 41.35, longitude: 140.25 },
      { latitude: 41.65, longitude: 140.9 },
      { latitude: 41.6, longitude: 141.5 },
      { latitude: 42, longitude: 146 },
      { latitude: 44, longitude: 156 },
      { latitude: 46.5, longitude: 168 },
      { latitude: 48, longitude: 179 },
      { latitude: 48, longitude: -179 },
      { latitude: 49, longitude: -160 },
      { latitude: 48.5, longitude: -140 },
      { latitude: 48.45, longitude: -125.0 },
      { latitude: 48.45, longitude: -124.75 },
      { latitude: 48.3, longitude: -124.0 },
      { latitude: 48.25, longitude: -123.4 },
      { latitude: 48.15, longitude: -122.8 },
      { latitude: 47.95, longitude: -122.6 },
      { latitude: 47.75, longitude: -122.45 },
    ],
  },
  "EXC-2479": {
    mode: "air",
    from: { label: "Singapore Changi Airport", country: "Singapore", coordinate: { latitude: 1.3644, longitude: 103.9915 } },
    to: { label: "Frankfurt Airport", country: "Germany", coordinate: { latitude: 50.0379, longitude: 8.5622 } },
  },
  "EXC-2476": {
    mode: "air",
    from: { label: "Hazrat Shahjalal Airport", country: "Bangladesh", coordinate: { latitude: 23.8433, longitude: 90.3978 } },
    to: { label: "Toronto Pearson Airport", country: "Canada", coordinate: { latitude: 43.6777, longitude: -79.6248 } },
  },
  "EXC-2468": {
    mode: "road",
    from: { label: "Hamburg", country: "Germany", coordinate: { latitude: 53.55, longitude: 9.99 } },
    to: { label: "Prague", country: "Czechia", coordinate: { latitude: 50.08, longitude: 14.44 } },
  },
  "EXC-2464": {
    mode: "road",
    from: { label: "Antwerp", country: "Belgium", coordinate: { latitude: 51.22, longitude: 4.4 } },
    to: { label: "Lyon", country: "France", coordinate: { latitude: 45.76, longitude: 4.84 } },
  },
  "EXC-2459": {
    mode: "road",
    from: { label: "Paris", country: "France", coordinate: { latitude: 48.86, longitude: 2.35 } },
    to: { label: "Madrid", country: "Spain", coordinate: { latitude: 40.42, longitude: -3.7 } },
  },
  "EXC-2458": {
    mode: "road",
    from: { label: "Los Angeles", country: "United States", coordinate: { latitude: 34.05, longitude: -118.24 } },
    to: { label: "Dallas", country: "United States", coordinate: { latitude: 32.78, longitude: -96.8 } },
  },
  "EXC-2456": {
    mode: "air",
    from: { label: "Kansai International Airport", country: "Japan", coordinate: { latitude: 34.4347, longitude: 135.244 } },
    to: { label: "Vancouver International Airport", country: "Canada", coordinate: { latitude: 49.1967, longitude: -123.1815 } },
  },
};

export type KnownLocation = {
  label: string;
  kind: LocationKind;
  country: string;
  coordinate: MapCoordinate;
  keywords: string;
};

const kindForLegacyLabel = (label: string): LocationKind => (/\bPort\b|^Port of /.test(label) ? "port" : "city");

const distanceKm = (a: MapCoordinate, b: MapCoordinate) => {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.latitude - a.latitude) * r) / 2) ** 2 +
    Math.cos(a.latitude * r) * Math.cos(b.latitude * r) * Math.sin(((b.longitude - a.longitude) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

/* The country of a hand-placed location: the nearest gazetteer entry within 60 km. */
const countryNear = (coordinate: MapCoordinate) => {
  let best: { country: string; distance: number } | null = null;
  for (const [, , country, latitude, longitude] of gazetteer) {
    const distance = distanceKm(coordinate, { latitude, longitude });
    if (distance < 60 && (!best || distance < best.distance)) best = { country, distance };
  }
  return best?.country ?? "";
};

/* The original, verified list and the queue's own route ends come first, so their labels and
   positions always win over the gazetteer. */
const routeEnds = Object.values(routeMapDataById).flatMap((route) =>
  [route.from, route.to].map((end) => ({
    label: end.label,
    kind: (route.mode === "air" ? "airport" : route.mode === "ocean" ? "port" : "city") as LocationKind,
    country: end.country,
    coordinate: end.coordinate,
    keywords: "",
  })),
);
const handPlaced: KnownLocation[] = [
  ...Object.entries(cityCoordinates).map(([label, coordinate]) => ({
    label,
    kind: kindForLegacyLabel(label),
    country: countryNear(coordinate),
    coordinate,
    keywords: "",
  })),
  ...routeEnds,
];
/* Skip gazetteer entries that are the same place as a hand-placed one (same kind, within 3 km),
   so "Singapore Changi Airport" isn't offered twice. */
const gazetteerLocations: KnownLocation[] = gazetteer.map(([label, kind, country, latitude, longitude, keywords]) => ({
  label,
  kind,
  country,
  coordinate: { latitude, longitude },
  keywords,
}));
const knownLocations: KnownLocation[] = [
  ...handPlaced,
  ...gazetteerLocations.filter(
      (entry) =>
        !handPlaced.some(
          (placed) => placed.kind === entry.kind && distanceKm(placed.coordinate, entry.coordinate) < 3,
        ),
    ),
];

const normalise = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

/* Lookups also accept the skipped duplicates, so typing "Singapore Changi Airport (SIN)" or "SIN" still resolves. */
const allLocations = [...knownLocations, ...gazetteerLocations];
const locationByLabel = new Map<string, KnownLocation>();
for (const location of allLocations) {
  const key = normalise(location.label);
  if (!locationByLabel.has(key)) locationByLabel.set(key, location);
}
const locationByCode = new Map<string, KnownLocation>();
for (const location of allLocations) {
  const code = /\(([A-Z]{3})\)$/.exec(location.label)?.[1];
  if (code && !locationByCode.has(code)) locationByCode.set(code, location);
}

/** Finds a location by its label (any case or accents), or by a three-letter airport code such as "DAC". */
export function findLocation(value: string): KnownLocation | null {
  const query = value.trim();
  if (!query) return null;
  return locationByLabel.get(normalise(query)) ?? locationByCode.get(query.toUpperCase()) ?? null;
}

const kindLabel: Record<LocationKind, string> = { port: "Port", airport: "Airport", city: "City" };

/** A short line under a suggestion: what kind of place it is, and where. */
export function describeLocation(label: string): string | undefined {
  const location = findLocation(label);
  if (!location) return undefined;
  return [kindLabel[location.kind], location.country].filter(Boolean).join(" · ");
}

/**
 * Ranked suggestions for the New exception form. Matches the start of the name first, then the start
 * of any word, then airport codes, cities served and other search words, then anywhere in the name.
 */
export function searchLocations(query: string, extraLabels: string[] = [], limit = 6): string[] {
  const q = normalise(query);
  const labels = Array.from(new Set([...knownLocations.map((location) => location.label), ...extraLabels]));
  if (!q) return labels.slice(0, limit);
  const scored: [number, number, string][] = [];
  labels.forEach((label, order) => {
    const name = normalise(label);
    const words = normalise(`${findLocation(label)?.keywords ?? ""}`).split(" ");
    let score = -1;
    if (name.startsWith(q)) score = 0;
    else if (name.split(/[\s,()/-]+/).some((word) => word.startsWith(q))) score = 1;
    else if (words.some((word) => word && word.startsWith(q))) score = 2;
    else if (name.includes(q)) score = 3;
    if (score >= 0) scored.push([score, order, label]);
  });
  /* Matches in the middle of a word only fill in when nothing better was found. */
  const best = scored.some(([score]) => score < 3) ? scored.filter(([score]) => score < 3) : scored;
  return best
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .slice(0, limit)
    .map(([, , label]) => label);
}

const routeEnd = (label: string, fallbackCountry: string): RouteEnd => {
  const location = findLocation(label);
  if (!location) return { label, country: fallbackCountry, coordinate: { latitude: 0, longitude: 0 }, unresolved: true };
  return { label: location.label, country: location.country || fallbackCountry, coordinate: location.coordinate };
};

export function fallbackRouteMapData(from: string, to: string, mode: RouteMode): RouteMapData {
  return {
    mode,
    from: routeEnd(from, "Origin"),
    to: routeEnd(to, "Destination"),
  };
}

/**
 * Adapts the current fixture shape to the canonical route model used by the UI.
 * An API response that already includes `route` can skip this adapter entirely.
 */
export function resolveRouteData(
  id: string,
  route: string,
  fallbackMode: RouteMode = "road",
): RouteMapData {
  const [from, to] = route.split(" → ");
  return routeMapDataById[id] ?? fallbackRouteMapData(from, to, fallbackMode);
}
