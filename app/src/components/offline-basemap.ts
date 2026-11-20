import type { StyleSpecification } from "maplibre-gl";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries50m from "world-atlas/countries-50m.json";
import { resolveCssColor } from "@/lib/resolve-color";

/* A self-contained base map: land, water and country borders from bundled Natural Earth data.
 * Used when the hosted tile style cannot be reached (offline, or a page whose policy blocks it),
 * so the route map always has a map under the route instead of "Map unavailable". */
export function buildOfflineBasemapStyle(): StyleSpecification {
  const topology = countries50m as unknown as Topology<{ countries: GeometryCollection }>;
  const land = feature(topology, topology.objects.countries);
  const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);

  return {
    version: 8,
    sources: {
      land: { type: "geojson", data: land },
      borders: { type: "geojson", data: { type: "Feature", properties: {}, geometry: borders } },
    },
    layers: [
      { id: "water", type: "background", paint: { "background-color": resolveCssColor("var(--map-water)") } },
      { id: "land", type: "fill", source: "land", paint: { "fill-color": resolveCssColor("var(--map-land)") } },
      { id: "coast", type: "line", source: "land", paint: { "line-color": resolveCssColor("var(--map-coast)"), "line-width": 0.6 } },
      { id: "borders", type: "line", source: "borders", paint: { "line-color": resolveCssColor("var(--map-border)"), "line-width": 0.8 } },
    ],
  };
}
