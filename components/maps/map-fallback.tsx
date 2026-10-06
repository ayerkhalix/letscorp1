"use client";
import { useMemo, useRef, useState } from "react";
import { Minus, Plus, LocateFixed, MapPin } from "lucide-react";
import type { Business } from "@/types";
export function MapFallback({
  items,
  selected,
  onSelect,
}: {
  items: Business[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  const points = useMemo(() => {
    // The offline map is a city schematic: spread close neighbors so every
    // business remains selectable. Out-of-city travel providers sit at its edge.
    const points: { b: Business; x: number; y: number }[] = [];
    items.forEach((b) => {
      const baseX = Math.max(
        15,
        Math.min(85, 15 + ((b.longitude - 118.72) / 0.06) * 70),
      );
      const baseY = Math.max(
        18,
        Math.min(80, 18 + ((9.8 - b.latitude) / 0.08) * 62),
      );
      let best = { x: baseX, y: baseY, score: -1 };
      for (let attempt = 0; attempt < 120; attempt++) {
        const angle = attempt * 2.39996;
        const radius = attempt === 0 ? 0 : 3.5 * Math.sqrt(attempt);
        const x = Math.max(15, Math.min(85, baseX + Math.cos(angle) * radius));
        const y = Math.max(
          18,
          Math.min(80, baseY + Math.sin(angle) * radius * 0.72),
        );
        const score = points.length
          ? Math.min(
              ...points.map((p) => Math.hypot((p.x - x) / 11, (p.y - y) / 9)),
            )
          : 2;
        if (score > best.score) best = { x, y, score };
        if (score >= 1.05) break;
      }
      points.push({ b, x: best.x, y: best.y });
    });
    return points;
  }, [items]);
  return (
    <div
      className="fallback-map"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        drag.current = {
          x: e.clientX,
          y: e.clientY,
          ox: offset.x,
          oy: offset.y,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (drag.current)
          setOffset({
            x: drag.current.ox + e.clientX - drag.current.x,
            y: drag.current.oy + e.clientY - drag.current.y,
          });
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
    >
      <div
        className="fallback-surface"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        }}
      >
        <svg
          className="map-road-network"
          viewBox="0 0 800 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect width="800" height="500" fill="#edf0e5" />
          <path
            d="M660 0L625 120 662 260 617 375 650 500H800V0Z"
            fill="#b8dce6"
          />
          <g fill="#dee6d1">
            <rect x="55" y="50" width="115" height="90" rx="12" />
            <rect x="285" y="245" width="95" height="65" rx="8" />
            <rect x="440" y="40" width="96" height="90" rx="8" />
            <rect x="40" y="340" width="125" height="90" rx="8" />
          </g>
          <g stroke="#d0d7cc" strokeWidth="14" fill="none">
            <path d="M0 210L260 180 800 200M240 0L290 500M450 0L470 300 590 500M0 370L400 345 690 370M0 80L800 65M100 0L120 500M0 280L730 260" />
          </g>
          <g stroke="white" strokeWidth="9" fill="none">
            <path d="M0 210L260 180 800 200M240 0L290 500M450 0L470 300 590 500M0 370L400 345 690 370M0 80L800 65M100 0L120 500M0 280L730 260" />
          </g>
          <path
            d="M-20 450L170 345 320 225 520 130 700 80"
            stroke="#e9d394"
            strokeWidth="20"
            fill="none"
          />
          <path
            d="M-20 450L170 345 320 225 520 130 700 80"
            stroke="#fff5d9"
            strokeWidth="12"
            fill="none"
          />
          <g fill="#788470" fontSize="15" fontFamily="sans-serif">
            <text x="145" y="110">
              SAN MANUEL
            </text>
            <text x="355" y="165">
              SAN PEDRO
            </text>
            <text x="170" y="300">
              TINIGUIBAN
            </text>
            <text x="405" y="430">
              CITY PROPER
            </text>
            <text x="678" y="290" fill="#508898">
              PUERTO
            </text>
            <text x="678" y="313" fill="#508898">
              PRINCESA BAY
            </text>
            <text x="325" y="350" fontSize="12">
              Rizal Avenue
            </text>
          </g>
        </svg>
        <span
          className="current-location"
          style={{ left: "47%", top: "51%" }}
          aria-label="Demo current location"
        />
        {points.map(({ b, x, y }) => (
          <button
            style={{ left: `${x}%`, top: `${y}%` }}
            key={b.id}
            className={`fallback-marker ${b.id === selected ? "selected" : ""}`}
            aria-label={`View ${b.name} on map`}
            onClick={() => onSelect(b.id)}
          >
            <MapPin size={19} />
          </button>
        ))}
      </div>
      <div className="map-controls">
        <button
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2.4))}
        >
          <Plus size={18} />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
        >
          <Minus size={18} />
        </button>
        <button
          aria-label="Recenter map"
          onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
        >
          <LocateFixed size={18} />
        </button>
      </div>
      <div className="map-attribution">
        Simulated map · approximate positions
      </div>
    </div>
  );
}
