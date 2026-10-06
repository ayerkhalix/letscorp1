"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type * as Leaflet from "leaflet";
import { MapPin, Star, X, LocateFixed } from "lucide-react";
import type { Business } from "@/types";
import { MapFallback } from "./map-fallback";
export function AppMap({
  items,
  focus,
  compact = false,
}: {
  items: Business[];
  focus?: string;
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const lib = useRef<typeof Leaflet | null>(null);
  const markers = useRef<Leaflet.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"live" | "fallback">(
    process.env.NEXT_PUBLIC_MAP_MODE === "fallback" ? "fallback" : "live",
  );
  const [selected, setSelected] = useState<string | null>(focus || null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let disposed = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (mode === "fallback") return;
    import("leaflet")
      .then((L) => {
        if (disposed || !root.current) return;
        lib.current = L;
        const m = L.map(root.current, {
          zoomControl: !compact,
          scrollWheelZoom: !compact,
          attributionControl: true,
          zoomAnimation: false,
          fadeAnimation: false,
          markerZoomAnimation: false,
        }).setView([9.7558, 118.746], 13);
        map.current = m;
        markers.current = L.layerGroup().addTo(m);
        const tiles = L.tileLayer(
          process.env.NEXT_PUBLIC_MAP_TILE_URL ||
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ||
              '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
            maxZoom: 19,
          },
        );
        let successes = 0;
        tiles.on("tileload", () => {
          successes++;
          setLoaded(true);
        });
        tiles.addTo(m);
        timeout = setTimeout(() => {
          if (!successes) setMode("fallback");
        }, 9000);
        L.circleMarker([9.7558, 118.746], {
          radius: 8,
          color: "white",
          weight: 3,
          fillColor: "#47789d",
          fillOpacity: 1,
        })
          .addTo(m)
          .bindTooltip("Demo current location");
        setReady(true);
        const observer = new ResizeObserver(() => m.invalidateSize());
        observer.observe(root.current);
        (
          m as Leaflet.Map & { resizeObserver?: ResizeObserver }
        ).resizeObserver = observer;
      })
      .catch(() => setMode("fallback"));
    return () => {
      disposed = true;
      if (timeout) clearTimeout(timeout);
      if (map.current) {
        (
          map.current as Leaflet.Map & { resizeObserver?: ResizeObserver }
        ).resizeObserver?.disconnect();
        map.current.stop();
        map.current.remove();
        map.current = null;
      }
      setReady(false);
    };
  }, [mode, compact]);
  useEffect(() => {
    if (!ready || !map.current || !lib.current || !markers.current) return;
    const L = lib.current;
    markers.current.clearLayers();
    items.forEach((b) => {
      const icon = L.divIcon({
        className: "business-map-icon",
        html: `<span class="live-marker ${selected === b.id ? "selected" : ""}">${b.kind === "travel" ? "✳" : b.initials}</span>`,
        iconSize: [38, 44],
        iconAnchor: [19, 40],
      });
      L.marker([b.latitude, b.longitude], {
        icon,
        alt: b.name,
        keyboard: true,
        title: b.name,
      })
        .addTo(markers.current!)
        .on("click", () => setSelected(b.id));
    });
    if (items.length && !focus && !selected)
      map.current.fitBounds(
        L.latLngBounds(items.map((b) => [b.latitude, b.longitude])),
        { padding: [35, 35], maxZoom: 14 },
      );
  }, [items, ready, selected, focus]);
  useEffect(() => {
    if (focus) setSelected(focus);
  }, [focus]);
  useEffect(() => {
    const b = items.find((x) => x.id === selected);
    if (b && ready && map.current)
      map.current.flyTo([b.latitude, b.longitude], compact ? 13 : 15, {
        duration: 0.5,
      });
  }, [selected, ready, items, compact]);
  const b = items.find((x) => x.id === selected);
  return (
    <div
      className={`app-map ${compact ? "compact-map" : ""}`}
      aria-label="Interactive business map"
    >
      <div
        className="leaflet-root"
        ref={root}
        style={{ display: mode === "live" ? "block" : "none" }}
      />
      {mode === "fallback" && (
        <MapFallback items={items} selected={selected} onSelect={setSelected} />
      )}
      <div className="map-top-label">
        <MapPin size={13} />
        {mode === "fallback"
          ? "Offline map preview"
          : "Explore Puerto Princesa"}
      </div>
      {mode === "live" && !loaded && (
        <div className="map-loading">
          <span className="spinner" />
          Finding your neighborhood…
        </div>
      )}
      {mode === "live" && (
        <button
          className="recenter-control"
          aria-label="Recenter map"
          onClick={() => {
            setSelected(null);
            map.current?.setView([9.7558, 118.746], 13);
          }}
        >
          <LocateFixed size={19} />
        </button>
      )}
      <button
        className="map-mode"
        onClick={() => {
          setMode(mode === "live" ? "fallback" : "live");
          setLoaded(false);
        }}
      >
        {mode === "live" ? "Offline preview" : "Try live map"}
      </button>
      {b && (
        <div className="map-preview">
          <Link href={`/business/${b.id}/`}>
            <img src={b.image} alt={b.name} />
            <div>
              <span className="small muted">{b.category}</span>
              <h3>{b.name}</h3>
              <p>
                <Star size={12} fill="currentColor" className="star" />
                {b.rating} · {b.address.split(",")[0]}
              </p>
              <strong>View business</strong>
            </div>
          </Link>
          <button
            aria-label="Close business preview"
            onClick={() => setSelected(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
