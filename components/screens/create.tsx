"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  WandSparkles,
  Palette,
  Image,
  Film,
  MessageSquareText,
  CheckCircle2,
  Layers,
  Clock,
  MessageCircle,
} from "lucide-react";
import { packages } from "@/data/mock";
import { PackageCard } from "@/components/create/package-card";
import {
  PageTitle,
  SectionTitle,
  Chips,
  PrototypeNotice,
} from "@/components/ui/shared";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
export function CreateScreen() {
  const [tab, setTab] = useState("studio");
  const [category, setCategory] = useState("All");
  return (
    <div className="create-screen">
      <PageTitle
        title="Let’s Create"
        description="A little creativity. A lot of possibility."
      >
        <Link className="btn btn-outline" href="/create/orders/">
          <Layers size={16} />
          My requests
        </Link>
      </PageTitle>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="create-tabs">
          <TabsTrigger value="studio">
            <Palette size={18} />
            <span>
              Do It For You<small>Made by our creative team</small>
            </span>
          </TabsTrigger>
          <TabsTrigger value="ai">
            <WandSparkles size={18} />
            <span>
              AI Do It Yourself<small>Your idea, your creative workspace</small>
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="studio">
          <section className="create-hero">
            <div>
              <span className="eyebrow">
                YOU RUN YOUR BUSINESS. WE’LL MAKE IT SHINE.
              </span>
              <h2>
                Great local businesses
                <br />
                deserve great content<span>.</span>
              </h2>
              <p>
                Professional content for your business, made for you.
                <br />
                Posters, social graphics, and reels with your story at the
                center.
              </p>
              <div className="create-hero-features">
                <span>
                  <CheckCircle2 size={15} />
                  Made for your brand
                </span>
                <span>
                  <MessageCircle size={15} />A real conversation
                </span>
                <span>
                  <Clock size={15} />
                  Simple request process
                </span>
              </div>
            </div>
            <div
              className="creative-stack"
              aria-label="Example promotional designs"
            >
              <div className="creative-poster rear">
                <span>ISLAND DAYS</span>
                <img
                  src="/images/island.jpg"
                  alt="Island promotional example"
                />
                <strong>
                  Your next
                  <br />
                  little escape.
                </strong>
              </div>
              <div className="creative-poster front">
                <span>PALAWAN BREW CAFÉ</span>
                <img
                  src="/images/coffee.jpg"
                  alt="Coffee promotional example"
                />
                <strong>
                  Good coffee.
                  <br />
                  Better company.
                </strong>
                <small>A LITTLE LOCAL. A LOT TO LOVE.</small>
              </div>
            </div>
          </section>
          <PrototypeNotice>
            <strong>Sample / test pricing.</strong> Prices are not final.
            Turnaround and deliverables are illustrative.
          </PrototypeNotice>
          <SectionTitle
            title="What shall we make?"
            description="Pick a starting point. We’ll take it from there."
          />
          <Chips
            options={["All", "STILL", "REELS", "BUNDLES"]}
            value={category}
            onChange={setCategory}
          />
          <div className="package-grid">
            {packages
              .filter((p) => category === "All" || p.group === category)
              .map((p) => (
                <PackageCard key={p.id} item={p} />
              ))}
          </div>
          <section className="how-it-works">
            <SectionTitle title="From your idea to a little local magic" />
            <div>
              {[
                {
                  n: "01",
                  t: "Choose your content",
                  d: "A poster, a reel, or a coordinated bundle.",
                },
                {
                  n: "02",
                  t: "Tell us your story",
                  d: "Share your business, your offer, and your assets.",
                },
                {
                  n: "03",
                  t: "Let’s bring it to life",
                  d: "Follow progress and collaborate in Let’s Chat.",
                },
              ].map((s) => (
                <article key={s.n}>
                  <span>{s.n}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="ai">
          <div className="ai-intro">
            <WandSparkles size={35} />
            <span className="badge yellow">Prototype AI experience</span>
            <h2>Create it yourself with AI</h2>
            <p>
              Generate promotional graphics and content using AI-powered tools.
              <br />
              Explore a simulated workspace for your next local idea.
            </p>
            <Link className="btn btn-primary" href="/create/ai/">
              Open creative workspace
            </Link>
          </div>
          <div className="ai-tools-grid">
            {[
              { icon: Image, name: "Generate Poster" },
              { icon: Palette, name: "Generate Product Image" },
              { icon: Layers, name: "Generate Social Post" },
              { icon: Film, name: "Generate Promo Video" },
              { icon: MessageSquareText, name: "Generate Caption" },
            ].map((t) => (
              <Link
                key={t.name}
                href={`/create/ai/?tool=${encodeURIComponent(t.name)}`}
              >
                <t.icon size={23} />
                <h3>{t.name}</h3>
                <p>Start with your idea. Explore a sample result.</p>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
