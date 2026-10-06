"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  Star,
  Search,
  Coffee,
  Waves,
  ShoppingBag,
  Scissors,
  CalendarDays,
} from "lucide-react";
import { businesses, posts } from "@/data/mock";
import { services } from "@/components/navigation/services";
import { BusinessCard } from "@/components/business/business-card";
import { SectionTitle, SearchInput } from "@/components/ui/shared";
import { AppMap } from "@/components/maps/app-map";
import { useApp } from "@/components/providers";
import { EmptyState } from "@/components/ui/states";
export function HomeScreen() {
  const [search, setSearch] = useState("");
  const { location } = useApp();
  const normalized = search.toLowerCase();
  const results = businesses.filter((b) =>
    `${b.name} ${b.category} ${b.address} ${b.tags.join(" ")}`
      .toLowerCase()
      .includes(normalized),
  );
  const matchingPosts = posts.filter((p) =>
    `${p.title} ${p.caption}`.toLowerCase().includes(normalized),
  );
  return (
    <div className="home-screen">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">A LITTLE MORE LOCAL</span>
          <h1>Good things are close by.</h1>
        </div>
        <span className="local-label">
          <MapPin size={15} />
          {location}, Palawan
        </span>
      </div>
      <section className="home-hero">
        <img
          className="hero-photo"
          src="/images/hero-coast.jpg"
          alt="Turquoise water and green islands in Palawan"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="hero-eyebrow">
            <span />
            ONE ISLAND. ENDLESS POSSIBILITIES.
          </span>
          <h2>
            Discover more.
            <br />
            Connect local<span>.</span>
          </h2>
          <p>
            Your favorite places. Your next adventure.
            <br />
            Your community, all in one place.
          </p>
          <div className="hero-search">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search businesses, services, places..."
            />
            <button
              className="btn btn-primary"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>(".hero-search input")
                  ?.focus()
              }
              aria-label="Search local places"
            >
              <Search size={19} />
              <span>Search</span>
            </button>
          </div>
          <div className="hero-popular">
            <span>POPULAR NEARBY</span>
            <Link href="/work/?category=Food%20%26%20Dining">Coffee spots</Link>
            <Link href="/travel/">Island escapes</Link>
            <Link href="/see/">Local deals</Link>
          </div>
        </div>
        <div className="hero-location">
          <MapPin size={14} />
          <span>
            Beautifully Palawan
            <small>Your island, waiting to be explored</small>
          </span>
        </div>
      </section>
      {search && (
        <section className="search-results">
          <SectionTitle
            title={`Results for “${search}”`}
            description={`${results.length + matchingPosts.length} local connections`}
          />
          {!results.length && !matchingPosts.length ? (
            <EmptyState title="No local matches yet" />
          ) : (
            <>
              <div className="result-grid">
                {results.map((b) => (
                  <Link key={b.id} href={`/business/${b.id}/`}>
                    <img src={b.image} alt="" />
                    <span>
                      <strong>{b.name}</strong>
                      <small>
                        {b.kind === "travel" ? "Travel" : "Business"} ·{" "}
                        {b.category} · {b.address.split(",")[0]}
                      </small>
                    </span>
                  </Link>
                ))}
                {matchingPosts.map((p) => (
                  <Link href={`/see/${p.id}/`} key={p.id}>
                    <img src={p.image} alt="" />
                    <span>
                      <strong>{p.title}</strong>
                      <small>
                        Let’s See · {p.sponsored ? "Sponsored" : "Local post"}
                      </small>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      )}
      <section className="services-section">
        <SectionTitle
          title="Explore Let’s Corp"
          description="Six ways to make the most of local."
        />
        <div className="service-grid">
          {services.map((s) => (
            <Link
              href={`/${s.id}/`}
              className={`service-tile ${s.tone}`}
              key={s.id}
            >
              <span className="service-icon">
                <s.icon size={26} strokeWidth={1.7} />
              </span>
              <strong>{s.name}</strong>
              {s.id === "eat" ? (
                <small className="soon-label">COMING SOON</small>
              ) : (
                <small>{s.description}</small>
              )}
            </Link>
          ))}
        </div>
      </section>
      <section className="featured-section">
        <SectionTitle
          eyebrow="THE NEIGHBORHOOD EDIT"
          title="Featured around you"
          description="Local favorites. Worth getting to know."
          href="/work/"
          action="Explore businesses"
        />
        <div className="business-grid featured-grid">
          {[businesses[0], businesses[5], businesses[2]].map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </section>
      <div className="home-lower-grid">
        <section>
          <SectionTitle
            eyebrow="HAPPENING HERE"
            title="A little local buzz"
            href="/see/"
            action="See what’s new"
          />
          <div className="buzz-list">
            {posts.slice(0, 3).map((p) => {
              const b = businesses.find((b) => b.id === p.businessId)!;
              return (
                <Link href={`/see/${p.id}/`} className="buzz-card" key={p.id}>
                  <img src={p.image} alt={p.title} />
                  <div>
                    <span className="badge subtle">{p.type}</span>
                    <h3>{p.title}</h3>
                    <p>
                      {b.name} <span>· {p.time}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="home-map-section">
          <SectionTitle
            eyebrow="FIND YOUR NEXT FAVORITE"
            title="Your neighborhood, mapped"
            href="/work/?view=map"
            action="Open map"
          />
          <AppMap
            items={businesses.filter((b) => b.kind !== "travel").slice(0, 7)}
            compact
          />
          <div className="map-section-bottom">
            <span>
              <span className="location-dot" />
              Local places, real connections
            </span>
            <Link href="/work/?view=map">Explore nearby</Link>
          </div>
        </section>
      </div>
      <section className="create-banner">
        <div className="create-banner-icon">
          <Sparkles size={29} />
        </div>
        <div>
          <span className="eyebrow">FOR THE DREAMERS & DOERS</span>
          <h2>Big ideas start local.</h2>
          <p>Let’s make something great for your business.</p>
        </div>
        <Link className="btn btn-primary" href="/create/">
          Explore Let’s Create
        </Link>
      </section>
      <div className="home-values">
        <span>
          <MapPin size={16} />
          Rooted in Puerto Princesa
        </span>
        <span>
          <Star size={16} />
          Made for local businesses
        </span>
        <span>
          <Sparkles size={16} />
          Built around our community
        </span>
      </div>
    </div>
  );
}
