"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Map,
  SlidersHorizontal,
  Check,
  Bell,
  Utensils,
  Palmtree,
} from "lucide-react";
import { toast } from "sonner";
import { businesses, travelCategories, workCategories } from "@/data/mock";
import { AppMap } from "@/components/maps/app-map";
import { BusinessCard } from "@/components/business/business-card";
import {
  PageTitle,
  SectionTitle,
  SearchInput,
  Chips,
  PrototypeNotice,
} from "@/components/ui/shared";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function DirectoryScreen({
  type = "work",
}: {
  type?: "work" | "travel" | "eat";
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("list");
  const [focus, setFocus] = useState<string>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState("Recommended");
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "map") setView("map");
    if (params.get("focus")) {
      setFocus(params.get("focus")!);
      setView("map");
    }
    if (params.get("category")) setCategory(params.get("category")!);
  }, []);
  const options =
    type === "travel"
      ? travelCategories
      : type === "eat"
        ? [
            "All",
            "Filipino",
            "Coffee",
            "Fast Food",
            "Seafood",
            "Desserts",
            "Asian",
            "Western",
            "Healthy",
          ]
        : workCategories;
  const data = useMemo(
    () =>
      businesses.filter(
        (b) =>
          (type === "travel"
            ? b.kind === "travel"
            : type === "eat"
              ? b.kind === "restaurant"
              : true) &&
          (!openOnly || b.open),
      ),
    [type, openOnly],
  );
  const filtered = useMemo(() => {
    const list = data.filter(
      (b) =>
        (category === "All" ||
          b.category === category ||
          b.tags.includes(category) ||
          (category === "Tourism" && b.kind === "travel") ||
          (category === "Shopping" && b.category === "Retail")) &&
        `${b.name} ${b.category} ${b.address} ${b.tags.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
    return sort === "Top rated"
      ? list.sort((a, b) => b.rating - a.rating)
      : sort === "Nearest first"
        ? list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        : list;
  }, [data, category, search, sort]);
  return (
    <div className={`directory-screen ${type}-screen`}>
      <PageTitle
        title={`Let’s ${type === "work" ? "Work" : type === "travel" ? "Travel" : "Eat"}`}
        description={
          type === "work"
            ? "Discover local businesses in Puerto Princesa."
            : type === "travel"
              ? "Plan your next Palawan experience."
              : "Something delicious is on the way."
        }
        badge={type === "eat" ? "Coming Soon" : undefined}
      >
        {type === "work" && (
          <Link className="btn btn-outline" href="/subscriptions/">
            List your business
          </Link>
        )}
        {type === "eat" && (
          <Button onClick={() => setNotifyOpen(true)}>
            <Bell size={16} />
            Keep me posted
          </Button>
        )}
      </PageTitle>
      {type === "travel" && (
        <div className="travel-hero">
          <img src="/images/island.jpg" alt="Palawan island coast" />
          <div>
            <span className="hero-eyebrow">TAKE THE SCENIC ROUTE</span>
            <h2>
              A little escape.
              <br />A lot of Palawan.
            </h2>
            <p>Island days, local guides, unforgettable places.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setCategory("Island Tours");
                document
                  .getElementById("directory-controls")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Find an experience
            </button>
          </div>
          <span className="travel-location">Palawan, Philippines</span>
        </div>
      )}
      {type === "eat" && (
        <div className="eat-preview-banner">
          <Utensils size={38} />
          <div>
            <span className="eyebrow">LET’S MAKE ROOM AT THE TABLE</span>
            <h2>Your next craving, connected.</h2>
            <p>
              Food ordering is coming soon. For now, discover local restaurants,
              <br className="desktop-only" /> explore their menus, and say
              hello.
            </p>
          </div>
          <span className="badge yellow">Coming Soon</span>
        </div>
      )}
      <div id="directory-controls" className="directory-controls">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={
            type === "travel"
              ? "Search resorts, tours, travel agencies..."
              : type === "eat"
                ? "Search food, coffee, restaurants..."
                : "Search businesses..."
          }
        >
          <button
            className="filter-search-button"
            aria-label="Open filters"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={18} />
          </button>
        </SearchInput>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="list">
              <LayoutGrid size={16} />
              List
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map size={16} />
              Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Chips options={options} value={category} onChange={setCategory} />
      {view === "list" && !search && category === "All" && (
        <section className="directory-featured">
          <SectionTitle
            title={
              type === "travel"
                ? "Stay somewhere special"
                : type === "eat"
                  ? "Meet your next favorite"
                  : "The local favorites"
            }
            description={
              type === "travel"
                ? "Wake up somewhere worth remembering."
                : "Loved by the neighborhood. Discovered by you."
            }
          />
          <div className="horizontal-cards">
            {data
              .filter((b) => b.featured)
              .slice(0, 4)
              .map((b) => (
                <BusinessCard business={b} key={b.id} />
              ))}
          </div>
        </section>
      )}
      <SectionTitle
        title={
          view === "map"
            ? "Explore on the map"
            : type === "travel"
              ? "Your next island story"
              : type === "eat"
                ? "Around your table"
                : "Discover your neighborhood"
        }
        description={`${filtered.length} ${type === "travel" ? "places & experiences" : "local businesses"}${openOnly ? " · Open now" : ""}`}
      >
        <button className="sort-button" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal size={15} />
          {sort}
        </button>
      </SectionTitle>
      {!filtered.length ? (
        <EmptyState
          title="No places found"
          description="Try another category or adjust your search."
        />
      ) : view === "map" ? (
        <div className="map-list-layout">
          <AppMap items={filtered} focus={focus} />
          <div className="map-side-list">
            {filtered.map((b) => (
              <button
                key={b.id}
                className={`map-list-row ${focus === b.id ? "selected" : ""}`}
                onClick={() => setFocus(b.id)}
              >
                <img src={b.image} alt="" />
                <span>
                  <strong>{b.name}</strong>
                  <small>
                    {b.category} · {b.rating} ★
                  </small>
                  <small>{b.address.split(",")[0]}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="business-grid directory-grid">
          {filtered.map((b) => (
            <BusinessCard key={b.id} business={b} wide />
          ))}
        </div>
      )}
      {type === "travel" && view === "list" && (
        <PrototypeNotice>
          Sample discovery rates. Contact providers directly for availability
          and final prices.
        </PrototypeNotice>
      )}
      {type === "eat" && (
        <>
          <PrototypeNotice>
            Food ordering and delivery are coming soon. Restaurant discovery and
            messaging are available in this preview.
          </PrototypeNotice>
          <SectionTitle title="A taste of what’s coming" />
          <div className="dish-grid">
            {[
              {
                name: "Island seafood platter",
                price: "₱650",
                image: "/images/food.jpg",
              },
              {
                name: "Your everyday coffee",
                price: "₱120",
                image: "/images/coffee.jpg",
              },
              {
                name: "Filipino comfort favorites",
                price: "₱180",
                image: "/images/food.jpg",
              },
            ].map((d, i) => (
              <Link
                key={d.name}
                href={`/business/${i === 1 ? "palawan-brew" : "kusina-palawan"}/`}
              >
                <img src={d.image} alt={d.name} />
                <h3>{d.name}</h3>
                <p>From {d.price} · sample menu price</p>
              </Link>
            ))}
          </div>
        </>
      )}
      <Dialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Make it your kind of local"
        description="Filter and sort your discoveries."
      >
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
          />
          Only show businesses open now
        </label>
        <label className="field">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {["Recommended", "Top rated", "Nearest first"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <Button className="full-width" onClick={() => setFilterOpen(false)}>
          Show {filtered.length} places
        </Button>
        <Button
          variant="ghost"
          className="full-width"
          onClick={() => {
            setOpenOnly(false);
            setSort("Recommended");
            setCategory("All");
            setSearch("");
            setFilterOpen(false);
          }}
        >
          Reset filters
        </Button>
      </Dialog>
      <Dialog
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
        title="Be first at the table"
        description="Join the local interest list for Let’s Eat."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(
              "You’re on the demo interest list. No email will be sent.",
            );
            setNotifyOpen(false);
          }}
        >
          <label className="field">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <p className="small muted">
            Prototype signup only. Your email stays on this device.
          </p>
          <Button className="full-width">Notify me when it’s ready</Button>
        </form>
      </Dialog>
    </div>
  );
}
