"use client";
import Link from "next/link";
import { Image, Film, Layers, Check } from "lucide-react";
import type { Package } from "@/types";
import { money } from "@/data/mock";
export function PackageCard({ item: p }: { item: Package }) {
  const Icon =
    p.group === "REELS" ? Film : p.group === "BUNDLES" ? Layers : Image;
  return (
    <article className={`package-card ${p.group.toLowerCase()}`}>
      <div className="package-art">
        <Icon size={35} strokeWidth={1.4} />
        <span>
          {p.group === "REELS"
            ? "Make it move."
            : p.group === "BUNDLES"
              ? "One brand. More possibilities."
              : "Your next big little idea."}
        </span>
        {p.id === "three-graphics" && (
          <span className="package-popular">LOCAL FAVORITE</span>
        )}
      </div>
      <div className="package-copy">
        <span className="eyebrow">{p.group}</span>
        <h3>{p.title}</h3>
        <p>{p.useCase}</p>
        <span className="package-deliverable">
          <Check size={14} />
          {p.deliverable}
        </span>
        <div className="package-price">
          <strong>{money(p.price)}</strong>
          <small>
            Sample / test pricing
            <br />
            Prices are not final.
          </small>
        </div>
        <Link
          href={`/create/request/?package=${p.id}`}
          className="btn btn-outline full-width"
        >
          Choose package
        </Link>
      </div>
    </article>
  );
}
