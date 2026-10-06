"use client";
import { useState } from "react";
import Link from "next/link";
import { Megaphone, Sparkles, MapPin } from "lucide-react";
import { posts, businesses } from "@/data/mock";
import { PostCard } from "@/components/feed/post-card";
import { PageTitle, Chips, BackLink } from "@/components/ui/shared";
import { EmptyState } from "@/components/ui/states";
export function FeedScreen({ postId }: { postId?: string }) {
  const [category, setCategory] = useState("For you");
  const visible = postId
    ? posts.filter((p) => p.id === postId)
    : posts.filter(
        (p) =>
          category === "For you" ||
          (category === "Sponsored" ? p.sponsored : p.type === category),
      );
  return (
    <div>
      <PageTitle
        title="Let’s See"
        description="Discover what’s happening around Puerto Princesa."
      >
        <Link className="btn btn-outline" href="/advertise/">
          <Megaphone size={16} />
          Advertise with us
        </Link>
      </PageTitle>
      {postId ? (
        <BackLink href="/see/" label="Back to your local feed" />
      ) : (
        <Chips
          options={[
            "For you",
            "Deals",
            "Promotions",
            "Events",
            "Announcements",
            "Sponsored",
          ]}
          value={category}
          onChange={setCategory}
        />
      )}
      <div className="feed-layout">
        <div className="feed-column">
          {visible.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {!visible.length && (
            <EmptyState title="No updates in this category yet" />
          )}
        </div>
        <aside className="feed-aside">
          <div className="community-note">
            <span className="eyebrow">AROUND YOUR CORNER</span>
            <h2>
              Small businesses.
              <br />
              Big local energy.
            </h2>
            <p>
              Discover the people, places, and ideas that make our community
              ours.
            </p>
            <MapPin size={25} />
          </div>
          <div className="aside-section">
            <h3>Places you might love</h3>
            {[businesses[0], businesses[5], businesses[6]].map((b) => (
              <Link
                key={b.id}
                className="suggested-business"
                href={`/business/${b.id}/`}
              >
                <img src={b.image} alt="" />
                <span>
                  <strong>{b.name}</strong>
                  <small>{b.category}</small>
                </span>
              </Link>
            ))}
          </div>
          <div className="advertise-note">
            <Megaphone size={24} />
            <h3>Be part of the local buzz.</h3>
            <p>Put your business in front of more local customers.</p>
            <Link className="btn btn-primary full-width" href="/advertise/">
              Explore advertising
            </Link>
            <small>Concept advertising products</small>
          </div>
          <Link href="/create/" className="create-aside-link">
            <Sparkles size={17} />
            Need a hand creating your next post?
          </Link>
        </aside>
      </div>
    </div>
  );
}
