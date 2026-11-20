import { useEffect, useMemo, useRef, useState } from "react";
import { LngLatBounds, Map as MapLibreMap, setWorkerUrl, type GeoJSONSource, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapLibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Gps01Icon,
  MinusSignIcon,
  Navigation03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { resolveCssColor } from "@/lib/resolve-color";
import {
  routeModeIcon,
  routeModeLabel,
  type MapCoordinate,
  type RouteMapData,
} from "@/components/route-map-data";

setWorkerUrl(mapLibreWorkerUrl);

const openFreeMapStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

type ProjectedMapPoint = {
  left: string;
  top: string;
  visible: boolean;
  tooltipPlacement: "above" | "below" | "left" | "right";
  tooltipOffset: number;
};

const coordinateToLngLat = ({ latitude, longitude }: MapCoordinate): [number, number] => [longitude, latitude];

const getThemePrimaryColor = () => resolveCssColor("var(--brand-deep)");

/* Points along the great circle between two coordinates: the path a plane actually flies. */
const greatCircle = (a: MapCoordinate, b: MapCoordinate, steps = 64): [number, number][] => {
  const toRad = Math.PI / 180;
  const [lat1, lon1, lat2, lon2] = [a.latitude * toRad, a.longitude * toRad, b.latitude * toRad, b.longitude * toRad];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2));
  if (d === 0) return [coordinateToLngLat(a), coordinateToLngLat(b)];
  return Array.from({ length: steps + 1 }, (_, step) => {
    const f = step / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    return [Math.atan2(y, x) / toRad, Math.atan2(z, Math.hypot(x, y)) / toRad] as [number, number];
  });
};

/* Keep each longitude within 180° of the previous one, so a route that crosses the
   date line (e.g. Busan → Seattle) continues across the Pacific instead of jumping back across the whole map. */
const unwrapLongitudes = (coordinates: [number, number][]): [number, number][] =>
  coordinates.reduce<[number, number][]>((out, [longitude, latitude]) => {
    const previous = out[out.length - 1];
    let next = longitude;
    if (previous) {
      while (next - previous[0] > 180) next -= 360;
      while (next - previous[0] < -180) next += 360;
    }
    out.push([next, latitude]);
    return out;
  }, []);

const buildFallbackRoute = (route: RouteMapData): [number, number][] => {
  if (route.mode === "air" && !route.waypoints?.length) {
    return unwrapLongitudes(greatCircle(route.from.coordinate, route.to.coordinate));
  }
  const unwrapped = unwrapLongitudes(
    [route.from.coordinate, ...(route.waypoints ?? []), route.to.coordinate].map(coordinateToLngLat),
  );
  const points = unwrapped.map(([longitude, latitude]) => ({ latitude, longitude }));
  const linear = points.flatMap((point, index) => {
    if (index === points.length - 1) return [coordinateToLngLat(point)];
    const next = points[index + 1];
    return Array.from({ length: 10 }, (_, step) => {
      const progress = step / 10;
      return [
        point.longitude + (next.longitude - point.longitude) * progress,
        point.latitude + (next.latitude - point.latitude) * progress,
      ] as [number, number];
    });
  });
  return unwrapLongitudes(linear);
};

const getRouteProgressPoint = (
  coordinates: [number, number][],
  progress: number,
): MapCoordinate => {
  const [longitude, latitude] =
    coordinates[Math.floor((coordinates.length - 1) * progress)] ?? coordinates[0];

  return { latitude, longitude };
};

export function RouteMapDialog({
  selectedId,
  routeData,
}: {
  selectedId: string;
  routeData: RouteMapData;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const fitRouteRef = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const [mapPoints, setMapPoints] = useState<{
    from: ProjectedMapPoint;
    to: ProjectedMapPoint;
    current: ProjectedMapPoint;
  } | null>(null);
  const [projectedRoutePoints, setProjectedRoutePoints] = useState<string>("");
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error" | "unresolved">("loading");
  const mapRoute = useMemo(() => routeData, [routeData]);
  const mode = mapRoute.mode;
  const currentProgress = 0.52;
  const projectedFromPoint = mapPoints?.from;
  const projectedToPoint = mapPoints?.to;
  const projectedCurrentPoint = mapPoints?.current;

  const unresolvedLabels = [mapRoute.from, mapRoute.to].filter((end) => end.unresolved).map((end) => end.label);

  useEffect(() => {
    if (!open) return;
    if (mapRoute.from.unresolved || mapRoute.to.unresolved) {
      const frame = window.setTimeout(() => setMapStatus("unresolved"), 0);
      return () => window.clearTimeout(frame);
    }

    let styleLoaded = false;
    const lifecycle = { disposed: false, usingOfflineBasemap: false };

    /* The hosted tile style can be unreachable (offline, or a host whose content policy blocks it).
       Rather than show "Map unavailable", rebuild the same map on a bundled offline base map. */
    const switchToOfflineBasemap = () => {
      if (lifecycle.usingOfflineBasemap || styleLoaded || lifecycle.disposed) return;
      lifecycle.usingOfflineBasemap = true;
      mapRef.current?.remove();
      mapRef.current = null;
      void import("@/components/offline-basemap")
        .then(({ buildOfflineBasemapStyle }) => {
          if (!lifecycle.disposed) initializeMap(buildOfflineBasemapStyle());
        })
        .catch(() => setMapStatus("error"));
    };

    const initializeMap = (style: string | StyleSpecification = openFreeMapStyleUrl) => {
      if (!mapContainerRef.current) return;
      setMapStatus("loading");

      let routeCoordinates = buildFallbackRoute(mapRoute);
      /* Markers sit on the route's own (unwrapped) ends, so they stay on the line across the date line. */
      const endpoint = ([longitude, latitude]: [number, number]): MapCoordinate => ({ latitude, longitude });
      let from = endpoint(routeCoordinates[0]);
      let to = endpoint(routeCoordinates[routeCoordinates.length - 1]);

      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style,
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
      });
      mapRef.current = map;
      const routeColor = getThemePrimaryColor();
      let current = getRouteProgressPoint(routeCoordinates, currentProgress);

      const fitRoute = (duration = 0) => {
        const bounds = new LngLatBounds();
        routeCoordinates.forEach(([longitude, latitude]) => bounds.extend([longitude, latitude]));
        const narrow = map.getContainer().clientWidth < 520;
        map.fitBounds(bounds, {
          padding: narrow ? { top: 60, bottom: 40, left: 40, right: 64 } : { top: 80, bottom: 70, left: 90, right: 120 },
          maxZoom: 5,
          duration,
        });
      };
      fitRouteRef.current = () => fitRoute(300);

      const updatePoints = () => {
        const activeMap = mapRef.current;
        if (!activeMap) return;
        /* A date-line route runs past ±180°, but the camera shows one copy of the world.
           Shift the whole route by whole turns of 360° onto the copy that is centred on screen. */
        const longitudes = routeCoordinates.map(([longitude]) => longitude);
        const routeMiddle = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
        const middleLatitude = routeCoordinates[Math.floor(routeCoordinates.length / 2)]?.[1] ?? 0;
        const centreX = (activeMap.getContainer().clientWidth || 1) / 2;
        const offCentre = (shift: number) =>
          Math.abs(activeMap.project([routeMiddle + shift, middleLatitude]).x - centreX);
        const worldShift = [-720, -360, 0, 360, 720].reduce((best, shift) =>
          offCentre(shift) < offCentre(best) ? shift : best,
        0);
        const project = (point: { latitude: number; longitude: number }): ProjectedMapPoint => {
          const projected = activeMap.project([point.longitude + worldShift, point.latitude]);
          const container = activeMap.getContainer();
          const width = container.clientWidth || 1;
          const height = container.clientHeight || 1;
          return {
            left: `${projected.x}px`,
            top: `${projected.y}px`,
            visible: projected.x >= 0 && projected.x <= width && projected.y >= 0 && projected.y <= height,
            tooltipPlacement:
              projected.x > width - 220
                ? "left"
                : projected.x < 120
                  ? "right"
                  : projected.y < 100
                    ? "below"
                    : "above",
            tooltipOffset: Math.max(12, projected.x - (width - 78) + 12),
          };
        };

        setMapPoints({ from: project(from), to: project(to), current: project(current) });
        setProjectedRoutePoints(
          routeCoordinates
            .map(([longitude, latitude]) => {
              const projected = activeMap.project([longitude + worldShift, latitude]);
              return `${projected.x},${projected.y}`;
            })
            .join(" "),
        );
      };

      map.on("load", () => {
        styleLoaded = true;
        setMapStatus("ready");
        map.addSource("exception-route", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: routeCoordinates } },
        });
        map.addLayer({
          id: "exception-route-line",
          type: "line",
          source: "exception-route",
          paint: { "line-color": routeColor, "line-width": 4, "line-opacity": 0.95 },
        });
        fitRoute();
        updatePoints();
        requestAnimationFrame(updatePoints);
        map.once("idle", updatePoints);

        if (mapRoute.mode === "road") {
          const coordinates = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;
          void fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`)
            .then((response) => (response.ok ? response.json() : null))
            .then((payload: { routes?: Array<{ geometry?: { coordinates?: [number, number][] } }> } | null) => {
              const roadGeometry = payload?.routes?.[0]?.geometry?.coordinates;
              if (!roadGeometry?.length || !mapRef.current) return;
              routeCoordinates = unwrapLongitudes(roadGeometry);
              from = endpoint(routeCoordinates[0]);
              to = endpoint(routeCoordinates[routeCoordinates.length - 1]);
              current = getRouteProgressPoint(routeCoordinates, currentProgress);
              const source = mapRef.current.getSource("exception-route") as GeoJSONSource | undefined;
              source?.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: routeCoordinates } });
              fitRoute();
              updatePoints();
              requestAnimationFrame(updatePoints);
            })
            .catch(() => {
              // Keep the deterministic fallback route when the public router is unavailable.
            });
        }
      });
      map.on("error", () => {
        if (styleLoaded) return;
        if (lifecycle.usingOfflineBasemap) setMapStatus("error");
        else switchToOfflineBasemap();
      });
      map.on("move", updatePoints);
      map.on("moveend", updatePoints);
      map.on("resize", updatePoints);
    };

    const frame = window.setTimeout(() => initializeMap(), 100);
    const loadingTimeout = window.setTimeout(() => {
      if (styleLoaded) return;
      if (lifecycle.usingOfflineBasemap) setMapStatus("error");
      else switchToOfflineBasemap();
    }, 8000);
    return () => {
      lifecycle.disposed = true;
      window.clearTimeout(frame);
      window.clearTimeout(loadingTimeout);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapRoute, open]);

  const tooltipStyle = (point: ProjectedMapPoint) => ({
    left: point.left,
    top: point.top,
    transform:
      point.tooltipPlacement === "left"
        ? `translate(calc(-100% - ${point.tooltipOffset}px), -50%)`
        : point.tooltipPlacement === "right"
          ? "translate(0.75rem, -50%)"
        : point.tooltipPlacement === "below"
          ? "translate(-50%, 0.75rem)"
          : "translate(-50%, calc(-100% - 0.75rem))",
    transformOrigin: "center bottom",
    willChange: "left, top",
  });

  const tooltipArrowClass = (point: ProjectedMapPoint) =>
    point.tooltipPlacement === "left"
      ? "absolute right-[-4px] top-1/2 size-2 -translate-y-1/2 rotate-45 bg-foreground"
      : point.tooltipPlacement === "right"
        ? "absolute left-[-4px] top-1/2 size-2 -translate-y-1/2 rotate-45 bg-foreground"
      : point.tooltipPlacement === "below"
        ? "absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground"
        : "absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="group inline-flex max-w-full cursor-pointer flex-wrap items-center gap-1 leading-6 outline-none focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/30" aria-label={`Open live route map from ${mapRoute.from.label} to ${mapRoute.to.label}`}>
          <span className="inline-flex size-5 shrink-0 items-center justify-center">
            <HugeiconsIcon icon={Navigation03Icon} className="size-4 text-brand-deep transition-colors group-hover:text-brand" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="text-base font-medium text-brand-deep transition-colors group-hover:text-brand">Route</span>
          <span className="ml-1 text-foreground">{mapRoute.from.label}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden="true" />
          <span className="text-foreground">{mapRoute.to.label}</span>
        </button>
      </DialogTrigger>
      <DialogContent forceMount className="max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="space-y-1">
            <DialogTitle>Live route tracking</DialogTitle>
            <DialogDescription>{selectedId} · {mapRoute.from.label} to {mapRoute.to.label}</DialogDescription>
          </div>
          <DialogClose asChild>
            <Button type="button" variant="ghost" size="icon-sm" className="-mr-2 -mt-1 rounded-full" aria-label="Close route map">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="relative min-h-[22rem] overflow-hidden bg-background p-0">
            <div ref={mapContainerRef} className="absolute inset-0 min-h-[22rem]" role="img" aria-label={`Live route from ${mapRoute.from.label} to ${mapRoute.to.label}`} />
            {projectedRoutePoints && <svg className="pointer-events-none absolute inset-0 size-full text-brand" aria-hidden="true"><polyline points={projectedRoutePoints} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /></svg>}
            {projectedCurrentPoint?.visible && (
              <div className="pointer-events-none absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background bg-brand-deep shadow-float" style={{ left: projectedCurrentPoint.left, top: projectedCurrentPoint.top }} aria-label={`Current ${routeModeLabel[mode].toLowerCase()} position`}>
                <HugeiconsIcon icon={routeModeIcon[mode]} className="size-5 text-primary-foreground" strokeWidth={2} />
              </div>
            )}
            {projectedFromPoint?.visible && <div className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-background bg-foreground shadow-float" style={{ left: projectedFromPoint.left, top: projectedFromPoint.top }} aria-hidden="true" />}
            {projectedToPoint?.visible && <div className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand-deep bg-background shadow-float" style={{ left: projectedToPoint.left, top: projectedToPoint.top }} aria-hidden="true" />}
            <div className="absolute right-7 top-7 flex flex-col overflow-hidden rounded-2xl bg-popover shadow-float">
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-none" aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()}><HugeiconsIcon icon={Add01Icon} strokeWidth={2} /></Button>
              <Separator orientation="horizontal" />
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-none" aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()}><HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} /></Button>
              <Separator orientation="horizontal" />
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-none" aria-label="Center route" onClick={() => fitRouteRef.current?.()}><HugeiconsIcon icon={Gps01Icon} strokeWidth={2} /></Button>
            </div>
            {projectedFromPoint?.visible && <div className="pointer-events-none absolute rounded-xl bg-foreground px-3 py-1.5 text-xs text-background shadow-float" style={tooltipStyle(projectedFromPoint)}><span className="mr-1 text-background/60">FROM</span><span className="font-medium">{mapRoute.from.label}</span><span className={tooltipArrowClass(projectedFromPoint)} /></div>}
            {projectedToPoint?.visible && <div className="pointer-events-none absolute rounded-xl bg-foreground px-3 py-1.5 text-xs text-background shadow-float" style={tooltipStyle(projectedToPoint)}><span className="mr-1 text-background/60">TO</span><span className="font-medium">{mapRoute.to.label}</span><span className={tooltipArrowClass(projectedToPoint)} /></div>}
            <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full bg-popover/95 px-3 py-1.5 text-xs font-medium shadow-float backdrop-blur"><span className="size-2 animate-pulse rounded-full bg-brand" />Live · updated 2m ago</div>
            {mapStatus === "loading" && <div className="absolute inset-0 flex items-center justify-center bg-background/40 text-sm text-muted-foreground backdrop-blur-[1px]">Loading map…</div>}
            {mapStatus === "unresolved" && <div className="absolute inset-0 flex items-center justify-center bg-background p-6 text-center text-sm text-muted-foreground">{`Can’t place ${unresolvedLabels.map((label) => `“${label}”`).join(" and ")} on the map. Use a location from the suggestions when you log an exception.`}</div>}
            {mapStatus === "error" && <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-6 text-center text-sm text-muted-foreground">Map unavailable. Route details remain available in the panel.</div>}
          </div>
          <div className="space-y-5 border-t p-6 lg:border-t-0 lg:border-l">
            <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipment status</p><div className="mt-2 flex items-center gap-2"><span className="size-2 rounded-full bg-brand" /><span className="font-medium">In transit</span></div></div>
            <Separator />
            <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-background"><HugeiconsIcon icon={routeModeIcon[mode]} className="size-5" strokeWidth={2} /></div><div><p className="text-sm font-medium">{routeModeLabel[mode]}</p><p className="text-xs text-muted-foreground">{selectedId} shipment</p></div></div>
            <div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-muted-foreground">Current location</p><p className="mt-1 font-medium">Mid-route</p></div><div><p className="text-muted-foreground">ETA</p><p className="mt-1 whitespace-nowrap font-medium">Tomorrow · 08:40</p></div></div>
            <div><p className="text-sm text-muted-foreground">Route progress</p><div className="mt-2 h-3 overflow-hidden rounded-full bg-muted"><div className="hatch-light h-full w-[52%] rounded-full bg-brand" /></div><div className="mt-1 flex justify-between gap-2 text-xs text-muted-foreground"><span className="min-w-0 truncate">{mapRoute.from.label}</span><span>52%</span><span className="min-w-0 truncate text-right">{mapRoute.to.label}</span></div></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
