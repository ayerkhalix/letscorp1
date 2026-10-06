"use client";
import Link from "next/link";
import { Bookmark, Star, MapPin, BadgeCheck } from "lucide-react";
import type { Business } from "@/types";
import { useApp } from "@/components/providers";
import { money } from "@/data/mock";
export function BusinessCard({
  business: b,
  wide = false,
}: {
  business: Business;
  wide?: boolean;
}) {
  const { saved, toggleSave } = useApp();
  return (
    <article className={`business-card ${wide ? "wide-card" : ""}`}>
      <Link href={`/business/${b.id}/`} className="card-image">
        <img src={b.image} alt={b.name} loading="lazy" />
        {b.featured && (
          <span className="image-badge">
            <BadgeCheck size={12} />
            Local favorite
          </span>
        )}
      </Link>
      <button
        className={`save-button ${saved.includes(b.id) ? "saved" : ""}`}
        aria-label={`${saved.includes(b.id) ? "Unsave" : "Save"} ${b.name}`}
        onClick={() => toggleSave(b.id)}
      >
        <Bookmark
          size={17}
          fill={saved.includes(b.id) ? "currentColor" : "none"}
        />
      </button>
      <div className="card-copy">
        <div className="card-meta">
          <span>{b.category}</span>
          <span>
            <Star size={13} className="star" fill="currentColor" />
            {b.rating}
          </span>
        </div>
        <Link href={`/business/${b.id}/`}>
          <h3>{b.name}</h3>
        </Link>
        <p className="card-location">
          <MapPin size={13} />
          {b.address.replace(", Puerto Princesa", "")}
          <span>· {b.distance}</span>
        </p>
        {wide && <p className="card-description">{b.description}</p>}
        <div className="card-bottom">
          {b.price ? (
            <span>
              <strong>{money(b.price)}</strong>
              <small>
                {" "}
                /{" "}
                {b.category === "Resorts" || b.category === "Hotels"
                  ? "night"
                  : "person"}{" "}
                · sample
              </small>
            </span>
          ) : (
            <span className={b.open ? "open-status" : "closed-status"}>
              {b.open ? "Open now" : "Closed now"}
            </span>
          )}
          <Link href={`/business/${b.id}/`}>View place</Link>
        </div>
      </div>
    </article>
  );
}
